import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Table, Select, Spin, message, DatePicker } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  calculateCinemaStats,
  prepareChartData,
  getChartOptions,
  filterByDateRange,
} from "./cinemaStatsUtils";
import { fetchCinemas, fetchShowtimes } from "../../../../services/service/serviceCinemas";
import { fetchOders } from "../../../../services/service/serviceOdres";
import { fetchMovies } from "../../../../services/service/serviceMovie";
import "./CinemaStatsDashboard.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const { RangePicker } = DatePicker;

const CinemaStatsDashboard = () => {
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState(null);
  const [systemFilter, setSystemFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  // Hàm lấy dữ liệu rạp phim
  const fetchCinemasData = async () => {
    setLoading(true);
    try {
      const cinemasData = await fetchCinemas();
      setCinemas(Object.values(cinemasData));
      setFilteredCinemas(Object.values(cinemasData));
    } catch (error) {
      message.error("Không thể tải dữ liệu rạp phim. Vui lòng thử lại sau!");
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu đơn hàng
  const fetchOrdersData = async () => {
    try {
      const ordersData = await fetchOders(null, {}, 1, 1000);
      const ordersArray = Object.values(ordersData);
      setOrders(ordersArray);
      setFilteredOrders(ordersArray);
      console.log("Dữ liệu orders sau khi fetch:", ordersArray);
    } catch (error) {
      message.error("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau!");
      console.error("Error fetching orders:", error);
    }
  };

  // Hàm lấy dữ liệu phim
  const fetchMoviesData = async () => {
    try {
      const moviesData = await fetchMovies();
      setMovies(Object.values(moviesData));
    } catch (error) {
      message.error("Không thể tải dữ liệu phim. Vui lòng thử lại sau!");
      console.error("Error fetching movies:", error);
    }
  };

  // Hàm lấy dữ liệu lịch chiếu
  const fetchShowtimesData = async () => {
    try {
      const allShowtimes = [];
      for (const cinema of Object.values(cinemas)) {
        const showtimesData = await fetchShowtimes(cinema.cinema_id);
        if (showtimesData) {
          const showtimesWithCinemaId = Object.values(showtimesData).map((showtime) => ({
            ...showtime,
            cinema_id: cinema.cinema_id,
          }));
          allShowtimes.push(...showtimesWithCinemaId);
        }
      }
      setShowtimes(allShowtimes);
      setFilteredShowtimes(allShowtimes);
    } catch (error) {
      message.error("Không thể tải dữ liệu lịch chiếu. Vui lòng thử lại sau!");
      console.error("Error fetching showtimes:", error);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchCinemasData();
    fetchOrdersData();
    fetchMoviesData();
  }, []);

  // Lấy dữ liệu lịch chiếu khi danh sách rạp thay đổi
  useEffect(() => {
    if (cinemas.length > 0) {
      fetchShowtimesData();
    }
  }, [cinemas]);

  // Lọc rạp, đơn hàng và lịch chiếu theo bộ lọc
  useEffect(() => {
    let filteredCinemasList = Object.values(cinemas);
    let tempOrders = Object.values(orders);
    let tempShowtimes = Object.values(showtimes);

    // Lọc rạp theo thành phố
    if (cityFilter) {
      filteredCinemasList = filteredCinemasList.filter((cinema) => cinema.city === cityFilter);
    }

    // Lọc rạp theo hệ thống
    if (systemFilter) {
      filteredCinemasList = filteredCinemasList.filter((cinema) => {
        if (systemFilter === "CGV") return cinema.cinema_name.includes("CGV");
        if (systemFilter === "Lotte") return cinema.cinema_name.includes("Lotte");
        if (systemFilter === "Galaxy") return cinema.cinema_name.includes("Galaxy");
        if (systemFilter === "VTI") return cinema.cinema_name.includes("VTI");
        return false;
      });
    }

    // Lọc đơn hàng và lịch chiếu theo rạp đã lọc
    const filteredCinemaIds = filteredCinemasList.map((cinema) => cinema.cinema_id);
    tempOrders = tempOrders.filter((order) =>
      filteredCinemaIds.includes(order.movieDetails?.cinema_id)
    );
    tempShowtimes = tempShowtimes.filter((showtime) =>
      filteredCinemaIds.includes(showtime.cinema_id)
    );

    // Lọc theo thời gian
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      tempOrders = filterByDateRange(tempOrders, startDate, endDate, "createdAt");
      tempShowtimes = filterByDateRange(tempShowtimes, startDate, endDate, "start_time");
    } else {
      // Nếu không có dateRange, sử dụng toàn bộ dữ liệu
      console.log("Không có dateRange, sử dụng toàn bộ orders và showtimes");
    }

    setFilteredCinemas(filteredCinemasList);
    setFilteredOrders(tempOrders);
    setFilteredShowtimes(tempShowtimes);

    // Log để kiểm tra dữ liệu sau khi lọc
    console.log("Filtered Cinemas:", filteredCinemasList);
    console.log("Filtered Orders:", tempOrders);
    console.log("Filtered Showtimes:", tempShowtimes);
  }, [cityFilter, systemFilter, dateRange, cinemas, orders, showtimes]);

  // Tính toán thống kê
  const {
    totalCinemas,
    cityStats,
    systemStats,
    topTicketSoldCinemas,
    topRevenueCinemas,
    topShowtimeCinemas,
    topMoviesByCinema,
  } = calculateCinemaStats(filteredCinemas, filteredOrders, filteredShowtimes, movies);

  // Chuẩn bị dữ liệu cho biểu đồ
  const { cityChartData, systemChartData } = prepareChartData(cityStats, systemStats);

  // Cấu hình options cho biểu đồ
  const { cityChartOptions, systemChartOptions } = getChartOptions();

  // Tạo danh sách thành phố và hệ thống cho bộ lọc
  const cities = [...new Set(Object.values(cinemas).map((cinema) => cinema.city))];
  const systems = ["CGV", "Lotte", "Galaxy", "VTI"];

  // Cột cho bảng top 5 rạp có số vé bán ra cao nhất
  const ticketColumns = [
    {
      title: "Tên rạp",
      dataIndex: "cinema_name",
      key: "cinema_name",
    },
    {
      title: "Số vé bán ra",
      dataIndex: "total_tickets_sold",
      key: "total_tickets_sold",
    },
  ];

  // Cột cho bảng top 5 rạp có doanh thu cao nhất
  const revenueColumns = [
    {
      title: "Tên rạp",
      dataIndex: "cinema_name",
      key: "cinema_name",
    },
    {
      title: "Doanh thu (VND)",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (value) => value.toLocaleString(),
    },
  ];

  // Cột cho bảng top 5 rạp có nhiều lịch chiếu nhất
  const showtimeColumns = [
    {
      title: "Tên rạp",
      dataIndex: "cinema_name",
      key: "cinema_name",
    },
    {
      title: "Số lịch chiếu",
      dataIndex: "total_showtimes",
      key: "total_showtimes",
    },
  ];

  // Cột cho bảng top 5 phim được chiếu nhiều nhất tại mỗi rạp
  const movieColumns = [
    {
      title: "Tên rạp",
      dataIndex: "cinema_name",
      key: "cinema_name",
    },
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Số lịch chiếu",
      dataIndex: "total_showtimes",
      key: "total_showtimes",
    },
  ];

  return (
    <div className="cinema-stats-dashboard">
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {/* Bộ lọc */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                placeholder="Chọn thành phố"
                style={{ width: "100%" }}
                onChange={(value) => setCityFilter(value)}
                allowClear>
                {cities.map((city) => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Chọn hệ thống"
                style={{ width: "100%" }}
                onChange={(value) => setSystemFilter(value)}
                allowClear>
                {systems.map((system) => (
                  <Select.Option key={system} value={system}>
                    {system}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                format="DD-MM-YYYY"
                onChange={(dates) => setDateRange(dates)}
                style={{ width: "100%" }}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              />
            </Col>
          </Row>

          {/* Thống kê tổng số rạp */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <Statistic title="Tổng số rạp phim" value={totalCinemas} />
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ phân bố rạp */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Phân bố rạp theo thành phố">
                <Pie data={cityChartData} options={cityChartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Phân bố rạp theo hệ thống">
                <Pie data={systemChartData} options={systemChartOptions} />
              </Card>
            </Col>
          </Row>

          {/* Bảng thống kê */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Top 5 rạp có số vé bán ra cao nhất">
                <Table
                  columns={ticketColumns}
                  dataSource={topTicketSoldCinemas}
                  pagination={false}
                  rowKey="cinema_name"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top 5 rạp có doanh thu cao nhất">
                <Table
                  columns={revenueColumns}
                  dataSource={topRevenueCinemas}
                  pagination={false}
                  rowKey="cinema_name"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Top 5 rạp có nhiều lịch chiếu nhất">
                <Table
                  columns={showtimeColumns}
                  dataSource={topShowtimeCinemas}
                  pagination={false}
                  rowKey="cinema_name"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top 5 phim được chiếu nhiều nhất tại mỗi rạp">
                <Table
                  columns={movieColumns}
                  dataSource={topMoviesByCinema}
                  pagination={false}
                  rowKey={(record) => `${record.cinema_name}-${record.movie_name}`}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default CinemaStatsDashboard;
