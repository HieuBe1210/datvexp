import React, { useState, useEffect } from "react";
import { getDatabase, ref, query, onValue } from "firebase/database";
import { fetchMoviesByIdFromFirebase } from "../../../services/firebase/firebaseMovie.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faCirclePlay,
  faComment,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./FeaturedComments.scss";
import LazyImage from "../../../components/LazyImage.jsx";
import { useNavigate } from "react-router-dom";
import TrailerModal from "../../../components/TrailerModal/TrailerModal.jsx";

const ITEMS_PER_PAGE = 3;
const MAX_COMMENTS_PER_MOVIE = 2;

const FeaturedComments = () => {
  const [commentsByMovie, setCommentsByMovie] = useState({});
  const [moviesData, setMoviesData] = useState({});
  const [visibleMovies, setVisibleMovies] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [openTrailerModal, setOpenTrailerModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");

    const unsubscribe = onValue(commentsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setCommentsByMovie({});
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const fetchedComments = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
          timestamp: new Date(value.timestamp).getTime(),
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      const groupedComments = {};
      fetchedComments.forEach((comment) => {
        const movieId = comment.movieId;
        if (!groupedComments[movieId]) {
          groupedComments[movieId] = [];
        }
        if (groupedComments[movieId].length < MAX_COMMENTS_PER_MOVIE) {
          groupedComments[movieId].push(comment);
        }
      });

      if (JSON.stringify(groupedComments) !== JSON.stringify(commentsByMovie)) {
        const movieIds = Object.keys(groupedComments);
        const movies = {};
        for (const movieId of movieIds) {
          try {
            const movie = await fetchMoviesByIdFromFirebase(movieId);
            if (movie) {
              movies[movieId] = movie;
            }
          } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu phim ${movieId}:`, error);
          }
        }

        setMoviesData(movies);
        setCommentsByMovie(groupedComments);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [commentsByMovie]);

  const handleShowMore = () => {
    setVisibleMovies((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleClickComment = (movieId) => {
    navigate(`/movieinf/${movieId}`);
  };

  const handleOpenCommentModal = (comment) => {
    setSelectedComment(comment);
    setOpenCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
    setSelectedComment(null);
  };

  const handleOpenTrailerModal = (movie) => {
    console.log("Opening trailer modal in FeaturedComments for:", movie);
    setSelectedMovie(movie);
    setOpenTrailerModal(true);
  };

  const handleCloseTrailerModal = () => {
    console.log("Closing trailer modal in FeaturedComments");
    setOpenTrailerModal(false);
    setSelectedMovie(null);
  };

  // Định dạng số lượng comment (ví dụ: 27600 thành "27.6K")
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };
  if (loading) {
    return <div>Đang tải bình luận...</div>;
  }
  // Sắp xếp movieIds dựa trên timestamp của bình luận mới nhất
  const sortedMovieIds = Object.keys(commentsByMovie).sort((a, b) => {
    const latestCommentA = commentsByMovie[a][0]; // Bình luận đầu tiên là mới nhất vì đã sắp xếp trước đó
    const latestCommentB = commentsByMovie[b][0];
    return latestCommentB.timestamp - latestCommentA.timestamp; // Sắp xếp giảm dần
  });

  return (
    <div className="featured-comments-container">
      <h2 className="featured-comments-title">Bình luận nổi bật</h2>

      <div className="featured-comments-grid">
        {sortedMovieIds.slice(0, visibleMovies).map((movieId) => {
          const movie = moviesData[movieId];
          const comments = commentsByMovie[movieId];
          if (!movie || !comments) return null;

          return (
            <div key={movieId} className="featured-comment-card">
              <div className="featured-comment-thumbnail">
                <LazyImage src={movie.background} alt={movie.title} />
                <div className="play-icon" onClick={() => handleOpenTrailerModal(movie)}>
                  <FontAwesomeIcon icon={faCirclePlay} />
                </div>
                {/* Thêm phần hiển thị thông tin phim trên thumbnail */}
                <div className="thumbnail-info">
                  <h3 className="thumbnail-movie-title">{movie.movie_name}</h3>
                  <div className="thumbnail-stats">
                    <span className="imdb">
                      <FontAwesomeIcon icon={faStar} /> {movie.rating || "0"}
                    </span>
                    <span className="comments">
                      <FontAwesomeIcon icon={faComment} /> {formatNumber(movie.totalRatings || 0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="featured-comment-info">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <LazyImage
                        src={comment.avatar}
                        alt={comment.username}
                        width="40px"
                        height="40px"
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <p className="username">{comment.username}</p>
                        <p className="timestamp">{formatDate(comment.timestamp)}</p>
                      </div>
                      {comment.purchased && <span className="verified-badge">Đã mua qua MoMo</span>}
                    </div>
                    <p className="comment-content" onClick={() => handleOpenCommentModal(comment)}>
                      {comment.content}
                    </p>
                  </div>
                ))}
                <button className="view-more-comment" onClick={() => handleClickComment(movieId)}>
                  Xem thêm
                  <span className="arrow-icon">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleMovies < sortedMovieIds.length && (
        <button className="show-more-button" onClick={handleShowMore}>
          Xem tiếp nhé!
          <span className="arrow-icon">
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
        </button>
      )}

      {openCommentModal && selectedComment && (
        <div className="custom-modal-overlay" onClick={handleCloseCommentModal}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseCommentModal}>
              ✕
            </button>
            <div className="modal-commen-wrapper">
              <div className="modal-header">
                <LazyImage
                  src={selectedComment.avatar}
                  alt={selectedComment.username}
                  width="40px"
                  height="40px"
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="username">{selectedComment.username}</p>
                  <p className="timestamp">{formatDate(selectedComment.timestamp)}</p>
                </div>
              </div>
              <p className="modal-comment-content">{selectedComment.content}</p>
            </div>
          </div>
        </div>
      )}

      <TrailerModal
        isOpen={openTrailerModal}
        onClose={handleCloseTrailerModal}
        movie={selectedMovie}
      />
    </div>
  );
};

export default FeaturedComments;
