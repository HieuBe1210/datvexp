import React from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse } from "@mui/material";
import {
  Home,
  ExpandLess,
  ExpandMore,
  Movie,
  TheaterComedy,
  Event,
  AttachMoney,
  Support,
  CalendarToday,
  Schedule,
  CreditCard,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.modul.scss";
import logo from "../../../assets/image/logo.png";

const Sidebar = () => {
  // State để quản lý trạng thái mở/đóng các menu dropdown
  const [openMenus, setOpenMenus] = React.useState({});
  const location = useLocation(); // Lấy thông tin URL hiện tại

  // Hàm toggle dropdown
  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Hàm kiểm tra xem URL có khớp với route của một item không
  const isActive = (path) => location.pathname.includes(path);
  return (
    <div>
      <Drawer
        className="content"
        variant="permanent" // Sidebar luôn hiển thị cố định (không ẩn đi).
        //Sử dụng CSS-in-JS của Material-UI để tùy chỉnh CSS cho Sidebar
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "rgba(22, 10, 95, 0.2)",
          },
        }}>
        <List>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          {/* Trang chủ */}
          <ListItem
            button
            component={Link}
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "sidebar-active" : ""}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>

          {/* Quản lý rạp phim */}
          <ListItem button onClick={() => toggleMenu("cinema")}>
            <ListItemIcon>
              <TheaterComedy />
            </ListItemIcon>
            <ListItemText primary="Quản lý rạp phim" />
            {/* ExpandLess và ExpandMore Hiển thị icon mũi tên chỉ lên hoặc xuống, tùy theo trạng thái. */}
            {openMenus.cinema ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.cinema} timeout="auto" unmountOnExit>
            {/* Hiển thị danh sách các mục con.  disablePadding: Loại bỏ khoảng cách padding mặc định */}
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="theaters/list"
                className={isActive("theaters/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách rạp" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.cinema} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="theaters/dashboard-theaters"
                className={isActive("theaters/dashboard-theaters") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê rạp" />
              </ListItem>
            </List>
          </Collapse>

          {/* Quản lý phim */}
          <ListItem button onClick={() => toggleMenu("movies")}>
            <ListItemIcon>
              <Movie />
            </ListItemIcon>
            <ListItemText primary="Quản lý phim" />
            {openMenus.movies ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.movies} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="movies/list"
                className={isActive("movies/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách phim" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.movies} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="movies/dashboard-movie"
                className={isActive("movies/dashboard-movie") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê phim" />
              </ListItem>
            </List>
          </Collapse>

          {/* Quản lý vé */}
          <ListItem button onClick={() => toggleMenu("tickets")}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Quản lý vé" />
            {openMenus.tickets ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.tickets} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="tickets/list"
                className={isActive("tickets/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách vé" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.tickets} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="tickets/dashboard-ticket"
                className={isActive("tickets/dashboard-ticket") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê vé" />
              </ListItem>
            </List>
          </Collapse>

          {/* Quản lý lịch chiếu */}
          <ListItem button onClick={() => toggleMenu("showtime")}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Quản lý suất chiếu" />
            {openMenus.showtime ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openMenus.showtime} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="showtime/list"
                className={isActive("showtime/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách suất chiếu" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.showtime} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="showtime/dashboard-showtime"
                className={isActive("showtime/dashboard-showtime") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê suất chiếu" />
              </ListItem>
            </List>
          </Collapse>

          {/* Quản lý sự kiện */}
          <ListItem button onClick={() => toggleMenu("event")}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Quản lý sự kiện" />
            {openMenus.event ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openMenus.event} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="event/list"
                className={isActive("event/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách sự kiện" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.event} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="event/dashboard-event"
                className={isActive("event/dashboard-event") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê sự kiện" />
              </ListItem>
            </List>
          </Collapse>

          {/* Phân cách */}
          <hr />

          {/* Quản lý tài khoản */}
          <ListItem button onClick={() => toggleMenu("user")}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Quản lý tài khoản" />
            {openMenus.user ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.user} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="user/list"
                className={isActive("user/list") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Danh sách tài khoản" />
              </ListItem>
            </List>
          </Collapse>
          <Collapse in={openMenus.user} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="user/dashboard-user"
                className={isActive("user/dashboard-user") ? "sidebar-active" : ""}>
                <ListItemText inset primary="Thống kê tài khoản" />
              </ListItem>
            </List>
          </Collapse>

          {/* Quản lý doanh thu */}
          <ListItem button component={Link} to="/admin/revenue">
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Quản lý doanh thu" />
          </ListItem>

          {/* Quản lý thanh toán */}
          <ListItem button component={Link} to="/admin/payments">
            <ListItemIcon>
              <CreditCard />
            </ListItemIcon>
            <ListItemText primary="Quản lý thanh toán" />
          </ListItem>

          {/* Quản lý hỗ trợ */}
          <ListItem button component={Link} to="/admin/support">
            <ListItemIcon>
              <Support />
            </ListItemIcon>
            <ListItemText primary="Quản lý hỗ trợ" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
