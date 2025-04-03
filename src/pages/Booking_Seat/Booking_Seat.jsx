import { useEffect } from "react";
// import { CardSeats } from "../../components/Cards/Cards";
import "./Booking_Seat.scss";
import { useLocation } from "react-router-dom";
import { CardSeats } from "./CardSeats";

export const Booking_Seat = () => {
  const { state } = useLocation();
  const { cinema, cinema_id, date, time, movie_id, showtime_id } = state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   // Log để kiểm tra dữ liệu
  //   console.log("Booking_Seat state:", { cinema, cinema_id, date, time, movie_id, showtime_id });
  // }, []);

  return (
    <>
      <div className="content">
        <CardSeats
          cinema={cinema}
          date={date}
          time={time}
          movie_id={movie_id}
          cinema_id={cinema_id}
          showtime_id={showtime_id}
        />
      </div>
    </>
  );
};
