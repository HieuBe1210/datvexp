import { HomeContent } from "./HomeContent/HomeContent";
import "./HomeContent/HomeContent.scss";
import MovieSchedule from "./MovieSchedule/MovieSchedule";
import MovieTicketBanner from "./MovieTicketBanner/MovieTicketBanner";
export const Home = () => {
  return (
    <>
      <div className="content ">
        <div className="movie-ticket-section">
          <MovieTicketBanner />
        </div>
        <HomeContent />
        <section className="movie-schedule-section" id="movie-schedule">
          <MovieSchedule />
        </section>
      </div>
    </>
  );
};
