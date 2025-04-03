import { Outlet } from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList";
import "./PromotionsLayout.scss";

const PromotionsLayout = () => {
  return (
    <div className="content">
      <div className="promotions-layout">
        <div className="left-section">
          <Outlet /> {/* Nội dung sẽ là Promotions hoặc PromotionDetail */}
        </div>
        <div className="right-section">
          <MovieList />
        </div>
      </div>
    </div>
  );
};

export default PromotionsLayout;
