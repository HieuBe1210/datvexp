import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchMovies } from "../../../services/service/serviceMovie";
import "./Ticket_Detail.modul.scss";

export const Ticket_Detail = ({ seat_name, showImage = true, onFetchMovieDetails }) => {
  const [movie, setMovie] = useState(null);
  const { movie_id } = useParams();
  const { state } = useLocation(); // Lấy dữ liệu từ navigate state
  const { cinema, date, time, cinema_id, showtime_id } = state || {}; // Dữ liệu truyền từ ConfirmationModal

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const data = await fetchMovies();
        const findMovieById = data.find((movie) => movie.movie_id === parseInt(movie_id));
        setMovie(findMovieById);
        // Gửi thông tin phim lên CardPayment qua callback
        if (findMovieById && onFetchMovieDetails) {
          onFetchMovieDetails({
            movie_id: findMovieById.movie_id,
            movieName: findMovieById.movie_name,
            format: "2D", // Hình thức chiếu cố định
            genre: findMovieById.genre,
            duration: findMovieById.duration,
            theater: cinema || "Không xác định",
            showDate: date || "Không xác định",
            showTime: time || "Không xác định",
            room: "P1",
            seat: seat_name.join(", "),
            cinema_id,
            showtime_id,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMovieData();
  }, [movie_id, cinema, date, time, seat_name, onFetchMovieDetails]);
  // console.log("movie_id in Ticket_Detail:", movie_id);
  // console.log("Cinema: ", cinema);

  return (
    <>
      {movie ? (
        <Detail_Movie
          movie_id={movie_id}
          movie={movie}
          cinema={cinema}
          date={date}
          time={time}
          seat_name={seat_name}
          showImage={showImage} // Truyền prop vào Detail_Movie
        />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export const Detail_Movie = ({ movie, cinema, date, time, seat_name, showImage }) => {
  return (
    <>
      <div className="detail_movie_container">
        {showImage && <img className="detail_movie_img" src={movie.image} alt={movie.movie_name} />}
        <p className="detail_movie_title">{movie.movie_name}</p>
        <div className="detail_movie_info">
          <div className="row">
            <p className="label">Hình thức:</p>
            <p className="value">2D, Phụ đề Tiếng Việt</p>
          </div>
          <div className="row">
            <p className="label">Thể loại:</p>
            <p className="value">{movie.genre}</p>
          </div>
          <div className="row">
            <p className="label">Thời lượng:</p>
            <p className="value">{movie.duration} phút</p>
          </div>
          <div className="row">
            <p className="label">Rạp chiếu:</p>
            <p className="value">{cinema}</p>
          </div>
          <div className="row">
            <p className="label">Ngày chiếu:</p>
            <p className="value">{date}</p>
          </div>
          <div className="row">
            <p className="label">Giờ chiếu:</p>
            <p className="value">{time}</p>
          </div>
          <div className="row">
            <p className="label">Phòng chiếu:</p>
            <p className="value">P1</p>
          </div>
          <div className="row">
            <p className="label">Ghế ngồi:</p>
            <p className="value">{seat_name.join(", ")}</p>
          </div>
        </div>
      </div>
    </>
  );
};
