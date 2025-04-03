import React, { useEffect, useState } from "react";
import support from "./../../../src/assets/icon/support.jpg";
import top_scroll from "./../../../src/assets/icon/top_scroll.png";
import logo from "./../../../src/assets/image/logo.png";
import chatIcon from "./../../../src/assets/icon/chatIcon.svg"; // Biểu tượng cho Chatbox
import zaloIcon from "./../../../src/assets/icon/zaloIcon.svg"; // Biểu tượng cho Zalo
import facebook from "./../../../src/assets/icon/facebook.svg"; // Biểu tượng cho Messenger
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../../utils/authActions";
import { Dropdown, Avatar } from "antd";
import LoginModal from "./../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
import { resetError, setAuth } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { searchMovies } from "../../../store/searchSlice";
import { getAuthToken, removeAuthToken } from "../../utils/authStorage";
import GuideModal from "../GuideModal/GuideModal";
import { getAuth } from "firebase/auth";
import MobileSidebar from "./MobileSidebar";
import Chatbot from "../Chatbot/Chatbot";

export const Header = () => {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user;
  const [error, setError] = useState("");
  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const openForgotPasswordModal = () => setModalType("forgotPassword");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(false);

  // State để quản lý hiển thị menu hỗ trợ
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);

  // State để quản lý hiển thị Chatbot
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // STATE HIỂN THỊ TOGGLER CHO MOBILE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setError(""); // Reset lỗi
    dispatch(resetError()); // Reset lỗi trong Redux
    setModalType(null);
  };

  const [searchResults, setSearchResults] = useState([]);

  // Hàm xử lý tìm kiếm từ SearchBar
  const handleSearch = async (query) => {
    if (!query || query.trim() === "") {
      dispatch(searchMovies([]));
      return;
    }
    dispatch(searchMovies(query.trim()));
    try {
      const results = searchMovies(query.trim());
      dispatch(setSearchResults(results));
    } catch (error) {
      console.error("Error in handleSearch:", error);
      dispatch(setSearchResults([]));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const authInstance = getAuth();
          await authInstance.currentUser?.reload();
          const updatedUser = authInstance.currentUser;
          if (!updatedUser) {
            console.warn("User is null after reload, retrying in 2 seconds...");
            setTimeout(fetchUserData, 2000);
            return;
          }
          dispatch(
            setAuth({
              user: {
                uid: updatedUser.uid,
                email: updatedUser.email || "",
                displayName: updatedUser.displayName || "Người dùng",
                photoURL: updatedUser.photoURL || "",
              },
              token: await updatedUser.getIdToken(),
            })
          );
        } catch (error) {
          console.error("Lỗi khi cập nhật thông tin user:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollToTopBtn = document.getElementById("scrollToTopBtn");
      if (scrollToTopBtn) {
        if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
      scrollToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onLogout = () => {
    removeAuthToken();
    handleLogout(dispatch);
    navigate("/");
  };

  const handleMemberClick = (token, setModalType) => {
    if (token) {
      navigate("/Members");
    } else {
      openLoginModal();
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: <Link to="/members">Trang cá nhân</Link>,
    },
    {
      key: "settings",
      label: <Link to="/settings">Cài đặt</Link>,
    },
    {
      key: "logout",
      label: <span onClick={onLogout}>Đăng xuất</span>,
    },
  ];

  // Hàm xử lý khi nhấn vào các lựa chọn hỗ trợ
  const handleSupportOptionClick = (option) => {
    if (option === "chatbox") {
      // Toggle hiển thị Chatbot
      setIsChatbotOpen(!isChatbotOpen);
    } else if (option === "zalo") {
      window.open("https://zalo.me/0363433842", "_blank"); // Thay bằng link Zalo của bạn
    } else if (option === "messenger") {
      window.open("https://m.me/DuyLinhJP", "_blank"); // Thay bằng link Messenger của bạn
    }
    setIsSupportMenuOpen(false); // Đóng menu sau khi chọn
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-content">
          <div className="header" id="header">
            <div>
              <button className="navbar-toggler">
                <MobileSidebar />
              </button>
            </div>
            <div className="header-left">
              <Link to="/">
                <img className="header-logo" src={logo} alt="logo" />
              </Link>
            </div>
            <div className="header-center collapse navbar-collapse" id="navbarNav">
              <ul className="header__nav navbar-nav mx-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "nav-link")}
                    onClick={closeMenu}>
                    TRANG CHỦ
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/movies"
                    className={({ isActive }) => (isActive ? "active" : "nav-link")}
                    onClick={closeMenu}>
                    PHIM
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/promotions"
                    className={({ isActive }) => (isActive ? "active" : "nav-link")}
                    onClick={closeMenu}>
                    TIN TỨC
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/members"
                    className={({ isActive }) => (isActive ? "active" : "nav-link")}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMemberClick(token, setModalType);
                      closeMenu();
                    }}>
                    THÀNH VIÊN
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? "active" : "nav-link")}
                    onClick={closeMenu}>
                    LIÊN HỆ
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="nav-item search-wrapper">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm phim, thể loại, diễn viên... "
              />
            </div>
            <div className="header-right">
              <div className="login-actions">
                {isLoggedIn && user ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight">
                    <div className="user-info" onClick={(e) => e.preventDefault()}>
                      <span className="user-name">{user.fullname || user.displayName}</span>
                      <Avatar src={user.avatar_url || user.photoURL} alt="User Avatar" />
                    </div>
                  </Dropdown>
                ) : (
                  <Link to="#!" className="btn action-btn btn-primary" onClick={openLoginModal}>
                    Đăng nhập
                  </Link>
                )}

                {modalType === "login" && (
                  <LoginModal
                    closeModal={closeModal}
                    openRegisterModal={openRegisterModal}
                    openForgotPasswordModal={openForgotPasswordModal}
                  />
                )}
                {modalType === "register" && (
                  <RegisterModal closeModal={closeModal} openLoginModal={openLoginModal} />
                )}
                {modalType === "forgotPassword" && (
                  <ForgotPasswordModal closeModal={closeModal} openLoginModal={openLoginModal} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị Chatbot với class active dựa trên state isChatbotOpen */}
      <div className={`chatbot-wrapper ${isChatbotOpen ? "active" : ""}`}>
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      </div>
      <div className="support__icon">
        <div className="support-wrapper">
          <img
            src={support}
            alt="Support icon"
            onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
          />
          {isSupportMenuOpen && (
            <div className="support-options">
              <div
                className="support-option chatbox"
                onClick={() => handleSupportOptionClick("chatbox")}>
                <img src={chatIcon} alt="Chatbox" />
              </div>
              <div className="support-option zalo" onClick={() => handleSupportOptionClick("zalo")}>
                <img src={zaloIcon} alt="Zalo" />
              </div>
              <div
                className="support-option messenger"
                onClick={() => handleSupportOptionClick("messenger")}>
                <img src={facebook} alt="Messenger" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="top__scroll">
        <img id="scrollToTopBtn" src={top_scroll} alt="Top Scroll" />
      </div>
      <GuideModal />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};
