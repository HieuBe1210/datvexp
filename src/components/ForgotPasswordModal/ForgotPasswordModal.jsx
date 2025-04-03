import React, { useState } from "react";
import "./ForgotPasswordModal.modul.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { validateEmailOrPhone } from "../../utils/validation";
import { forgotPassword } from "../../services/firebaseService";
import { toast } from "react-toastify"; // Toast thông báo thay cho Alert
import { fetchAccountByEmail } from "../../services/dataService";
import LoadingIcon from "../LoadingIcon";
import { Link } from "react-router-dom";

// Component ForgotPasswordModal để xử lý yêu cầu quên mật khẩu
const ForgotPasswordModal = ({ closeModal, openLoginModal }) => {
  const [emailOrPhone, setEmailOrPhone] = useState(""); // State lưu trữ thông tin email hoặc số điện thoại
  const [errors, setErrors] = useState({ emailOrPhone: "" }); // State lưu trữ lỗi của input
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Xác thực khi người dùng rời khỏi trường nhập
  const handleEmailOrPhoneBlur = () => {
    const error = validateEmailOrPhone(emailOrPhone);
    setErrors((prevErrors) => ({ ...prevErrors, emailOrPhone: error }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);

    if (!emailOrPhoneError) {
      setIsLoading(true);
      try {
        // Kiểm tra xem email có tồn tại không
        const account = await fetchAccountByEmail(emailOrPhone);
        // Gửi yêu cầu reset mật khẩu qua Firebase
        await forgotPassword.resetPassword(emailOrPhone);
        // Thông báo thành công bằng Toast
        toast.success("Yêu cầu quên mật khẩu đã được gửi. Vui lòng kiểm tra email.");
        // setMessage(
        //   "Yêu cầu quên mật khẩu đã được gửi. Vui lòng kiểm tra email."
        // );
        setEmailOrPhone(""); // Reset input
        setErrors({ emailOrPhone: "" }); // Xóa lỗi
        closeWithAnimation();
      } catch (error) {
        console.error("Lỗi kiểm tra email:", error);
        // Hiển thị thông báo lỗi cụ thể từ API
        const errorMessage = error.message || "Không thể kiểm tra email.";
        setErrors({ emailOrPhone: errorMessage });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // Reset trạng thái loading khi người dùng không nhập email
      setErrors({ emailOrPhone: emailOrPhoneError });
    }
  };

  // Hàm đóng modal với hiệu ứng mượt mà
  const closeWithAnimation = () => {
    setIsClosing(true); // Bắt đầu hiệu ứng đóng
    setTimeout(() => {
      closeModal(); // Đóng modal sau khi hoàn tất animation
    }, 300); // Thời gian 300ms cho hiệu ứng đóng, khớp với CSS
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? "fade-out" : ""}`}
      onClick={(e) => {}}
      aria-modal="true"
      role="dialog">
      <div
        className={`modal-content modal-content-forgot ${isClosing ? "scale-out" : ""}`}
        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click bên trong nội dung
      >
        <button className="back-login-button" onClick={openLoginModal}>
          <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
        </button>
        <h2 className="modal-title">Quên mật khẩu</h2>
        {/* Form quên mật khẩu */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container ">
            <div className="input-error-wrapper">
              <input
                id="emailOrPhone"
                type="text"
                placeholder="Nhập email hoặc số điện thoại"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                onBlur={handleEmailOrPhoneBlur} // Kiểm tra lỗi khi rời khỏi input
                className={errors.emailOrPhone ? "input-error" : "input-field"} // Thêm class lỗi nếu có
                required
              />
              {errors.emailOrPhone && (
                <p className="error-message error-forgot-message">{errors.emailOrPhone}</p> // Hiển thị thông báo lỗi
              )}
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <LoadingIcon size={10} /> : "Gửi yêu cầu"}
          </button>
          <p className="helper-text">
            Hãy kiểm tra email của bạn để thay đổi mật khẩu mới <br />
            <span className="small-text">(Lưu ý: kiểm tra thêm mục spam)</span>
          </p>
          <Link className="link-button" to="mailto:vticinema@gmail.com">
            Liên hệ nếu không nhận được email
          </Link>
        </form>
        {/* Nút đóng modal */}
        <button onClick={closeWithAnimation} className="close-button" aria-label="Đóng">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
