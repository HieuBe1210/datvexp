import React from "react";
import "./PolicyPage.scss"; // Dùng chung SCSS với các chính sách khác

const BookingGuide = () => {
  return (
    <div className="content">
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">Hướng Dẫn Đặt Vé Online</h1>
          <p className="policy-updated">
            <strong>Cập nhật lần cuối: 14/02/2025</strong>
          </p>
          <section className="policy-section">
            <p>
              VTI Cinema cung cấp dịch vụ đặt vé trực tuyến tiện lợi qua website
              và ứng dụng di động. Dưới đây là hướng dẫn chi tiết để bạn có thể
              đặt vé dễ dàng.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Bước 1: Chọn Phim & Rạp</h2>
            <p>
              Truy cập vào trang web hoặc ứng dụng VTI Cinema và thực hiện các
              bước sau:
            </p>
            <ul className="policy-list">
              <li>🔍 Tìm kiếm phim bạn muốn xem.</li>
              <li>🎭 Chọn rạp chiếu và suất chiếu phù hợp.</li>
              <li>🛋️ Chọn chỗ ngồi mong muốn.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">
              Bước 2: Chọn Phương Thức Thanh Toán
            </h2>
            <p>
              VTI Cinema hỗ trợ nhiều phương thức thanh toán an toàn và tiện
              lợi:
            </p>
            <ul className="policy-list">
              <li>💳 Thẻ tín dụng / thẻ ghi nợ (Visa, MasterCard, JCB).</li>
              <li>🏦 Thẻ ATM nội địa (có internet banking).</li>
              <li>📱 Ví điện tử (Momo, ZaloPay, ShopeePay, VNPAY).</li>
              <li>🎟️ Điểm thưởng thành viên, mã giảm giá hoặc vé mời.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Bước 3: Nhận Vé Điện Tử</h2>
            <p>
              Sau khi thanh toán thành công, bạn sẽ nhận được vé bằng một trong
              các cách sau:
            </p>
            <ul className="policy-list">
              <li>📩 Email xác nhận đặt vé (bao gồm mã vé).</li>
              <li>
                📱 Hiển thị mã vé trong mục <strong>"Tài khoản của tôi"</strong>{" "}
                trên website hoặc ứng dụng.
              </li>
              <li>
                📜 Quét mã QR trực tiếp trên ứng dụng để vào rạp mà không cần in
                vé.
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Lưu Ý Quan Trọng</h2>
            <ul className="policy-list">
              <li>
                🎬 Vé đã mua <strong>không thể đổi/trả</strong> sau khi thanh
                toán.
              </li>
              <li>
                ⏰ Hãy đến rạp trước giờ chiếu ít nhất 15 phút để kiểm tra vé.
              </li>
              <li>
                📜 Mang theo giấy tờ tùy thân nếu vé có áp dụng ưu đãi (sinh
                viên, người cao tuổi, v.v.).
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Liên Hệ Hỗ Trợ</h2>
            <p>
              Nếu bạn gặp vấn đề khi đặt vé hoặc cần hỗ trợ, vui lòng liên hệ:
              <br />
              <strong>CÔNG TY CỔ PHẦN VTI MEDIA</strong>
              <br />
              Email: vticinema@gmail.com
              <br />
              Số điện thoại: (028) 3775 2524
              <br />
              Địa chỉ: Tầng 3, TTTM VTI, 469 Nguyễn Hữu Thọ, Phường Tân Hưng,
              Quận 7, TP.HCM
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookingGuide;
