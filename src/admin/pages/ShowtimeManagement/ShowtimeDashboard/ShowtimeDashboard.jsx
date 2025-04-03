import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Card, Table, Row, Col, Statistic, DatePicker, Dropdown, Button } from "antd";
import { fetchShowtimes, fetchCinemas } from "../../../../services/service/serviceCinemas";
import { fetchMovies } from "../../../../services/service/serviceMovie";
import { prepareShowtimeData } from "../ShowtimeListHandle";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./ShowtimeDashboard.scss";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const { RangePicker } = DatePicker;

// Màu sắc cho các phần trong biểu đồ tròn
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6F61",
  "#6A5ACD",
  "#FFD700",
  "#20B2AA",
  "#F06292",
  "#4CAF50",
];

const ShowtimeDashboard = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moviesData, setMoviesData] = useState([]);
  const [cinemasData, setCinemasData] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [showtimesRes, moviesRes, cinemasRes] = await Promise.all([
          fetchShowtimes(),
          fetchMovies(),
          fetchCinemas(),
        ]);

        const preparedData = prepareShowtimeData(showtimesRes, moviesRes, cinemasRes);
        setShowtimes(preparedData);
        setFilteredShowtimes(preparedData);
        setMoviesData(moviesRes);
        setCinemasData(cinemasRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Áp dụng bộ lọc khi dateRange hoặc selectedCinema thay đổi
  useEffect(() => {
    let filteredData = [...showtimes];

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter((showtime) => {
        const showDate = dayjs(showtime.start_time);
        return showDate.isAfter(dateRange[0]) && showDate.isBefore(dateRange[1]);
      });
    }

    // Lọc theo rạp chiếu
    if (selectedCinema) {
      filteredData = filteredData.filter((showtime) => showtime.cinemaName === selectedCinema);
    }

    setFilteredShowtimes(filteredData);
  }, [dateRange, selectedCinema, showtimes]);

  // Thống kê số lượng suất chiếu theo phim
  const statsByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movieName = showtime.movieName;
    if (!acc[movieName]) {
      acc[movieName] = { name: movieName, value: 0 };
    }
    acc[movieName].value += 1;
    return acc;
  }, {});

  const movieStatsData = Object.values(statsByMovie);

  // Thống kê số lượng suất chiếu theo rạp chiếu
  const statsByCinema = filteredShowtimes.reduce((acc, showtime) => {
    const cinemaName = showtime.cinemaName;
    if (!acc[cinemaName]) {
      acc[cinemaName] = { name: cinemaName, value: 0 };
    }
    acc[cinemaName].value += 1;
    return acc;
  }, {});

  const cinemaStatsData = Object.values(statsByCinema);

  // Thống kê số lượng suất chiếu theo ngày
  const statsByDate = filteredShowtimes.reduce((acc, showtime) => {
    const date = dayjs(showtime.start_time).format("DD/MM/YYYY");
    if (!acc[date]) {
      acc[date] = { name: date, value: 0 };
    }
    acc[date].value += 1;
    return acc;
  }, {});

  const dateStatsData = Object.values(statsByDate);

  // Tổng số suất chiếu
  const totalShowtimes = filteredShowtimes.length;

  // Danh sách rạp chiếu cho bộ lọc
  const cinemas = [...new Set(showtimes.map((showtime) => showtime.cinemaName))];

  // Dữ liệu cho biểu đồ tròn theo phim
  const movieChartData = {
    labels: movieStatsData.map((item) => item.name),
    datasets: [
      {
        data: movieStatsData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, movieStatsData.length),
        hoverBackgroundColor: COLORS.slice(0, movieStatsData.length).map((color) => `${color}CC`),
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn theo rạp chiếu
  const cinemaChartData = {
    labels: cinemaStatsData.map((item) => item.name),
    datasets: [
      {
        data: cinemaStatsData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, cinemaStatsData.length),
        hoverBackgroundColor: COLORS.slice(0, cinemaStatsData.length).map((color) => `${color}CC`),
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn theo ngày
  const dateChartData = {
    labels: dateStatsData.map((item) => item.name),
    datasets: [
      {
        data: dateStatsData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, dateStatsData.length),
        hoverBackgroundColor: COLORS.slice(0, dateStatsData.length).map((color) => `${color}CC`),
      },
    ],
  };

  // Cấu hình chung cho biểu đồ
  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} suất (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Cột cho bảng thống kê theo phim
  const movieColumns = [
    {
      title: "Tên phim",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Số lượng suất chiếu",
      dataIndex: "value",
      key: "value",
      width: 150,
    },
  ];

  // Cột cho bảng thống kê theo rạp chiếu
  const cinemaColumns = [
    {
      title: "Rạp chiếu",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Số lượng suất chiếu",
      dataIndex: "value",
      key: "value",
      width: 150,
    },
  ];

  // Cột cho bảng thống kê theo ngày
  const dateColumns = [
    {
      title: "Ngày",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Số lượng suất chiếu",
      dataIndex: "value",
      key: "value",
      width: 150,
    },
  ];

  return (
    <div className="showtime-statistics">
      <h2>Thống kê suất chiếu</h2>

      {/* Toolbar cho bộ lọc */}
      <div className="toolbar">
        <RangePicker
          onChange={(dates) => setDateRange(dates)}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
        />
        <Dropdown
          menu={{
            items: [
              { key: "all", label: "Tất cả rạp chiếu", onClick: () => setSelectedCinema(null) },
              ...cinemas.map((cinema) => ({
                key: cinema,
                label: cinema,
                onClick: () => setSelectedCinema(cinema),
              })),
            ],
          }}>
          <Button>{selectedCinema || "Tất cả rạp chiếu"}</Button>
        </Dropdown>
        {(dateRange || selectedCinema) && (
          <Button
            className="delete-filter-btn"
            onClick={() => {
              setDateRange(null);
              setSelectedCinema(null);
            }}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Tổng quan */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số suất chiếu"
              value={totalShowtimes}
              loading={loading}
              suffix="suất"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số lượng phim"
              value={Object.keys(statsByMovie).length}
              loading={loading}
              suffix="phim"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số lượng rạp chiếu"
              value={Object.keys(statsByCinema).length}
              loading={loading}
              suffix="rạp"
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tròn */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card title="Biểu đồ theo phim">
            <div className="chart-container">
              <Pie data={movieChartData} options={chartOptions} height={300} />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Biểu đồ theo rạp chiếu">
            <div className="chart-container">
              <Pie data={cinemaChartData} options={chartOptions} height={300} />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Biểu đồ theo ngày">
            <div className="chart-container">
              <Pie data={dateChartData} options={chartOptions} height={300} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Thống kê chi tiết */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thống kê theo phim">
            <Table
              columns={movieColumns}
              dataSource={movieStatsData}
              rowKey="name"
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thống kê theo rạp chiếu">
            <Table
              columns={cinemaColumns}
              dataSource={cinemaStatsData}
              rowKey="name"
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thống kê theo ngày">
            <Table
              columns={dateColumns}
              dataSource={dateStatsData}
              rowKey="name"
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShowtimeDashboard;
