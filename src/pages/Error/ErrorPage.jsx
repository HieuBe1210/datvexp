import React from "react";
import ErrorPage from "./../../../src/assets/image/ErrorPage.gif";
import { ErrorHandler } from "./ErrorHandler";
import "./errorPage.scss";
import { Link } from "react-router-dom";

// ErrorPage CHO USER
export const UserErrorPage = () => {
  return (
    <>
      <div>
        <ErrorHandler
          title="404 - Không tìm thấy trang"
          message="Trang bạn tìm kiếm không tồn tại."
          image={ErrorPage}
        />
        <Link to={"/"} className="toHome-btn">
          Quay lại trang chủ
        </Link>
      </div>
    </>
  );
};

// ErrorPage CHO ADMIN
export const AdminErrorPage = () => {
  return (
    <>
      <div>
        <ErrorHandler
          title="404 - Đây là trang dành cho Admin"
          message="Vui lòng kiểm tra lại đường truyền hoặc liên hệ quản trị viên."
          image={ErrorPage}
        />
        <Link to={"/"} className="toHome-btn">
          Quay lại trang chủ
        </Link>
      </div>
    </>
  );
};
