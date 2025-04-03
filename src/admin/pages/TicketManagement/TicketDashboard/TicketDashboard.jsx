import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Alert, Button, DatePicker, Select } from "antd";
import { Line, Bar } from "react-chartjs-2";
import dayjs from "dayjs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchOders } from "../../../../services/service/serviceOdres";
import {
  calculateTicketStats,
  calculateFillRate,
  checkAlerts,
  prepareChartData,
  getChartOptions,
} from "./ticketDashboardUtils"; // Import các hàm từ file utils
import "./TicketDashboard.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    theater: null,
    movieName: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.dateRange) {
        filterParams.showDate = filters.dateRange.map((date) => date.format("DD/MM"));
      }
      if (filters.theater) filterParams.theater = filters.theater;
      if (filters.movieName) filterParams.movieName = filters.movieName;

      const response = await fetchOders("", filterParams, 1, 100);
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      // Hiển thị thông báo lỗi cho người dùng
      // Ví dụ: message.error("Không thể tải dữ liệu vé, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán các số liệu thống kê
  const {
    ticketsByDay,
    totalTicketsWeek,
    totalTicketsMonth,
    usedTickets,
    unusedTickets,
    canceledTickets,
    pendingTickets,
  } = calculateTicketStats(tickets);

  // Tính tỷ lệ lấp đầy ghế
  const fillRateByShowtime = calculateFillRate(tickets);

  // Kiểm tra cảnh báo
  const { nearFullShowtimes, unusualTickets } = checkAlerts(tickets, fillRateByShowtime);

  // Chuẩn bị dữ liệu cho biểu đồ
  const { lineChartData, barChartData } = prepareChartData(ticketsByDay, fillRateByShowtime);

  // Cấu hình options cho biểu đồ
  const { lineChartOptions, barChartOptions } = getChartOptions(tickets, fillRateByShowtime);

  const theaters = [...new Set(tickets.map((ticket) => ticket.movieDetails.theater))];
  const movies = [...new Set(tickets.map((ticket) => ticket.movieDetails.movieName))];

  return (
    <div className="ticket-dashboard">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Chọn chi nhánh"
            style={{ width: "100%" }}
            onChange={(value) => setFilters({ ...filters, theater: value })}
            allowClear>
            {theaters.map((theater) => (
              <Select.Option key={theater} value={theater}>
                {theater}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            placeholder="Chọn phim"
            style={{ width: "100%" }}
            onChange={(value) => setFilters({ ...filters, movieName: value })}
            allowClear>
            {movies.map((movie) => (
              <Select.Option key={movie} value={movie}>
                {movie}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={fetchData}>
            Áp dụng bộ lọc
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số vé đã bán (ngày)"
              value={ticketsByDay[dayjs().format("DD/MM")] || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số vé đã bán (tuần)"
              value={totalTicketsWeek}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số vé đã bán (tháng)"
              value={totalTicketsMonth}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Vé đã sử dụng" value={usedTickets} loading={loading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Vé đã hủy" value={canceledTickets} loading={loading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Vé đang chờ xử lý" value={pendingTickets} loading={loading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Vé chưa sử dụng" value={unusedTickets} loading={loading} />
          </Card>
        </Col>
      </Row>

      {pendingTickets > 0 && (
        <Alert
          message={`Có ${pendingTickets} vé đang chờ xử lý`}
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {nearFullShowtimes.length > 0 && (
        <Alert
          message={`Có ${nearFullShowtimes.length} suất chiếu sắp hết chỗ (tỷ lệ lấp đầy > 90%)`}
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {unusualTickets.length > 0 && (
        <Alert
          message={`Có ${unusualTickets.length} vé có dấu hiệu bất thường (ghế bị đặt trùng)`}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Số lượng vé đã bán theo thời gian">
            <Line data={lineChartData} options={lineChartOptions} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tỷ lệ lấp đầy ghế theo suất chiếu">
            <Bar data={barChartData} options={barChartOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TicketDashboard;
