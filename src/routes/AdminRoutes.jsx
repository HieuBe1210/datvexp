// ROUTES DÀNH CHO ADMIN
// Đây là định nghĩa các route dành riêng cho phần quản trị (admin)

import React from "react";
import ProtectedRoute from "./ProtectedRoute"; // Component dùng để bảo vệ các route
import AdminApp from "../admin/AdminApp"; // Component layout chính cho phần admin
import AdminDashboard from "../admin/pages/AdminDashboard"; // Trang tổng quan cho admin
import TheaterManagement from "../admin/pages/CinemaManagenment/TheaterManagement"; // Trang quản lý rạp
import { AdminErrorPage } from "../pages/Error/ErrorPage"; // Trang hiển thị khi gặp lỗi
import MovieManagement from "../admin/pages/MovieManagement/MovieManagement";
import TicketDashboard from "../admin/pages/TicketManagement/TicketDashboard/TicketDashboard";
import TicketList from "../admin/pages/TicketManagement/TicketList/TicketList";
import MovieStatsDashboard from "../admin/pages/MovieManagement/MovieStatsDashboard/MovieStatsDashboard";
import CinemaStatsDashboard from "../admin/pages/CinemaManagenment/CinemaStatsDashboard/CinemaStatsDashboard";
import ShowtimeList from "../admin/pages/ShowtimeManagement/ShowtimeList/ShowtimeList";
import ShowtimeDashboard from "../admin/pages/ShowtimeManagement/ShowtimeDashboard/ShowtimeDashboard";
import RevenueDashboard from "../admin/pages/RevenueManagement/RevenueDashboard";
import UserList from "../admin/pages/UserManagement/UserList/UserList";
import UserStats from "../admin/pages/UserManagement/UserDashboard/UserStats";
import EventList from "../admin/pages/EventManagement/EvenList/EventList";
import EventDashboard from "../admin/pages/EventManagement/EventDashboard/EventDashboard";

// Định nghĩa các route cho phần admin
export const AdminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute
        allowedRoles={["admin", "manager"]}
        redirectPath="/error-admin" // Điều hướng đến trang lỗi admin
      >
        <AdminApp />
      </ProtectedRoute>
    ),
    errorElement: <AdminErrorPage />, // Trang lỗi dành riêng cho admin
    children: [
      {
        path: "dashboard", // Route cho trang Dashboard
        element: <AdminDashboard />, // Component hiển thị
        label: "Trang chủ", // Label hiển thị trong Breadcrumbs hoặc menu
      },
      {
        path: "theaters", // Route menu cha cho "Quản lý rạp phim"
        label: "Quản lý rạp phim", // Label menu
        parent: "/admin/dashboard", // Breadcrumbs parent của route này
        // Không có `element` vì đây chỉ là menu cha, không hiển thị nội dung
      },

      // CINEMA
      {
        path: "theaters/list",
        element: <TheaterManagement />,
        label: "Danh sách rạp",
        parent: "/admin/theaters",
      },
      {
        path: "theaters/dashboard-theaters",
        element: <CinemaStatsDashboard />,
        label: "Danh sách rạp",
        parent: "/admin/theaters",
      },

      //MOVIE
      {
        path: "movies",
        label: "Quản lý phim",
        parent: "/admin/dashboard",
      },
      {
        path: "movies/list",
        element: <MovieManagement />,
        label: "Danh sách phim",
        parent: "/admin/movies",
      },
      {
        path: "movies/dashboard-movie",
        element: <MovieStatsDashboard />,
        label: "Thống kê phim",
        parent: "/admin/movies",
      },

      // TICKET
      {
        path: "tickets",
        label: "Quản lý vé",
        parent: "/admin/dashboard",
      },
      {
        path: "tickets/list",
        element: <TicketList />,
        label: "Danh sách vé",
        parent: "/admin/tickets",
      },
      {
        path: "tickets/dashboard-ticket",
        element: <TicketDashboard />,
        label: "Thống kê vé",
        parent: "/admin/tickets",
      },

      // SCHEDULES
      {
        path: "showtime",
        label: "Quản lý suất chiếu",
        parent: "/admin/dashboard",
      },
      {
        path: "showtime/list",
        element: <ShowtimeList />,
        label: "Danh sách suất chiếu",
        parent: "/admin/showtime",
      },
      {
        path: "showtime/dashboard-showtime",
        element: <ShowtimeDashboard />,
        label: "Thống kê suất chiếu",
        parent: "/admin/showtime",
      },
      // REVENUE
      {
        path: "revenue",
        label: "Quản lý doanh thu",
        element: <RevenueDashboard />,
        parent: "/admin/dashboard",
      },

      // USER
      {
        path: "user",
        label: "Quản lý tài khoản",
        parent: "/admin/dashboard",
      },
      {
        path: "user/list",
        element: <UserList />,
        label: "Danh sách tài khoản",
        parent: "/admin/user",
      },
      {
        path: "user/dashboard-user",
        element: <UserStats />,
        label: "Thống kê tài khoản",
        parent: "/admin/user",
      },

      // EVENT
      {
        path: "event",
        label: "Quản lý sự kiện",
        parent: "/admin/dashboard",
      },
      {
        path: "event/list",
        element: <EventList />,
        label: "Danh sách sự kiện",
        parent: "/admin/event",
      },
      {
        path: "event/dashboard-event",
        element: <EventDashboard />,
        label: "Thống kê sự kiện",
        parent: "/admin/event",
      },
    ],
  },
];
