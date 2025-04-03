import React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

// Component Breadcrumbs nhận routes dưới dạng props để tạo đường dẫn breadcrumb động
const Breadcrumbs = ({ routes }) => {
  const location = useLocation(); // Lấy thông tin vị trí hiện tại từ React Router

  // Hàm đệ quy tìm route hiện tại và các route cha của nó
  const findRoute = (currentPath, routes) => {
    // Tìm route có path trùng khớp với currentPath
    const route = routes.find((r) => `/admin/${r.path}` === currentPath);
    if (!route) return null; // Nếu không tìm thấy route, trả về null

    // Nếu route có route cha (parent), gọi lại hàm đệ quy để tìm cha
    if (route.parent) {
      const parentRoute = findRoute(route.parent, routes);
      return parentRoute ? [...parentRoute, route] : [route];
    }

    // Nếu không có cha, trả về mảng chứa route hiện tại
    return [route];
  };

  // Gọi hàm findRoute để lấy danh sách breadcrumbs dựa trên vị trí hiện tại
  const breadcrumbs = findRoute(location.pathname, routes);

  // Trả về giao diện Breadcrumbs
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ fontSize: "1.4rem" }}>
      {breadcrumbs &&
        breadcrumbs.map(
          (breadcrumb, index) =>
            breadcrumb ? (
              // Nếu là breadcrumb cuối cùng (route hiện tại), hiển thị dưới dạng Typography
              index === breadcrumbs.length - 1 ? (
                <Typography
                  key={index}
                  color="text.primary"
                  sx={{ fontSize: "1.4rem" }}
                >
                  {breadcrumb.label}
                </Typography>
              ) : (
                // Nếu không phải cuối cùng, hiển thị dưới dạng Link
                <Link
                  key={index}
                  component={RouterLink}
                  to={breadcrumb.path}
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  {breadcrumb.label}
                </Link>
              )
            ) : null // Nếu không có breadcrumb, bỏ qua
        )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
