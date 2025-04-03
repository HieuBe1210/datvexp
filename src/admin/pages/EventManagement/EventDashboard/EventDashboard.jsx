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
import { fetchPromotions } from "../../../../services/service/servicePromotion";
import {
  calculateEventStats,
  checkEventAlerts,
  prepareEventChartData,
  getEventChartOptions,
} from "./eventDashboardUtils"; // Tách logic ra file utils
import "./EventDashboard.scss";

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

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    priority: null,
    status: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.dateRange) {
        filterParams.startDate = filters.dateRange[0]?.format("YYYY-MM-DD");
        filterParams.endDate = filters.dateRange[1]?.format("YYYY-MM-DD");
      }
      if (filters.priority) filterParams.priority = filters.priority;
      if (filters.status) filterParams.is_protected = filters.status === "protected";

      const response = await fetchPromotions(filterParams);
      console.log("Data: ", response);
      // Đảm bảo response.data là một mảng, nếu không thì trả về mảng rỗng
      const eventsData = Object.values(response);
      setEvents(eventsData);
    } catch (error) {
      // Nếu có lỗi, set events về mảng rỗng để tránh lỗi undefined
      setEvents([]);
      console.error("Failed to fetch events:", error);
      // Thêm thông báo lỗi
      // message.error("Không thể tải dữ liệu sự kiện, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const { activeEvents, endedEvents, upcomingEvents, totalViews, totalLikes, eventsByDate } =
    calculateEventStats(events);

  // Kiểm tra cảnh báo
  const { nearEndEvents, lowViewEvents } = checkEventAlerts(events);

  // Chuẩn bị dữ liệu biểu đồ
  const { lineChartData, barChartData } = prepareEventChartData(eventsByDate, events);

  // Cấu hình options cho biểu đồ
  const { lineChartOptions, barChartOptions } = getEventChartOptions(events);

  const priorities = [...new Set(events.map((event) => event.priority))].sort();
  const statuses = ["all", "protected", "public"];

  return (
    <div className="event-dashboard">
      {/* Bộ lọc */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Chọn mức độ ưu tiên"
            style={{ width: "100%" }}
            onChange={(value) => setFilters({ ...filters, priority: value })}
            allowClear>
            {priorities.map((priority) => (
              <Select.Option key={priority} value={priority}>
                Priority {priority}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Chọn trạng thái"
            style={{ width: "100%" }}
            onChange={(value) => setFilters({ ...filters, status: value })}
            defaultValue="all">
            {statuses.map((status) => (
              <Select.Option key={status} value={status}>
                {status === "all" ? "Tất cả" : status === "protected" ? "Bảo vệ" : "Công khai"}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="primary" block onClick={fetchData}>
            Áp dụng bộ lọc
          </Button>
        </Col>
      </Row>

      {/* Thống kê */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={24} sm={12} md={8} lg={4.8} className="statistic-col">
          <Card>
            <Statistic title="Sự kiện sắp diễn ra" value={upcomingEvents} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} className="statistic-col">
          <Card>
            <Statistic title="Sự kiện đang diễn ra" value={activeEvents} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} className="statistic-col">
          <Card>
            <Statistic title="Sự kiện đã kết thúc" value={endedEvents} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} className="statistic-col">
          <Card>
            <Statistic title="Tổng lượt xem" value={totalViews} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} className="statistic-col">
          <Card>
            <Statistic title="Tổng lượt thích" value={totalLikes} loading={loading} />
          </Card>
        </Col>
      </Row>

      {/* Cảnh báo */}
      {nearEndEvents.length > 0 && (
        <Alert
          message={`Có ${nearEndEvents.length} sự kiện sắp hết hạn trong 7 ngày tới`}
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
      {lowViewEvents.length > 0 && (
        <Alert
          message={`Có ${lowViewEvents.length} sự kiện có lượt xem thấp bất thường`}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Lượt xem sự kiện theo thời gian">
            <Line data={lineChartData} options={lineChartOptions} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Số lượng sự kiện theo mức độ ưu tiên">
            <Bar data={barChartData} options={barChartOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventDashboard;
