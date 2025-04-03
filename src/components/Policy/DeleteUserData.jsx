import React from "react";
import "./PolicyPage.scss"; // Dùng chung SCSS với các chính sách khác

const DeleteUserData = () => {
  return (
    <div className="content">
      <div className="policy-container">
        <div className="policy-content">
          <h1 className="policy-title">Xóa Dữ Liệu Người Dùng</h1>
          <p className="policy-updated">
            <strong>Cập nhật lần cuối: 14/02/2025</strong>
          </p>
          <section className="policy-section">
            <p>
              VTI Cinema cam kết bảo vệ quyền riêng tư của khách hàng. Nếu bạn
              muốn xóa dữ liệu cá nhân của mình khỏi hệ thống của chúng tôi, vui
              lòng làm theo hướng dẫn dưới đây.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Cách Xóa Dữ Liệu</h2>
            <p>
              Để yêu cầu xóa dữ liệu, vui lòng thực hiện một trong các cách sau:
            </p>
            <ul className="policy-list">
              <li>
                📧 Gửi email đến <strong>vticinema@gmail.com</strong> với tiêu
                đề **"Yêu cầu xóa dữ liệu"**.
              </li>
              <li>
                📝 Điền vào{" "}
                <a
                  href="https://vticinema.web.app/delete-data-form"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>biểu mẫu yêu cầu xóa dữ liệu</strong>
                </a>
                .
              </li>
              <li>
                ☎️ Liên hệ số điện thoại: <strong>(028) 3775 2524</strong>.
              </li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Thông Tin Cần Cung Cấp</h2>
            <p>
              Khi gửi yêu cầu, vui lòng cung cấp các thông tin sau để xác minh
              danh tính:
            </p>
            <ul className="policy-list">
              <li>📌 Họ và tên.</li>
              <li>📌 Địa chỉ email hoặc số điện thoại đã đăng ký.</li>
              <li>📌 ID tài khoản (nếu có).</li>
            </ul>
            <p>
              Chúng tôi sẽ xác nhận yêu cầu của bạn trong vòng{" "}
              <strong>7 ngày làm việc</strong>.
            </p>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Lưu Ý Quan Trọng</h2>
            <ul className="policy-list">
              <li>
                ⛔ Dữ liệu đã xóa <strong>không thể khôi phục</strong>.
              </li>
              <li>
                🔒 Một số thông tin có thể được giữ lại để tuân thủ yêu cầu pháp
                lý.
              </li>
              <li>✅ Bạn sẽ nhận được thông báo qua email sau khi hoàn tất.</li>
            </ul>
          </section>
          <section className="policy-section">
            <h2 className="policy-heading">Liên Hệ</h2>
            <p>
              Nếu bạn cần thêm thông tin, vui lòng liên hệ:
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

export default DeleteUserData;
