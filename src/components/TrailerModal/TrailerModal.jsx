import React from "react";
import ReactDOM from "react-dom"; // Thêm import ReactDOM
import "./TrailerModal.scss";
import { useNavigate } from "react-router-dom";

const TrailerModal = ({ isOpen, onClose, movie }) => {
  const navigate = useNavigate();

  // console.log("TrailerModal props:", { isOpen, movie });

  if (!isOpen || !movie) {
    // console.log("TrailerModal not rendered due to:", { isOpen, movie });
    return null;
  }

  const handleClickComment = (movieId) => {
    navigate(`/movieinf/${movieId}`);
  };

  const modalContent = (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-trailer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <div className="modal-trailer-wrapper">
          <iframe
            width="100%"
            height="315"
            src={movie.trailer}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div>
            <div className="modal-movie-info">
              <div className="modal-movie-thumbnail">
                <img
                  src={movie.image}
                  alt="Movie Thumbnail"
                  onClick={() => handleClickComment(movie.movie_id)}
                />
              </div>
              <div className="modal-movie-detail">
                <span
                  className="modal-movie-title"
                  onClick={() => handleClickComment(movie.movie_id)}
                >
                  {movie.movie_name}
                </span>
                <span className="modal-movie-genre"> - {movie.genre}</span>
                <p className="modal-movie-description">{movie.description}</p>
              </div>
            </div>
            <button className="modal-close-button" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Sử dụng React Portal để render modal vào document.body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default TrailerModal;
