import "./MemberTabs.modul.scss";
import React from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css"; // Nếu dùng phiên bản Ant Design >= v5
import { UserProfile } from "./ProfileTab/UserProfile";
// import MembershipCard from "./MembershipCardTab/MembershipCard";
import BookingHistory from "./BookingHistory/BookingHistory";
import { useNavigate, useLocation } from "react-router-dom";

const { TabPane } = Tabs;

const MemberTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy giá trị activeKey từ query string
  const params = new URLSearchParams(location.search);
  const activeKey = params.get("tab") || "user-profile"; // Mặc định là "user-profile"

  // Xử lý chuyển tab và cập nhật URL
  const handleTabChange = (key) => {
    navigate(`/members?tab=${key}`); // Điều hướng tới URL với tab mới
  };

  const tabItems = [
    {
      key: "user-profile",
      label: "Trang cá nhân",
      children: <UserProfile />,
    },

    {
      key: "booking-history",
      label: "Lịch sử đặt vé",
      children: <BookingHistory />,
    },
    {
      key: "membership-card",
      label: "Thẻ thành viên",
      // children: <MembershipCard />,
      children: <div>ĐANG PHÁT TRIỂN TÍNH NĂNG</div>,
    },
    {
      key: "vouchers",
      label: "Voucher",
      children: <div>ĐANG PHÁT TRIỂN TÍNH NĂNG</div>,
    },
    {
      key: "vti-points",
      label: "Điểm VTI",
      children: <div>ĐANG PHÁT TRIỂN TÍNH NĂNG</div>,
    },
  ];
  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        className="custom-tabs"
        centered
        items={tabItems}
        tabBarGutter={8} // Giảm khoảng cách giữa các tab
        type="card"
        size="small"
        moreIcon={null} // Ẩn icon thừa trên mobile
        tabPosition="top" // Để tab nằm trên cùng, tốt hơn cho mobile
      />
    </div>
  );
};

export default MemberTabs;
