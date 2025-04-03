import React from "react";
import { Box } from "@mui/material"; // Import Box từ Material-UI để tạo layout
import Sidebar from "./components/Sidebar/Sidebar"; // Thanh điều hướng bên trái (Sidebar)
import Header from "./components/Header/Header"; // Header hiển thị trên cùng
import { Outlet } from "react-router-dom"; // Outlet dùng để render nội dung route con
import "./styles/admin.scss";

const AdminApp = () => {
  return (
    // Bao bọc toàn bộ phần admin trong một lớp CSS (admin-wrapper)
    <div className="admin-wrapper">
      {/* Sử dụng Box để tạo layout dạng flex và đảm bảo chiều cao tối thiểu là toàn màn hình */}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar - Thanh điều hướng bên trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Header - Hiển thị ở phía trên */}
          <Header />

          {/* Outlet - Hiển thị nội dung route con */}
          <div style={{ marginTop: "80px", padding: "16px" }}>
            {/* marginTop 80px để tránh nội dung bị che bởi Header */}
            {/* padding 16px để tạo khoảng cách xung quanh nội dung */}
            <Outlet />
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default AdminApp;
