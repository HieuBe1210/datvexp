import "./card.scss";
import { Link } from "react-router-dom";
import { useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfStroke, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import LazyImage from "../LazyImage";
import TrailerModal from "../TrailerModal/TrailerModal";

// HÀM HIỂN THỊ SAO
export const renderStars = (rating) => {
  const stars = 5; // Tổng số sao (thường là 5 sao trong hệ thống đánh giá)
  const fullStars = Math.floor((rating / 10) * stars); // Tính số sao đầy (rating được chia từ thang điểm 10 thành 5 sao)
  const halfStar = (rating / 10) * stars - fullStars >= 0.5; // Kiểm tra xem có sao nửa không
  const emptyStars = stars - fullStars - (halfStar ? 1 : 0); // Tính số sao rỗng còn lại

  // Kiểm tra nếu không có rating hoặc rating không phải là số
  if (!rating || typeof rating !== "number") {
    return (
      <div className="star-rating">
        {[...Array(stars)].map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={regularStar} />
        ))}
      </div>
    );
  }

  return (
    <div className="star-rating">
      {/* Hiển thị các sao đầy */}
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon={solidStar} /> // Icon sao đầy
      ))}
      {/* Hiển thị sao nửa nếu có */}
      {halfStar && <FontAwesomeIcon icon={faStarHalfStroke} />}
      {/* Hiển thị các sao rỗng */}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={`empty-${index}`} icon={regularStar} /> // Icon sao rỗng
      ))}
    </div>
  );
};

export const CardCarousel = ({ item }) => {
  return (
    <div className="card-content" key={item.id}>
      <div className="card_carousel_img">
        <Link to="#!">
          <div>
            <LazyImage src={item.image_url} alt="Image not found" height="350px" width="100%" />
          </div>
        </Link>
      </div>
    </div>
  );
};
export const CardMovie = ({ item }) => {
  // console.log("Card Item:", item); // Kiểm tra dữ liệu được truyền vào
  return (
    <>
      <div className="card__movie">
        <Link to={`/movieinf/${item.movie_id}`}>
          <div>
            <LazyImage
              className="card__movie__img"
              src={item.image}
              alt={item.movie_name}
              height="320px"
              width="100%"
            />
            <h3 className="line-clamp title-movie">{item.movie_name}</h3>
            <p className="line-clamp"> Diễn viên: {item.actor}</p>
            <div className="row_stars">
              <p>Time: {item.duration} phút</p>
              <div>{renderStars(item.rating || 0)}</div>
            </div>
          </div>
        </Link>
        {/* Thêm nút Đặt vé */}
        <Link to={`/movieinf/${item.movie_id}`}>
          <button className="book-ticket-button">Xem chi tiết</button>
        </Link>
      </div>
    </>
  );
};

// Component CardMovieHome (cập nhật để tích hợp TrailerModal)
export const CardMovieHome = memo(({ item, index }) => {
  const [openTrailerModal, setOpenTrailerModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleOpenTrailerModal = (e) => {
    e.stopPropagation();
    console.log("Opening trailer modal for:", item);
    setSelectedMovie(item);
    setOpenTrailerModal(true);
  };

  const handleCloseTrailerModal = () => {
    console.log("Closing trailer modal");
    setOpenTrailerModal(false);
    setSelectedMovie(null);
  };

  // Debug trước khi render TrailerModal
  // console.log("Rendering TrailerModal with:", { isOpen: openTrailerModal, movie: selectedMovie });

  return (
    <div className="card__movie__home">
      {/* Hiển thị số thứ tự */}
      <div className="movie-index">{index}</div>
      <div className="card__movie__home__poster">
        <Link to={`/movieinf/${item.movie_id}`}>
          <LazyImage
            className="card__movie__home__img"
            src={item.image}
            alt={item.movie_name}
            width="100%"
          />
        </Link>
        <div className="play-button" onClick={handleOpenTrailerModal}>
          <FontAwesomeIcon icon={faCirclePlay} />
        </div>
      </div>
      <Link to={`/movieinf/${item.movie_id}`}>
        <div className="card__movie__home__info">
          <h3 className="line-clamp title-movie">{item.movie_name}</h3>
          <p className="line-clamp">{item.genre}</p>
          <div className="rating">
            <div>{renderStars(item.rating || 0)}</div>
          </div>
        </div>
      </Link>
      <TrailerModal
        isOpen={openTrailerModal}
        onClose={handleCloseTrailerModal}
        movie={selectedMovie}
      />
    </div>
  );
});
