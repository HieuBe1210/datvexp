import React, { useState, useEffect } from "react";
import "./LoginModal.modul.scss";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, get, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { googleLogin, loginUser, facebookLogin } from "../../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import google from "../../assets/icon/google.svg";
import facebook from "../../assets/icon/facebook.svg";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { validateEmailOrPhone, validatePassword, validateLoginForm } from "../../utils/validation";
import { toast } from "react-toastify";
import { saveUserToDatabase } from "../../utils/authActions.js";
import { setAuthToken } from "../../utils/authStorage.js";
import { resendVerificationEmail } from "../../services/authService.js";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import LoadingIcon from "../LoadingIcon.jsx";
import { fetchAccountByEmail } from "../../services/dataService.js";

const LoginModal = ({ closeModal, openRegisterModal, openForgotPasswordModal }) => {
  // state quản lý đóng mở Modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Trạng thái Loading
  const [showPassword, setShowPassword] = useState(false); // Điều khiển hiển thị mật khẩu
  const [emailOrPhone, setEmailOrPhone] = useState(""); // State lưu email hoặc số điện thoại
  const [password, setPassword] = useState(""); // State lưu mật khẩu
  const [rememberMe, setRememberMe] = useState(false); // Trạng thái nhớ mật khẩu
  const [errors, setErrors] = useState({ emailOrPhone: "", password: "" }); // State lưu các lỗi

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error); // Lấy mã lỗi từ Redux store

  // Hàm toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hiệu ứng khi đóng Modal
  const handleOverlayClick = (e) => {
    e.stopPropagation();

    const overlay = document.querySelector(".modal-overlay");
    const content = document.querySelector(".modal-content");

    if (overlay && content) {
      overlay.classList.add("fade-out");
      content.classList.add("scale-out");

      setTimeout(() => {
        closeModal(); // Đóng Modal sau khi hoàn tất animation
      }, 300); // Thời gian animation (300ms) khớp với CSS
    }
  };

  // Xác thực trường email hoặc số điện thoại khi rời khỏi input
  const handleEmailOrPhoneBlur = () => {
    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
    setErrors((prevErrors) => ({
      ...prevErrors,
      emailOrPhone: emailOrPhoneError,
    }));
  };

  // Xác thực trường mật khẩu khi rời khỏi input
  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
  };

  // Hàm xử lý khi submit form đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ emailOrPhone: "", password: "" }); // Reset lỗi trước khi submit
    setIsLoading(true);
    // Validate form
    const validationErrors = validateLoginForm({ emailOrPhone, password });
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (!hasErrors) {
      dispatch(loginUser({ email: emailOrPhone, password }))
        .unwrap()
        .then(async (response) => {
          const { accessToken, password, ...user } = response;
          setAuthToken(accessToken); // Lưu Token chính cho phiên làm việc
          try {
            // Lấy thông tin tài khoản chứa Role để hệ thống kiểm tra
            const userData = await fetchAccountByEmail(emailOrPhone);
            user.role = userData.role || "user";
            localStorage.setItem("user", JSON.stringify(user));
          } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
          }
          if (rememberMe) {
            const db = getDatabase();
            const rememberToken = uuidv4(); // Tạo Remember Token duy nhất
            set(ref(db, `rememberTokens/${user.uid}`), {
              rememberToken,
              email: emailOrPhone,
            });
            localStorage.setItem("rememberToken", rememberToken);
          }
          toast.success("Đăng nhập thành công!");
          closeModal(); // Đóng modal nếu đăng nhập thành công
          window.location.reload(); // Reload trang để cập nhật dữ liệu

          // CHUYỂN HƯỚNG NẾU LÀ ADMIN
          navigate(user.role === "admin" ? "/admin/dashboard" : "/");
        })
        .catch((error) => {
          console.error("Lỗi đăng nhập:", error);
          // Kiểm tra nếu `error.message` tồn tại trước khi gọi `.includes()`
          const errorMessage = error?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
          setIsLoading(false);
          // Cập nhật Redux store với lỗi
          setErrors((prevErrors) => ({
            ...prevErrors,
            emailOrPhone: errorMessage.includes("Tài khoản không tồn tại") ? error.message : "",
            password: errorMessage.includes("Mật khẩu không đúng") ? error.message : "",
          }));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberToken = localStorage.getItem("rememberToken");

    if (rememberToken) {
      const db = getDatabase();

      // Kiểm tra "Remember Token" trong Firebase
      get(ref(db, `rememberTokens`)).then((snapshot) => {
        if (snapshot.exists()) {
          const tokens = snapshot.val();
          const matchedToken = Object.values(tokens).find(
            (token) => token.rememberToken === rememberToken
          );

          if (matchedToken) {
            if (matchedToken) {
              setEmailOrPhone(matchedToken.email); // Điền email vào input
              setPassword(matchedToken.password); // Điền mật khẩu vào input
            } else {
              localStorage.removeItem("rememberToken"); // Xóa token hết hạn
              toast.error("Thông tin đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            }
          } else {
            localStorage.removeItem("rememberToken"); // Xóa nếu không hợp lệ
          }
        }
      });
    }
  }, []);
  useEffect(() => {
    if (user) {
      navigate("#!");
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    dispatch(googleLogin())
      .unwrap()
      .then((response) => {
        const { accessToken, ...user } = response;
        setAuthToken(accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        // Sau khi đăng nhập, đồng bộ dữ liệu người dùng
        saveUserToDatabase(user);
        closeModal();
        toast.success("Đăng nhập thành công!");
      })
      .catch((error) => {
        toast.error("Đăng nhập thất bại!");
        // console.error("Đăng nhập Google thất bại:", error.message);
      });
  };

  const handleFacebookLogin = () => {
    dispatch(facebookLogin())
      .unwrap()
      .then((response) => {
        const { accessToken, ...user } = response;
        setAuthToken(accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        closeModal();
        // navigate("/");
        toast.success("Đăng nhập thành công!");
      })
      .catch((error) => {
        toast.error("Đăng nhập thất bại!");
        // console.error("Đăng nhập Facebook thất bại:", error.message);
      });
  };

  // HÀM XỬ LÝ GỬI LẠI EMAIL XÁC NHẬN
  const handleResendVerification = async () => {
    try {
      const response = await resendVerificationEmail(emailOrPhone, password);
      toast.success(response);
      closeModal();
    } catch (err) {
      toast.error(err.message || "Gửi lại email xác nhận thất bại.");
    }
  };
  return (
    <>
      {isForgotPasswordOpen ? (
        <ForgotPasswordModal />
      ) : isRegisterOpen ? (
        <RegisterModal />
      ) : (
        <div className="modal-overlay">
          <div className="modal-content modal-login-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Đăng nhập</h2>
            {/* Form đăng nhập với noValidate để tắt validate mặc định của trình duyệt */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="input-container">
                <div className="input-error-wrapper">
                  <label>Email hoặc số điện thoại</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    onBlur={handleEmailOrPhoneBlur} // Kiểm tra khi người dùng rời khỏi trường
                    className={errors.emailOrPhone ? "input-error" : ""}
                  />
                  {errors.emailOrPhone && (
                    <p className="error-message">{errors.emailOrPhone}</p> // Hiển thị lỗi nếu có
                  )}
                </div>
                <div className="input-error-wrapper">
                  <label className="label-register-modal">Mật khẩu</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={handlePasswordBlur} // Kiểm tra khi người dùng rời khỏi trường
                      className={errors.password ? "input-error" : ""}
                    />
                    <button
                      type="button"
                      className="show-password"
                      onClick={togglePasswordVisibility} // Toggle hiển thị mật khẩu
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error-message">{errors.password}</p> // Hiển thị lỗi nếu có
                  )}
                </div>
                {/* CheckBox Nhớ mật khẩu */}
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="title" htmlFor="rememberMe">
                    Nhớ mật khẩu
                  </label>
                </div>
                <div className="error-message-wrapper">
                  {/* Hiển thị lỗi đăng nhập nếu có */}
                  {error && <p className="error-message error-message-all">{error}</p>}
                  {/* Nếu lỗi do email chưa được xác nhận, hiển thị nút gửi lại email xác nhận */}
                  {error && error.includes("chưa được xác nhận") && (
                    <div className="resend-verification">
                      <button type="button" onClick={handleResendVerification}>
                        Gửi lại xác nhận
                      </button>
                    </div>
                  )}
                </div>
                {/* Nút đăng nhập */}
                <button
                  type="submit"
                  className="submit-button submit-login-button"
                  disabled={isLoading}>
                  {isLoading ? <LoadingIcon size={10} /> : "Đăng nhập"}
                </button>
              </div>
            </form>
            <div className="social-login">
              <p>Hoặc đăng nhập bằng</p>
              <div className="social-icons">
                <a href="#" className="social-button google" onClick={handleGoogleLogin}>
                  <img src={google} alt="Google" />
                </a>
                <a href="#" className="social-button facebook" onClick={handleFacebookLogin}>
                  <img src={facebook} alt="Facebook" />
                </a>
              </div>
            </div>
            {/* Link mở modal quên mật khẩu */}
            <a href="#" className="forgot-password" onClick={openForgotPasswordModal}>
              Quên mật khẩu?
            </a>
            {/* Link mở modal đăng ký */}
            <p className="register-text">
              Bạn chưa có tài khoản?{" "}
              <span className="register-link" onClick={openRegisterModal}>
                Đăng ký
              </span>
            </p>
            {/* Nút đóng modal */}
            <button onClick={handleOverlayClick} className="close-button">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
