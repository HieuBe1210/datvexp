import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPromotionBySlug } from "../../services/firebase/firebasePromotion";
import FullPageSkeleton from "../../components/Loading/LoadingScreen";
import "./PromotionDetail.scss"; // Import CSS riêng cho trang này
import { fetchRelatedPromotions } from "../../services/service/servicePromotion";

const PromotionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPromotions, setRelatedPromotions] = useState([]);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // STATE CUỘN NGANG CHO CÁC BÀI VIẾT LIÊN QUAN
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft -= 220; // Cuộn trái 220px
      updateScrollState(); // Cập nhật trạng thái cuộn
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft += 220; // Cuộn phải 220px
      updateScrollState(); // Cập nhật trạng thái cuộn
    }
  };
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Kiểm tra nếu danh sách có thể cuộn hay không
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      updateScrollState(); // Cập nhật trạng thái cuộn ngay sau khi dữ liệu được tải
    }
  }, [relatedPromotions]); // Chạy khi danh sách thay đổi

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);
      updateScrollState(); // Kiểm tra ngay khi render

      return () => {
        container.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, []);

  useEffect(() => {
    fetchPromotionBySlug(slug).then((data) => {
      setPromotion(data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (promotion) {
      fetchRelatedPromotions(promotion.category, slug).then((data) => {
        setRelatedPromotions(data);
      });
    }
  }, [promotion, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]); // Scroll về đầu trang khi load lại

  if (loading) {
    return <FullPageSkeleton />;
  }

  if (!promotion) {
    return <h2 className="not-found">Sự kiện không tồn tại!</h2>;
  }

  return (
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
      <div className="promotion-wrapper">
        <div className="promotion-detail">
          <h1 className="promotion-title">{promotion.title}</h1>
          <div className="promotion-meta">Ngày đăng tin: {promotion.startDate}</div>
          {/* Hiển thị nội dung HTML từ Firebase */}
          <div className="promotion-content">
            <div dangerouslySetInnerHTML={{ __html: promotion.content }} />
          </div>
        </div>
      </div>
      <div className="related-promotions">
        <h2 className="title">TIN LIÊN QUAN</h2>
        <div className="related-container">
          {canScrollLeft && (
            <button className="scroll-button left" onClick={scrollLeft}>
              ‹
            </button>
          )}
          <div className="related-list" ref={scrollContainerRef}>
            {relatedPromotions.map((related) => (
              <div
                key={related.id}
                className="related-card"
                onClick={() => navigate(`/promotions/${related.slug}`)}>
                <img src={related.thumbnail} alt={related.title} />
                <h3>{related.title}</h3>
              </div>
            ))}
          </div>
          {canScrollRight && (
            <button className="scroll-button right" onClick={scrollRight}>
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
