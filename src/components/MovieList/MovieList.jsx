import React, { useState, useEffect } from "react";
import { fetchMoviesByTab } from "../../services/service/serviceMovie";
import LazyImage from "../../components/LazyImage";
import { renderStars } from "../../components/Cards/Cards";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import "./MovieList.scss";

const MovieList = ({ initialTab = "nowShowing" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesByTab(activeTab);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeTab]);

  const handleMovieClick = (movieId) => {
    navigate(`/movieinf/${movieId}`); // Điều hướng đến trang chi tiết phim
  };

  return (
    <div className="movies">
      <div className="tab-buttons">
        <button
          className={activeTab === "nowShowing" ? "active" : ""}
          onClick={() => setActiveTab("nowShowing")}
        >
          Phim đang chiếu
        </button>
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Phim sắp chiếu
        </button>
      </div>

      <div className="movie-list-container">
        {loading ? (
          <LoadingScreen message="Đang tải danh sách phim..." size={60} />
        ) : movies.length > 0 ? (
          <>
            <ul className="movie-list">
              {movies.slice(0, showMore ? movies.length : 7).map((movie, index) => (
                <li
                  key={index}
                  className="movie-item"
                  onClick={() => handleMovieClick(movie.movie_id)}
                  style={{ cursor: "pointer" }}
                >
                  <LazyImage src={movie.image} alt={movie.movie_name} height="90px" width="64px" />
                  {movie.viewing_age && (
                    <span className={`age-rating age-${movie.viewing_age}`}>
                      {movie.viewing_age}+
                    </span>
                  )}
                  <div className="movie-thumbnail">
                    <p className="movie-thumbnail__title ">{movie.movie_name}</p>
                    <p className="movie-thumbnail__genre">{movie.genre}</p>
                    <p className="movie-thumbnail__rating">{renderStars(movie.rating)}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Giới hạn số lượng phim hiển thị */}
            {movies.length > 7 && (
              <button className="show-more-button" onClick={() => setShowMore(!showMore)}>
                {showMore ? "Ẩn bớt" : "Xem thêm"}
              </button>
            )}
          </>
        ) : (
          <p>Không có phim nào.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
