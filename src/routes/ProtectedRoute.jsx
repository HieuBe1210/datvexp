// Middleware để kiểm tra quyền truy cập trước khi hiển thị nội dung
import React from "react";
import { Navigate } from "react-router-dom";

// Component ProtectedRoute giúp bảo vệ các route yêu cầu quyền truy cập
const ProtectedRoute = ({
  children, // Nội dung của route được bảo vệ
  allowedRoles, // Các vai trò được phép truy cập
  redirectPath = "/error-user", // Đường dẫn mặc định khi không được phép truy cập
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Kiểm tra nếu không có user hoặc không có role trong user
  if (!user || !user.role) {
    console.log("User chưa đăng nhập hoặc role không tồn tại");
    // Điều hướng đến trang lỗi nếu không hợp lệ
    return <Navigate to="/error-user" replace />;
  }

  // Kiểm tra nếu role của user không nằm trong danh sách allowedRoles
  if (!allowedRoles.includes(user.role)) {
    // Điều hướng đến đường dẫn được chỉ định
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu tất cả các điều kiện đều hợp lệ, render nội dung con
  return children;
};

export default ProtectedRoute;
