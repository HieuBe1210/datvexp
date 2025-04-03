import { useEffect, useState } from "react";
import { fetchPromotions } from "../../../services/service/servicePromotion";
import FullPageSkeleton from "../../../components/Skeleton/FullPageSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./HomePromotions.scss";

const ITEMS_PER_PAGE = 6;

const HomePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [visiblePromotions, setVisiblePromotions] = useState(ITEMS_PER_PAGE);
  const [animate, setAnimate] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromotions().then((data) => {
      setPromotions(data);
      setLoadingPromotions(false);
      setAnimate(new Array(data.length).fill(false));
      setTimeout(() => {
        setAnimate((prev) => prev.map((_, index) => index < ITEMS_PER_PAGE));
      }, 100);
    });

    // subscribeToPromotions((data) => {
    //   setPromotions(data);
    //   setLoadingPromotions(false);
    //   setAnimate(new Array(data.length).fill(false));
    //   setTimeout(() => {
    //     setAnimate((prev) =>
    //       prev.map((_, index) => (index < visiblePromotions ? true : prev[index]))
    //     );
    //   }, 100);
    // });
  }, []);

  const handleShowMore = () => {
    setVisiblePromotions((prev) => prev + ITEMS_PER_PAGE);
    setTimeout(() => {
      setAnimate((prev) => prev.map((_, index) => index < visiblePromotions + ITEMS_PER_PAGE));
    }, 100);
  };

  const handleClickEvent = (slug) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    navigate(`/promotions/${slug}`);
  };

  return (
    <div className="home-promotions-container">
      <h2 className="home-promotions-title">Tin tức - Khuyến mãi</h2>

      {loadingPromotions ? (
        <FullPageSkeleton />
      ) : (
        <>
          <div className="home-promotions-grid">
            {promotions.slice(0, visiblePromotions).map((promo, index) => (
              <div
                key={promo.id}
                className={`home-promotion-card ${animate[index] ? "show" : ""}`}
                onClick={() => handleClickEvent(promo.slug)}>
                <img src={promo.thumbnail} alt={promo.title} />
                <div className="home-promotion-info">
                  <h3 className="home-promotion-title">{promo.title}</h3>
                  <p className="home-promotion-description">{promo.description}</p>
                  <p className="home-promotion-date">{promo.expiryDate}</p>
                </div>
              </div>
            ))}
          </div>

          {visiblePromotions < promotions.length && (
            <button className="home-show-more-button" onClick={handleShowMore}>
              Xem thêm{" "}
              <span className="arrow-icon">
                <FontAwesomeIcon icon={faArrowDown} />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default HomePromotions;
