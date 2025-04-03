import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Table, Dropdown, DatePicker, Button, Modal, Radio } from "antd";
import {
  fetchTickets,
  handleSearch,
  handleFilter,
  handleClearFilters,
  handlePageChange,
  cancelTicketHandler,
  lockTicketHandler,
  handleExportReport,
} from "../TicketManagementHandle.js";
import "./TicketList.scss";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDateRange, setExportDateRange] = useState(null);

  useEffect(() => {
    fetchTickets(filters, currentPage, setTickets, setFilteredTickets, setTotal, setLoading);
  }, [currentPage, filters]);

  const theaters = [...new Set(tickets.map((ticket) => ticket.movieDetails.theater))];
  const movies = [...new Set(tickets.map((ticket) => ticket.movieDetails.movieName))];
  const statuses = [...new Set(tickets.map((ticket) => ticket.status))];

  const columns = [
    { title: "Mã vé", dataIndex: "app_trans_id", key: "app_trans_id" },
    { title: "Tên phim", dataIndex: ["movieDetails", "movieName"], key: "movieName" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-tag status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    { title: "Chi nhánh", dataIndex: ["movieDetails", "theater"], key: "theater" },
    { title: "Khách hàng", dataIndex: "app_user", key: "app_user" },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => {
              setSelectedTicket(record);
              setIsModalVisible(true);
            }}>
            Xem
          </Button>
          <Button
            onClick={() =>
              cancelTicketHandler(
                record.app_trans_id,
                filters,
                currentPage,
                setTickets,
                setFilteredTickets,
                setTotal,
                setIsModalVisible
              )
            }
            disabled={record.status !== "pending"}>
            Hủy
          </Button>
          <Button
            danger
            onClick={() =>
              lockTicketHandler(
                record.app_trans_id,
                filters,
                currentPage,
                setTickets,
                setFilteredTickets,
                setTotal,
                setIsModalVisible
              )
            }
            disabled={record.status === "locked" || record.status === "canceled"}>
            Khóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="ticket-list">
      <div className="toolbar">
        <Dropdown
          menu={{
            items: theaters.map((theater) => ({
              key: theater,
              label: theater,
              onClick: () => handleFilter("theater", theater, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Chi nhánh</Button>
        </Dropdown>
        <DatePicker
          onChange={(date) => handleFilter("showDate", date, setFilters, setCurrentPage)}
        />
        <Dropdown
          menu={{
            items: movies.map((movie) => ({
              key: movie,
              label: movie,
              onClick: () => handleFilter("movieName", movie, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Phim</Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: statuses.map((status) => ({
              key: status,
              label: status,
              onClick: () => handleFilter("status", status, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Trạng thái</Button>
        </Dropdown>
        <Button onClick={() => setIsExportModalVisible(true)}>Xuất báo cáo</Button>

        {Object.keys(filters).length > 0 || searchTerm ? (
          <Button
            onClick={() =>
              handleClearFilters(
                setFilters,
                setSearchTerm,
                tickets,
                setFilteredTickets,
                setCurrentPage
              )
            }>
            Xóa bộ lọc
          </Button>
        ) : null}

        <div className="ticket-list-search">
          <SearchBar
            onSearch={(term) => handleSearch(term, tickets, setFilteredTickets)}
            placeholder="Tìm theo mã vé, email, tên phim"
            value={searchTerm}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTickets}
        rowKey="app_trans_id"
        pagination={{
          pageSize: 15,
          current: currentPage,
          total: total,
          onChange: (page) => handlePageChange(page, setCurrentPage),
        }}
        loading={loading}
      />

      <Modal
        title="Chi tiết vé"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() =>
              cancelTicketHandler(
                selectedTicket?.app_trans_id,
                filters,
                currentPage,
                setTickets,
                setFilteredTickets,
                setTotal,
                setIsModalVisible
              )
            }
            disabled={selectedTicket?.status !== "pending"}>
            Hủy vé
          </Button>,
          <Button
            key="lock"
            danger
            onClick={() =>
              lockTicketHandler(
                selectedTicket?.app_trans_id,
                filters,
                currentPage,
                setTickets,
                setFilteredTickets,
                setTotal,
                setIsModalVisible
              )
            }
            disabled={selectedTicket?.status === "locked" || selectedTicket?.status === "canceled"}>
            Khóa vé
          </Button>,
        ]}>
        {selectedTicket && (
          <div>
            <p>
              <strong>Mã vé:</strong> {selectedTicket.app_trans_id}
            </p>
            <p>
              <strong>Tên phim:</strong> {selectedTicket.movieDetails.movieName}
            </p>
            <p>
              <strong>Suất chiếu:</strong> {selectedTicket.movieDetails.showTime},{" "}
              {selectedTicket.movieDetails.showDate}
            </p>
            <p>
              <strong>Ghế:</strong> {selectedTicket.movieDetails.seat}
            </p>
            <p>
              <strong>Giá:</strong> {selectedTicket.amount.toLocaleString()} VNĐ
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Chi nhánh:</strong> {selectedTicket.movieDetails.theater}
            </p>
            <p>
              <strong>Khách hàng:</strong> {selectedTicket.app_user}
            </p>
            <p>
              <strong>Thời gian giao dịch:</strong> {selectedTicket.transactionTime}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Xuất báo cáo"
        open={isExportModalVisible}
        onOk={() => {
          const filteredData = exportDateRange
            ? filteredTickets.filter((ticket) => {
                const transactionDate = dayjs(ticket.transactionTime);
                const [start, end] = exportDateRange;
                return transactionDate.isAfter(start) && transactionDate.isBefore(end);
              })
            : filteredTickets;
          handleExportReport(filteredData, exportFormat, exportDateRange, setIsExportModalVisible);
        }}
        onCancel={() => setIsExportModalVisible(false)}
        okText="Xuất"
        cancelText="Hủy">
        <p>Chọn định dạng xuất báo cáo:</p>
        <Radio.Group onChange={(e) => setExportFormat(e.target.value)} value={exportFormat}>
          <Radio value="excel">Excel</Radio>
          <Radio value="pdf">PDF</Radio>
        </Radio.Group>
        <p style={{ marginTop: 16 }}>Chọn khoảng thời gian (tùy chọn):</p>
        <DatePicker.RangePicker
          onChange={(dates) => setExportDateRange(dates)}
          format="YYYY-MM-DD"
        />
      </Modal>
    </div>
  );
};

export default TicketList;
