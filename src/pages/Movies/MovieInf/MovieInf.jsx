import React, { useEffect, useState } from "react";
import { CardInfMovie } from "./CardMovie.jsx";
import "./../MovieInf/MovieInf.scss";
import { useParams } from "react-router-dom";
import { fetchMoviesById } from "../../../services/dataService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import BookingFlow from "../../BookingModal/BookingFlow.jsx";

export const MovieInf = () => {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleBookTicket = (movie) => {
    if (!isLoggedIn) {
      toast.warning("Bạn cần đăng nhập trước khi đặt vé!");
    } else {
      setShowBookingFlow(true);
    }
  };

  useEffect(() => {
    const fetchMovieByIdData = async (movie_id) => {
      try {
        const findMovieById = await fetchMoviesById(movie_id);
        setMovie(findMovieById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieByIdData(movie_id);
    window.scrollTo(0, 0);
  }, [movie_id]);

  return (
    <>
      <div className="content">
        {movie && <CardInfMovie movie={movie} onBookTicket={handleBookTicket} />}
      </div>

      {/* Sử dụng BookingFlow */}
      {showBookingFlow && movie && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-container">
            <BookingFlow
              movie={{
                movie_id: movie.movie_id,
                movie_name: movie.movie_name,
                image: movie.image,
                viewing_age: movie.viewing_age,
                duration: movie.duration,
                genre: movie.genre,
                actor: movie.actor,
              }}
              onClose={() => setShowBookingFlow(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
