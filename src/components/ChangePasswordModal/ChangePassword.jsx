import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"; // Import các icon từ FontAwesome
import { toast } from "react-toastify"; // Thư viện hiển thị thông báo (toast)
import { changePassword } from "../../services/dataService"; // Hàm gửi yêu cầu đổi mật khẩu
import { useSelector } from "react-redux"; // Lấy dữ liệu từ Redux store
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation"; // Các hàm validate custom
import "./ChangePassword.scss";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    oldPassword: "", // Mật khẩu cũ
    newPassword: "", // Mật khẩu mới
    confirmPassword: "", // Xác nhận mật khẩu mới
  });
  const [errors, setErrors] = useState({}); // State lưu thông tin lỗi của từng trường
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  }); // State kiểm soát việc hiển thị mật khẩu
  const [isSubmitting, setIsSubmitting] = useState(false); // State kiểm soát trạng thái submit

  // Lấy email của user từ Redux store. Lưu ý "user?.email"
  const userEmail = useSelector((state) => state.auth.user?.email);

  // Xử lý khi người dùng thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target; // Lấy name và value từ input
    setFormData({ ...formData, [name]: value }); // Cập nhật state formData
  };

  // Kiểm tra lỗi cho từng trường input
  const validateField = (field) => {
    let error = "";
    if (field === "oldPassword") {
      error = validatePassword(formData.oldPassword); // Validate mật khẩu cũ
    } else if (field === "newPassword") {
      error = validatePassword(formData.newPassword); // Validate mật khẩu mới
    } else if (field === "confirmPassword") {
      error = validateConfirmPassword(
        formData.newPassword,
        formData.confirmPassword
      ); // Validate xác nhận mật khẩu mới
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error })); // Cập nhật lỗi cho trường tương ứng
  };

  // Kiểm tra toàn bộ form trước khi submit
  const validateForm = () => {
    const validationErrors = {
      oldPassword: validatePassword(formData.oldPassword),
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: validateConfirmPassword(
        formData.newPassword,
        formData.confirmPassword
      ),
    };
    setErrors(validationErrors); // Lưu tất cả lỗi vào state errors
    return Object.keys(validationErrors).every((key) => !validationErrors[key]); // Kiểm tra xem form có lỗi nào không
  };

  // Hiển thị hoặc ẩn mật khẩu
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] })); // Đảo trạng thái hiển thị mật khẩu
  };

  // Xử lý khi người dùng submit form đổi mật khẩu
  const handlePasswordChange = async () => {
    if (!validateForm()) return; // Nếu form không hợp lệ thì dừng
    setIsSubmitting(true); // Bật trạng thái loading
    try {
      const message = await changePassword(
        userEmail,
        formData.oldPassword,
        formData.newPassword
      ); // Gửi yêu cầu đổi mật khẩu
      toast.success(message); // Hiển thị thông báo thành công
      onClose(); // Đóng modal
    } catch (error) {
      toast.error(error.message); // Hiển thị thông báo lỗi
      // Cập nhật lỗi vào state để hiển thị dưới input
      setErrors({
        oldPassword: error.message.includes("Mật khẩu cũ không chính xác")
          ? error.message
          : "",
        newPassword: error.message.includes("Mật khẩu mới quá yếu")
          ? error.message
          : "",
        confirmPassword: "",
      });
    } finally {
      setIsSubmitting(false); // Tắt trạng thái loading
    }
  };

  // Nếu modal không được mở thì trả về null
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content modal-content-changePassword"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="title-modal-changePassword">Đổi Mật Khẩu</h2>
        <form>
          <div className="input-container">
            {/* Input mật khẩu cũ */}
            <div className="input-error-wrapper">
              <label>Mật khẩu cũ</label>
              <div className="password-field">
                <input
                  type={showPassword.oldPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
                  name="oldPassword"
                  placeholder="Nhập mật khẩu cũ"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  onBlur={() => validateField("oldPassword")}
                  className={errors.oldPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  <FontAwesomeIcon
                    icon={showPassword.oldPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.oldPassword && (
                <p className="error-message">{errors.oldPassword}</p>
              )}
            </div>

            {/* Input mật khẩu mới */}
            <div className="input-error-wrapper">
              <label>Mật khẩu mới</label>
              <div className="password-field">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onBlur={() => validateField("newPassword")}
                  className={errors.newPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  <FontAwesomeIcon
                    icon={showPassword.newPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.newPassword && (
                <p className="error-message">{errors.newPassword}</p>
              )}
            </div>

            {/* Input xác nhận mật khẩu mới */}
            <div className="input-error-wrapper">
              <label>Xác nhận mật khẩu mới</label>
              <div className="password-field">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => validateField("confirmPassword")}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  <FontAwesomeIcon
                    icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Nút đổi mật khẩu */}
          <button
            type="button"
            className="submit-button submit-changePassword-button"
            disabled={isSubmitting} // Vô hiệu hóa khi đang submit
            onClick={handlePasswordChange}
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Đổi mật khẩu"
            )}
          </button>
        </form>

        {/* Nút đóng modal */}
        <button type="button" onClick={onClose} className="close-button">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
