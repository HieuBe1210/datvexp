import React, { useState } from "react";
import "./RegisterModal.modul.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faSpinner,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from "../../utils/validation";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../store/authSlice";
import { toast } from "react-toastify";

const RegisterModal = ({ closeModal, openLoginModal }) => {
  // Quản lý trạng thái hiển thị mật khẩu và hiệu ứng đóng modal
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error); // Lấy lỗi từ Redux store

  // Dữ liệu của form đăng ký
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false, // Trạng thái checkbox chấp nhận điều khoản
  });

  const [errors, setErrors] = useState({}); // Lưu các lỗi của từng trường

  // Chuyển đổi trạng thái hiển thị mật khẩu
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Xử lý cập nhật dữ liệu form khi người dùng nhập
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý kiểm tra lỗi khi rời khỏi trường nhập liệu
  const handleBlur = (field) => {
    let error = "";
    switch (field) {
      case "name":
        error = validateName(formData.name); // Kiểm tra lỗi của tên
        break;
      case "email":
        error = validateEmail(formData.email); // Kiểm tra lỗi của email
        break;
      case "phone":
        error = validatePhone(formData.phone); // Kiểm tra lỗi của số điện thoại
        break;
      case "password":
        error = validatePassword(formData.password); // Kiểm tra lỗi của mật khẩu
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, formData.confirmPassword); // Kiểm tra lỗi của mật khẩu xác nhận
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái chờ khi submit

  // Kiểm tra toàn bộ form trước khi submit
  const handleValidation = () => {
    const validationErrors = {};
    validationErrors.name = validateName(formData.name);
    validationErrors.email = validateEmail(formData.email);
    validationErrors.phone = validatePhone(formData.phone);
    validationErrors.password = validatePassword(formData.password);
    validationErrors.confirmPassword = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    validationErrors.acceptTerms = !formData.acceptTerms ? "Vui lòng chấp nhận điều khoản" : "";

    setErrors(validationErrors);

    // Trả về true nếu có lỗi
    return Object.values(validationErrors).some((error) => error);
  };

  // Xử lý khi người dùng nhấn nút "Đăng ký"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Kiểm tra lỗi trong form
    if (handleValidation()) return;

    setIsSubmitting(true); // Hiển thị trạng thái chờ

    try {
      // Dispatch action đăng ký người dùng qua Redux
      const response = await dispatch(
        registerUser({
          fullname: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birthDate,
          gender: formData.gender,
          password: formData.password,
          formData,
        })
      ).unwrap(); // unwrap giúp lấy giá trị thực từ asyncThunk
      toast.success("Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.");
      closeModal();
    } catch (error) {
      // Xử lý lỗi từ Firebase
      if (error && error === "auth/email-already-in-use") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email đã được sử dụng. (Hoặc đã đăng nhập bằng Google)",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          global: "Đã xảy ra lỗi. Vui lòng thử lại.",
        }));
      }
      // toast.error("Đăng ký thất bại!");
    } finally {
      setIsSubmitting(false); // Kết thúc trạng thái chờ
    }
  };

  // Xử lý hiệu ứng đóng modal
  const handleClose = () => {
    setIsClosing(true); // Bật hiệu ứng fade-out
    setTimeout(() => {
      closeModal(); // Đóng modal sau 300ms
    }, 300);
  };

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      <div className="modal-content modal-register-content" onClick={(e) => e.stopPropagation()}>
        <button className="back-login-button" onClick={openLoginModal}>
          <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
        </button>
        <h2 className="modal-title">Đăng Ký Tài Khoản</h2>
        <form noValidate>
          <div className="input-container">
            {/* NAME */}
            <div className="input-error-wrapper">
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* EMAIL  */}
            <div className="input-error-wrapper">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="abc@gmail.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* TEL  */}
            <div className="input-error-wrapper">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                placeholder="090xxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            {/* PASSWORD  */}
            <div className="input-error-wrapper">
              <label>Mật khẩu</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={errors.password ? "input-error" : ""}
                />
                <button type="button" className="show-password" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD  */}
            <div className="input-error-wrapper">
              <label>Nhập lại mật khẩu</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={toggleConfirmPasswordVisibility}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            {/* ACCEPT TERMS */}
            <div className="input-error-wrapper">
              <label>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                Đồng ý với Điều khoản dịch vụ
              </label>
              {errors.acceptTerms && <p className="error-message">{errors.acceptTerms}</p>}
              {errors.global && <p className="error-message">{errors.global}</p>}
            </div>

            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting} // Hiển thị trạng thái chờ
            >
              {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "Đăng ký"}
            </button>
          </div>
        </form>

        <button onClick={handleClose} className="close-button">
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <p className="login-text">
          Bạn đã có tài khoản?{" "}
          <Link className="login-link" onClick={openLoginModal}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
