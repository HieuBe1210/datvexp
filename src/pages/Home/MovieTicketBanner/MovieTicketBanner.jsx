import React from "react";
import "./MovieTicketBanner.scss";
import { Link } from "react-scroll";

const MovieTicketBanner = () => {
  const handleScrollToSchedule = () => {
    const scheduleSection = document.getElementById("movie-schedule");
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="movie-ticket-banner">
      <div className="banner-content">
        {/* Phần bên trái: Tiêu đề và danh sách lợi ích */}
        <div className="banner-text">
          <h1>
            Mua vé xem phim <span>Online</span> trên <span>VTI</span>
          </h1>
          <p>
            Với nhiều ưu đãi hấp dẫn và kết nối với tất cả các rạp lớn phổ biến khắp Việt Nam. Đặt
            vé ngay tại VTI!
          </p>
          <ul>
            <li>Mua vé Online, trải nghiệm phim hay</li>
            <li>Đặt vé an toàn trên VTI</li>
            <li>Thỏa sức chọn chỗ ngồi, mua bắp nước tiện lợi</li>
            <li>Lịch sử đặt vé được lưu lại ngay</li>
          </ul>
          {/* Sử dụng JavaScript thuần để cuộn sẽ mượt hơn */}
          <button className="cta-button" onClick={handleScrollToSchedule}>
            Đặt vé ngay
          </button>
        </div>

        {/* Phần bên phải: Hình ảnh minh họa */}
        <div className="banner-image">
          <p className="banner-image-text">
            Đặt vé xem phim trên VTI
            <br />
            Ghế đẹp, giờ hot, vào rạp không chờ đợi!
          </p>
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733633928/contact_5_otvgni.png"
            alt="Movie Ticket Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieTicketBanner;
