import React from "react";
import "./PolicyPage.scss";

const TermsOfService = () => {
  return (
    <div className="content">
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">ĐIỀU KHOẢN SỬ DỤNG</h1>
          <p className="policy-updated">
            <strong>Cập nhật lần cuối: 14/02/2025</strong>
          </p>
          <section className="policy-section">
            <p>
              Xin vui lòng đọc kỹ các điều khoản sau trước khi sử dụng dịch vụ.
              Khi truy cập trang web hoặc ứng dụng, bạn đã đồng ý với các điều
              khoản sử dụng của chúng tôi. Các điều khoản này có thể thay đổi mà
              không cần thông báo trước, do đó bạn cần kiểm tra thường xuyên để
              cập nhật.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">I. Đối tượng áp dụng</h2>
            <p>
              Tính năng đặt vé trực tuyến chỉ áp dụng cho thành viên của VTI
              Cinema.
            </p>
            <ul className="policy-list">
              <li>
                Quý khách phải đăng ký tài khoản trực tuyến với thông tin xác
                thực.
              </li>
              <li>
                Chịu trách nhiệm về mật khẩu, tài khoản điểm thưởng và các hoạt
                động trên hệ thống.
              </li>
              <li>Thông báo ngay khi tài khoản bị truy cập trái phép.</li>
              <li>Mỗi giao dịch đặt vé có thể thanh toán tối đa 8 vé/lần.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">II. Thực hiện giao dịch</h2>
            <p>
              Khách hàng khi mua vé trực tuyến tại VTI Cinema cần thực hiện các
              bước sau:
            </p>
            <ul className="policy-list">
              <li>Lựa chọn suất chiếu theo phim hoặc rạp.</li>
              <li>Chọn chỗ ngồi, các sản phẩm đi kèm và kiểm tra tổng tiền.</li>
              <li>
                Thanh toán qua thẻ tín dụng, ATM nội địa, ví điện tử, điểm
                thưởng, vé mời.
              </li>
              <li>Nhận mã đặt chỗ qua email và kiểm tra vé đã đặt.</li>
              <li>
                Cung cấp mã đặt vé khi đến rạp hoặc quét QR trên ứng dụng để vào
                rạp.
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">III. Chính sách thanh toán</h2>
            <p>Các hình thức thanh toán trực tuyến bao gồm:</p>
            <ul className="policy-list">
              <li>Điểm thành viên.</li>
              <li>Vé mời (Phiếu quà tặng).</li>
              <li>Thẻ ATM nội địa.</li>
              <li>Thẻ tín dụng quốc tế.</li>
              <li>Ví điện tử (Momo, ZaloPay, ShopeePay, VNPAY).</li>
            </ul>
            <p>
              Chi tiết các phương thức thanh toán được mô tả trong phần tiếp
              theo.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">IV. Chính sách hủy vé</h2>
            <p>
              VTI Cinema chấp nhận hủy vé và hoàn tiền trước giờ chiếu tối thiểu
              30 phút.
            </p>
            <ul className="policy-list">
              <li>Thẻ ATM nội địa: Hoàn tiền trong 7 ngày làm việc.</li>
              <li>Thẻ VISA/MasterCard: Hoàn tiền trong 30 ngày làm việc.</li>
              <li>Ví điện tử: Hoàn tiền trong tối đa 14 ngày.</li>
              <li>Điểm thành viên (C.Coin): Hoàn trả trong 72 giờ.</li>
              <li>Vé mời (Phiếu quà tặng): Hoàn trả trong 24 giờ.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">V. Nhận vé</h2>
            <p>
              Khách hàng có thể nhận vé tại quầy hoặc quét mã QR trên ứng dụng
              để vào rạp.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">VI. Phí đặt vé</h2>
            <p>
              Hiện tại, mức phí đặt vé trực tuyến là 0 đồng. Tuy nhiên, mức phí
              này có thể thay đổi.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">VII. Phổ biến phim</h2>
            <p>Thời gian chiếu phim cho trẻ em:</p>
            <ul className="policy-list">
              <li>Trẻ dưới 13 tuổi: Phim kết thúc trước 22 giờ.</li>
              <li>Trẻ dưới 16 tuổi: Phim kết thúc trước 23 giờ.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">VIII. Chính sách bảo mật</h2>
            <p>VTI Cinema cam kết bảo vệ thông tin cá nhân của khách hàng.</p>
            <ul className="policy-list">
              <li>Thông tin cá nhân của khách hàng được bảo mật tuyệt đối.</li>
              <li>
                Không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý.
              </li>
              <li>Áp dụng công nghệ bảo mật tiên tiến.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">IX. Cảnh báo an ninh</h2>
            <p>
              VTI Cinema áp dụng các biện pháp bảo mật chặt chẽ để chống gian
              lận. Nếu phát hiện hoạt động đáng ngờ, hệ thống có thể chặn giao
              dịch hoặc tài khoản.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">X. Liên hệ</h2>
            <p>
              Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ:
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

export default TermsOfService;
