// Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const Layout = () => {
  const navigate = useNavigate();
  /* NGĂN CHẶN HÀNH ĐỘNG KHI ADMIN NHẤN TRỞ LẠI HOẶC CỐ GẮNG TRUY CÂP TRANG CHỦ
 VẪN SẼ KHÔNG HIỂN THỊ GIAO DIỆN NGƯỜI DÙNG MÀ VẪN Ở GIAO DIỆN ADMIN */
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Nếu user là Admin hoặc Manager, điều hướng họ đến Dashboard Admin
    if (user && (user.role === "admin" || user.role === "manager")) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <main></main>
      <Footer />
    </div>
  );
};
