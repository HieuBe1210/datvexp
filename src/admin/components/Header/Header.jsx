import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// Các thành phần UI từ Material-UI
import Breadcrumbs from "../Breadcrumbs"; // Component Breadcrumbs hiển thị đường dẫn
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminRoutes } from "../../../routes/AdminRoutes"; // Import routes dành cho admin
import { handleLogout } from "../../../utils/authActions"; // Hàm xử lý đăng xuất
import "./Header.modul.scss";

const Header = ({ sidebarWidth = 240 }) => {
  const dispatch = useDispatch(); // Lấy hàm dispatch từ Redux
  const navigate = useNavigate(); // Lấy hàm navigate để điều hướng

  // Hàm xử lý đăng xuất
  const onLogout = () => {
    handleLogout(dispatch); // Gọi hàm logout, truyền dispatch để cập nhật state Redux
    navigate("/"); // Điều hướng người dùng về trang chủ
  };

  // Lấy tất cả route con trong AdminRoutes
  // Dùng `flatMap` để trải phẳng các route con vào một danh sách
  const adminRoutes = AdminRoutes.flatMap((route) =>
    route.children ? route.children : [route]
  );

  return (
    // AppBar - Thanh điều hướng chính của ứng dụng admin
    <div className="header">
      <AppBar
        position="fixed"
        sx={{
          zIndex: 100,
          left: `${sidebarWidth}px`, // Đẩy AppBar sang phải theo chiều rộng Sidebar
          width: `calc(100% - ${sidebarWidth}px)`, // Tính toán lại chiều rộng AppBar
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Tiêu đề của thanh điều hướng */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chào mừng bạn đến với trang Quản trị viên
          </Typography>
          {/* Nút Đăng xuất */}
          <Button
            color="inherit"
            onClick={onLogout}
            sx={{ fontSize: "1.2rem" }}
            className="button-action"
          >
            Đăng xuất
          </Button>
        </Toolbar>
        {/* Breadcrumbs - Hiển thị đường dẫn hiện tại */}
        <Box sx={{ paddingX: 2, paddingY: 0.5, backgroundColor: "#f5f5f5" }}>
          {/* Truyền danh sách route con vào component Breadcrumbs */}
          <Breadcrumbs routes={AdminRoutes[0].children} />
        </Box>
      </AppBar>
    </div>
  );
};

export default Header;
