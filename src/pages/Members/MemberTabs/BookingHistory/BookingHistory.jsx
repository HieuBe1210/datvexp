import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { fetchBookingHistory } from "../../../../services/service/serviceBooking";
import BookingDetailsModal from "./BookingDetailsModal";
import "./BookingHistory.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const email = userInfo?.email;
  useEffect(() => {
    const loadBookings = async () => {
      const history = await fetchBookingHistory(email);
      setBookings(history);
    };
    loadBookings();
  }, [email]);

  const columns = [
    {
      title: "Tên phim",
      dataIndex: ["movieDetails", "movieName"],
      key: "movieName",

      // Liên kết dẫn đến trang chi tiết phim
      render: (text, record) => (
        <Link
          to={`/movieinf/${record.movieDetails.movie_id}`}
          style={{ color: "#1890ff" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Rạp",
      dataIndex: ["movieDetails", "theater"],
      key: "theater",
      responsive: ["md", "lg", "xl"], // Ẩn trên màn hình nhỏ (xs, sm)
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        `${new Intl.NumberFormat("vi-VN").format(amount)} VND`,
      responsive: ["md", "lg", "xl"], // Ẩn trên màn hình nhỏ (xs, sm)
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "success" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status === "success" ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faXmark} />
          )}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Xem
        </Button>
      ),
    },
  ];

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const dataSource = bookings.map((booking, index) => ({
    ...booking,
    key: index,
  }));

  return (
    <>
      <div className="booking-history-wrapper">
        <Table
          className="booking-history-table"
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }} // Cho phép cuộn ngang trên mobile
        />
      </div>
      <BookingDetailsModal
        isVisible={isModalVisible}
        handleCancel={handleCloseModal}
        bookingData={selectedBooking}
      />
    </>
  );
};

export default BookingHistory;
