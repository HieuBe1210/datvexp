import FeaturedComments from "./FeaturedComments/FeaturedComments";
import { HomeContent } from "./HomeContent/HomeContent";
import "./HomeContent/HomeContent.scss";
import HomePromotions from "./HomePromotions/HomePromotions";
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
        <section className="featured-comments-section">
          <FeaturedComments />
        </section>
        <section className="promotions-section">
          <HomePromotions />
        </section>
      </div>
    </>
  );
};
