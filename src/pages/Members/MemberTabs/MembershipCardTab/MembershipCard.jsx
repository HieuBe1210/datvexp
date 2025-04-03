import React from "react";
import { Tabs, Table } from "antd";
import "./MembershipCard.modul.scss";

const { TabPane } = Tabs;

const MembershipCard = () => {
  // Dữ liệu cho bảng
  const dataSource = [
    {
      key: "1",
      cardNumber: "123456",
      cardType: "Standard",
      activationDate: "24/10/2024",
      totalSpending: "100.000đ",
      status: "Đang hoạt động",
    },
  ];

  // Cột cho bảng
  const columns = [
    {
      title: "Số thẻ",
      dataIndex: "cardNumber",
      key: "cardNumber",
      align: "center",
    },
    {
      title: "Hạng thẻ",
      dataIndex: "cardType",
      key: "cardType",
      align: "center",
    },
    {
      title: "Ngày kích hoạt",
      dataIndex: "activationDate",
      key: "activationDate",
      align: "center",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpending",
      key: "totalSpending",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
  ];

  return (
    <div>
      <div className="membership-card">
        <h2 className="title">Thẻ thành viên</h2>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        />
        <p className="membership-note">
          Chi tiêu hơn <b>1.000.000đ</b> để được kích hoạt hạng thẻ <b>VIP</b>{" "}
          và nhận được nhiều ưu đãi.
        </p>
      </div>
    </div>
  );
};

export default MembershipCard;
