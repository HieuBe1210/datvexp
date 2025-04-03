import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler, // Import Filler plugin để khắc phục cảnh báo
} from "chart.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable
import { processRevenueData, prepareExcelData } from "./revenueUtils";
import { Card, Table, Row, Col, Statistic, DatePicker, Button, Modal, Radio } from "antd";
import "./RevenueDashboard.scss";
import { fetchCinemas } from "../../../services/service/serviceCinemas";
import { fetchOders } from "../../../services/service/serviceOdres";
import { fetchMovies } from "../../../services/service/serviceMovie";

// Đăng ký các plugin của Chart.js, bao gồm Filler
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const { RangePicker } = DatePicker;

const RevenueDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [revenueByTime, setRevenueByTime] = useState({});
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [revenueByCinema, setRevenueByCinema] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [filterType, setFilterType] = useState("day");
  const [dateRange, setDateRange] = useState([]);
  const [exportDateRange, setExportDateRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState({ orders: {}, movies: {}, cinemas: {} });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setLoading(true);
        const cinemasData = await fetchCinemas();
        const ordersData = await fetchOders(null, {}, 1, 1000);
        const moviesData = await fetchMovies();

        const ordersArray = ordersData?.data || [];
        const ordersObject = ordersArray.reduce((acc, order) => {
          acc[order.app_trans_id] = order;
          return acc;
        }, {});

        const moviesObject = Array.isArray(moviesData)
          ? moviesData.reduce((acc, movie) => {
              acc[`movie${movie.movie_id}`] = movie;
              return acc;
            }, {})
          : moviesData || {};

        const cinemasObject = Array.isArray(cinemasData)
          ? cinemasData.reduce((acc, cinema) => {
              const cinemaKey = `cinema${cinema.cinema_id.split("_")[1]}`;
              acc[cinemaKey] = cinema;
              return acc;
            }, {})
          : cinemasData || {};

        setRawData({ orders: ordersObject, movies: moviesObject, cinemas: cinemasObject });

        const staticData = processRevenueData(ordersObject, moviesObject, cinemasObject, "day");
        setTotalRevenue(staticData.totalRevenue);
        setTicketsSold(staticData.ticketsSold);
        setRevenueByMovie(staticData.revenueByMovie);
        setRevenueByCinema(staticData.revenueByCinema);
        setTopCustomers(staticData.topCustomers);
      } catch (error) {
        console.error("Error loading static data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStaticData();
  }, []);

  useEffect(() => {
    if (!rawData.orders || !rawData.movies || !rawData.cinemas) return;

    const startDate = dateRange?.[0]?.toDate();
    const endDate = dateRange?.[1]?.toDate();

    const dynamicData = processRevenueData(
      rawData.orders,
      rawData.movies,
      rawData.cinemas,
      filterType,
      startDate,
      endDate
    );
    setRevenueByTime(dynamicData.revenueByTime);
  }, [filterType, dateRange, rawData]);

  const timeChartData = {
    labels: Object.keys(revenueByTime),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: Object.values(revenueByTime),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true, // Giữ fill: true, vì đã đăng ký Filler plugin
      },
    ],
  };

  const exportToExcel = (filteredData) => {
    const data = prepareExcelData(
      filteredData.totalRevenue,
      filteredData.ticketsSold,
      filteredData.revenueByTime,
      filteredData.revenueByMovie,
      filteredData.revenueByCinema,
      filteredData.topCustomers,
      filterType
    );
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Report");
    XLSX.writeFile(wb, `Revenue_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToPDF = (filteredData) => {
    const doc = new jsPDF();

    // Thêm font hỗ trợ tiếng Việt (nếu cần)
    doc.setFont("Helvetica", "normal"); // Sử dụng font mặc định, nhưng bạn có thể thêm font tiếng Việt nếu cần

    doc.setFontSize(16);
    doc.text("BÁO CÁO DOANH THU", 14, 20);

    // Tổng quan
    doc.setFontSize(12);
    doc.text("Tổng quan", 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [["", "Giá trị"]],
      body: [
        ["Doanh thu tổng", filteredData.totalRevenue.toLocaleString()],
        ["Tổng số vé đã bán", filteredData.ticketsSold],
      ],
    });

    // Doanh thu theo thời gian
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text(
      `Doanh thu theo ${filterType === "day" ? "ngày" : filterType === "month" ? "tháng" : "năm"}`,
      14,
      finalY
    );
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Thời gian", "Doanh thu (VND)"]],
      body: Object.entries(filteredData.revenueByTime).map(([time, revenue]) => [
        time,
        revenue.toLocaleString(),
      ]),
    });

    // Doanh thu theo phim
    finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Doanh thu theo phim", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Phim", "Doanh thu (VND)"]],
      body: filteredData.revenueByMovie.map((item) => [item.movie, item.revenue.toLocaleString()]),
    });

    // Doanh thu theo rạp
    finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Doanh thu theo rạp", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Rạp", "Doanh thu (VND)"]],
      body: filteredData.revenueByCinema.map((item) => [
        item.cinema,
        item.revenue.toLocaleString(),
      ]),
    });

    // Top khách hàng
    finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Top khách hàng VIP", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Email", "Doanh thu (VND)"]],
      body: filteredData.topCustomers.map((item) => [item.email, item.revenue.toLocaleString()]),
    });

    doc.save(`Revenue_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExport = () => {
    const startDate = exportDateRange?.[0]?.toDate();
    const endDate = exportDateRange?.[1]?.toDate();

    const filteredData = processRevenueData(
      rawData.orders,
      rawData.movies,
      rawData.cinemas,
      filterType,
      startDate,
      endDate
    );

    if (exportFormat === "excel") {
      exportToExcel(filteredData);
    } else {
      exportToPDF(filteredData);
    }

    setIsModalVisible(false);
    setExportDateRange([]);
  };

  const movieColumns = [
    { title: "Tên phim", dataIndex: "movie", key: "movie", width: 300 },
    { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue", width: 150 },
  ];

  const cinemaColumns = [
    { title: "Rạp chiếu", dataIndex: "cinema", key: "cinema", width: 300 },
    { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue", width: 150 },
  ];

  const customerColumns = [
    { title: "Email", dataIndex: "email", key: "email", width: 300 },
    { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue", width: 150 },
  ];

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="revenue-statistics">
      <h2>Thống kê doanh thu</h2>

      <div className="toolbar">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}>
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
        />
        <Button onClick={() => setIsModalVisible(true)} style={{ marginLeft: "10px" }}>
          Xuất báo cáo
        </Button>
        {dateRange && (
          <Button
            className="delete-filter-btn"
            onClick={() => setDateRange(null)}
            style={{ marginLeft: "10px" }}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <Modal
        title="Xuất báo cáo"
        visible={isModalVisible}
        onOk={handleExport}
        onCancel={() => setIsModalVisible(false)}
        okText="Xuất"
        cancelText="Hủy">
        <div style={{ marginBottom: 16 }}>
          <p>Chọn định dạng xuất báo cáo:</p>
          <Radio.Group value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <Radio value="excel">Excel</Radio>
            <Radio value="pdf">PDF</Radio>
          </Radio.Group>
        </div>
        <div>
          <p>Chọn khoảng thời gian (tùy chọn):</p>
          <RangePicker
            value={exportDateRange}
            onChange={(dates) => setExportDateRange(dates)}
            format="DD/MM/YYYY"
            placeholder={["Start date", "End date"]}
          />
        </div>
      </Modal>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Doanh thu tổng"
              value={totalRevenue}
              suffix="VND"
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Tổng số vé đã bán" value={ticketsSold} suffix="vé" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={`Doanh thu theo ${
              filterType === "day" ? "ngày" : filterType === "month" ? "tháng" : "năm"
            }`}>
            <div className="chart-container">
              <Line
                data={timeChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={300}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thống kê theo phim">
            <Table
              columns={movieColumns}
              dataSource={revenueByMovie}
              rowKey="movie"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thống kê theo rạp chiếu">
            <Table
              columns={cinemaColumns}
              dataSource={revenueByCinema}
              rowKey="cinema"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top khách hàng VIP">
            <Table
              columns={customerColumns}
              dataSource={topCustomers}
              rowKey="email"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueDashboard;
