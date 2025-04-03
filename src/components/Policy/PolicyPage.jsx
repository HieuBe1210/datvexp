import React from "react";
import "./PolicyPage.scss"; // Đổi tên SCSS chung

const PolicyPage = () => {
  return (
    <div className="content">
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">CHÍNH SÁCH VÀ QUYỀN RIÊNG TƯ</h1>
          <p className="policy-updated">
            <strong>Cập nhật lần cuối: 14/02/2025</strong>
          </p>
          <section className="policy-section">
            <p>
              Chào mừng bạn đến với <strong>VTI Cinema</strong>. Chúng tôi cam
              kết bảo vệ quyền riêng tư của bạn và xử lý thông tin cá nhân một
              cách an toàn và minh bạch.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">1. Thông Tin Chúng Tôi Thu Thập</h2>
            <ul className="policy-list">
              <li>
                <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện
                thoại, địa chỉ, v.v.
              </li>
              <li>
                <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình
                duyệt, dữ liệu cookie, lịch sử truy cập.
              </li>
              <li>
                <strong>Thông tin giao dịch:</strong> Nếu bạn thanh toán, chúng
                tôi có thể thu thập thông tin giao dịch của bạn.
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">
              2. Cách Chúng Tôi Sử Dụng Thông Tin
            </h2>
            <ul className="policy-list">
              <li>Cung cấp, vận hành và duy trì trang web.</li>
              <li>Cải thiện trải nghiệm người dùng.</li>
              <li>Gửi thông báo, hỗ trợ khách hàng.</li>
              <li>Xử lý thanh toán và đảm bảo bảo mật.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">3. Chia Sẻ Thông Tin</h2>
            <p>
              Chúng tôi không bán hoặc trao đổi thông tin cá nhân của bạn, trừ
              các trường hợp:
            </p>
            <ul className="policy-list">
              <li>Khi có sự đồng ý của bạn.</li>
              <li>
                Khi cần thiết để thực hiện giao dịch hoặc cung cấp dịch vụ.
              </li>
              <li>Khi có yêu cầu từ cơ quan pháp luật.</li>
              <li>
                Đối tác cung cấp dịch vụ hỗ trợ (như thanh toán, email, phân
                tích dữ liệu).
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">4. Bảo Mật Thông Tin</h2>
            <p>
              Chúng tôi sử dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin
              cá nhân của bạn.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">5. Quyền Lợi Của Bạn</h2>
            <ul className="policy-list">
              <li>Yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân.</li>
              <li>Từ chối nhận thông tin tiếp thị.</li>
              <li>Hạn chế hoặc phản đối việc xử lý dữ liệu của bạn.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">6. Cookie & Theo Dõi</h2>
            <p>
              Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng. Bạn
              có thể tắt cookie trong cài đặt trình duyệt.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">
              7. Liên Kết Đến Website Bên Thứ Ba
            </h2>
            <p>
              Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách của
              các trang web bên thứ ba.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">8. Thay Đổi Chính Sách</h2>
            <p>
              Chính sách này có thể thay đổi theo thời gian. Các thay đổi sẽ
              được thông báo trên trang web.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">9. Liên Hệ</h2>
            <p>
              Nếu bạn có câu hỏi, vui lòng liên hệ với chúng tôi qua:
              <br />
              <strong>CÔNG TY CỔ PHẦN VTI MEDIA</strong>
              <br />
              Email: vticinema@gmail.com
              <br />
              Số điện thoại: 1900 1999
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

export default PolicyPage;
