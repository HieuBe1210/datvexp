import "./footer.scss";
import logo from "./../../../src/assets/image/logo.png";
import logo_da_thong_bao_bct from "./../../../src/assets/image/logo_da_thong_bao_bct.webp";
import {
  CopyrightOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footer__section footer__links">
          <Link to="/">
            <img src={logo} alt="Logo" className="footer__logo" />
          </Link>
          <ul>
            <li>
              <Link to="#">FAQ</Link>
            </li>
            <li>
              <Link to="#">Giới thiệu</Link>
            </li>
            <li>
              <Link
                to="/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chính Sách Quyền Riêng Tư
              </Link>
            </li>
            <li>
              <Link
                to="/delete-user-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yêu cầu riêng về tài khoản
              </Link>
            </li>
            <li>
              <Link
                to="booking-guide"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hướng dẫn đặt vé online
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__section footer__info">
          <h4 className="footer-title">Hệ thống rạp</h4>
          <div className="footer__list__cinemas">
            <ul>
              <p className="title__location">Miền Bắc</p>
              <li>
                <Link to="#">VTI Hà Nội Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Thăng Long Movie</Link>
              </li>
              <li>
                <Link to="#">VTI Royal Hanoi Theater</Link>
              </li>
              <li>
                <Link to="#">VTI West Lake Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Red River Film House</Link>
              </li>
            </ul>
            <ul>
              <p className="title__location">Miền Trung</p>
              <li>
                <Link to="#">VTI Đà Nẵng Star Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Huế Heritage Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Đồng Hới Film Center</Link>
              </li>
              <li>
                <Link to="#">VTI Nha Trang Sun Theater</Link>
              </li>
              <li>
                <Link to="#">VTI Pleiku Movies</Link>
              </li>
            </ul>
            <ul>
              <p className="title__location">Miền Nam</p>
              <li>
                <Link to="#">VTI Sài Gòn Film House</Link>
              </li>
              <li>
                <Link to="#">VTI Mekong Movie Center</Link>
              </li>
              <li>
                <Link to="#">VTI Vũng Tàu Ocean Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Cần Thơ Riverside Theater</Link>
              </li>
              <li>
                <Link to="#">VTI Biên Hòa Galaxy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__section footer__social">
          <h4 className="footer-title">Kết nối</h4>
          <ul>
            <li>
              <FacebookFilled />
              <Link
                to="https://www.facebook.com/DuyLinhJP/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Facebook</span>
              </Link>
            </li>
            <li>
              <InstagramFilled />
              <Link to="#">
                <span>Instagram</span>
              </Link>
            </li>
            <li>
              <TwitterSquareFilled />
              <Link to="#">
                <span>Twitter</span>
              </Link>
            </li>
          </ul>
          <img src={logo_da_thong_bao_bct} alt="logo_da_thong_bao_bct" />
        </div>
        <div className="footer__section footer__contact">
          <h4 className="footer-title">Liên hệ</h4>
          <ul>
            <li>CÔNG TY CỔ PHẦN VTI MEDIA</li>
            <li>LIÊN HỆ HỢP TÁC</li>
            <li>
              HOTLINE: <Link to="tel:19001999">1900 1999</Link>
            </li>
            <li>
              EMAIL:{" "}
              <Link to="mailto:vticinema@gmail.com">vticinema@gmail.com</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>
          <CopyrightOutlined />
          Copyright 2024 - 2025
        </p>
      </div>
    </>
  );
};
