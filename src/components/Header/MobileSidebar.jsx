import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeAuthToken } from "../../utils/authStorage";
import { handleLogout } from "../../utils/authActions";
import LoginModal from "../LoginModal/LoginModal";
import "./MobileSidebar.scss";
import RegisterModal from "../RegisterModal/RegisterModal";
import { Footer } from "../Footer/Footer";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  // State Mở các Modal
  const closeModal = () => setModalType(null);
  const openRegisterModal = () => setModalType("register");
  const openForgotPasswordModal = () => setModalType("forgotPassword");

  // Đóng menu sau khi chọn mục
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };
  // Xử lý đăng xuất
  const onLogout = () => {
    removeAuthToken();
    handleLogout(dispatch);
    navigate("/");
    setIsOpen(false); // Đóng menu sau khi đăng xuất
  };

  return (
    <>
      {/* Nút mở menu */}
      <button className="menu-btn" onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {/* Sidebar Menu */}
      <div className={`sidebar-header ${isOpen ? "open" : ""}`}>
        {/* MENU  */}
        <div className="sidebar-menu">
          <ul className="header__nav navbar-nav mx-auto">
            <li className="sidebar-item">
              <NavLink to="/" onClick={() => handleNavigation("/")}>
                TRANG CHỦ
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/movies" onClick={() => handleNavigation("/movies")}>
                PHIM
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/promotions"
                onClick={() => handleNavigation("/promotions")}
              >
                TIN TỨC
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/members"
                onClick={() => handleNavigation("/members")}
              >
                THÀNH VIÊN
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/contact"
                onClick={() => handleNavigation("/contact")}
              >
                LIÊN HỆ
              </NavLink>
            </li>
          </ul>
        </div>

        {/* LOGIN */}
        <div className="sidebar-login">
          <div className="sidebar-auth">
            {isLoggedIn && user ? (
              <div className="user-info">
                <span className="user-img">
                  <img
                    src={user.photoURL || user.avatar_url}
                    alt="User photo"
                  />
                </span>
                <span className="user-name">
                  {user.fullname || user.displayName}
                </span>
                <button className="btn btn-logout" onClick={onLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    setModalType("login");
                    setIsOpen(false);
                  }}
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <Footer />
        </div>
      </div>

      {/* Overlay để đóng menu khi click ra ngoài */}
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modals */}
      {modalType === "login" && (
        <LoginModal
          closeModal={closeModal}
          openRegisterModal={openRegisterModal}
          openForgotPasswordModal={openForgotPasswordModal}
        />
      )}
      {modalType === "register" && (
        <RegisterModal
          closeModal={closeModal}
          openLoginModal={() => setModalType("login")}
        />
      )}
      {modalType === "forgotPassword" && (
        <ForgotPasswordModal
          closeModal={closeModal}
          openLoginModal={() => setModalType("login")}
        />
      )}
    </>
  );
};

export default MobileSidebar;
