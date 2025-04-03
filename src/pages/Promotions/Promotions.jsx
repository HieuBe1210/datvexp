import { useEffect, useState } from "react";
import { fetchPromotions } from "../../services/service/servicePromotion";
import "./Promotions.scss";
import FullPageSkeleton from "../../components/Skeleton/FullPageSkeleton";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6; // Số lượng sự kiện hiển thị mỗi lần

const Promotions = () => {
  const [promotions, setPromotions] = useState([]); // Danh sách khuyến mãi
  const [loadingPromotions, setLoadingPromotions] = useState(true); // Trạng thái loading riêng cho khuyến mãi
  const [visiblePromotions, setVisiblePromotions] = useState(ITEMS_PER_PAGE); // Hiển thị tối đa 6 sự kiện đầu tiên
  const [animate, setAnimate] = useState([]); // State để kiểm soát hiệu ứng xuất hiện
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh sách khuyến mãi ban đầu
    fetchPromotions().then((data) => {
      setPromotions(data);
      setLoadingPromotions(false);

      // Khởi tạo trạng thái animation với tất cả giá trị false
      setAnimate(new Array(data.length).fill(false));

      // Kích hoạt hiệu ứng xuất hiện cho các mục ban đầu
      setTimeout(() => {
        setAnimate((prev) => prev.map((_, index) => index < ITEMS_PER_PAGE));
      }, 100);
    });

    // Lắng nghe cập nhật danh sách khuyến mãi từ server (real-time update)
    // subscribeToPromotions((data) => {
    //   setPromotions(data);
    //   setLoadingPromotions(false);
    //   setAnimate(new Array(data.length).fill(false));

    //   // Kích hoạt animation khi có dữ liệu mới
    //   setTimeout(() => {
    //     setAnimate((prev) =>
    //       prev.map((_, index) => (index < visiblePromotions ? true : prev[index]))
    //     );
    //   }, 100);
    // });
  }, []);

  // Hàm xử lý khi người dùng bấm "Xem thêm"
  const handleShowMore = () => {
    setVisiblePromotions((prev) => prev + ITEMS_PER_PAGE);

    // Kích hoạt animation từ từ cho các mục mới hiển thị
    setTimeout(() => {
      setAnimate((prev) => prev.map((_, index) => index < visiblePromotions + ITEMS_PER_PAGE));
    }, 100);
  };
  // Hàm xử lý khi bấm vào một sự kiện
  const handleClickEvent = (slug) => {
    sessionStorage.setItem("scrollPosition", window.scrollY); // Lưu vị trí hiện tại
    navigate(`/promotions/${slug}`); // Chuyển sang trang chi tiết
  };

  return (
    <div>
      <div className="container">
        {/* Danh sách khuyến mãi bên trái */}
        <div className="events">
          <h2 className="title">ƯU ĐÃI</h2>

          {/* Nếu đang tải dữ liệu, hiển thị skeleton loading */}
          {loadingPromotions ? (
            <FullPageSkeleton />
          ) : (
            <>
              <div className="event-grid">
                {/* Hiển thị danh sách khuyến mãi theo số lượng hiển thị hiện tại */}
                {promotions.slice(0, visiblePromotions).map((promo, index) => (
                  <div
                    key={promo.id}
                    className={`event-card ${animate[index] ? "show" : ""}`}
                    onClick={() => handleClickEvent(promo.slug)}>
                    <img src={promo.thumbnail} alt={promo.title} />
                    <div className="event-info">
                      <h3 className="event-title">{promo.title}</h3>
                      <a href={`/promotions/${promo.slug}`} className="read-more">
                        Xem chi tiết →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút "Xem thêm" hiển thị nếu còn sự kiện chưa được hiển thị */}
              {visiblePromotions < promotions.length && (
                <button className="show-more-button" onClick={handleShowMore}>
                  Xem thêm
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
