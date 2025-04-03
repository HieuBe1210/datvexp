import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Table, Select, Spin, message, DatePicker } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  calculateMovieStats,
  prepareChartData,
  getChartOptions,
  filterMoviesByDateRange,
} from "./movieStatsUtils";
import {
  fetchMovies,
  fetchMoviesByTab,
  getcomments,
  getSubcomments,
} from "../../../../services/service/serviceMovie";
import "./MovieStatsDashboard.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const { RangePicker } = DatePicker;

const MovieStatsDashboard = ({ tab = "all" }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genreFilter, setGenreFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [commentStats, setCommentStats] = useState({});
  const [comments, setComments] = useState({});

  // Hàm lấy dữ liệu phim từ Firebase
  const fetchMoviesData = async () => {
    setLoading(true);
    try {
      let moviesData;
      if (tab === "all") {
        moviesData = await fetchMovies(); // Lấy toàn bộ phim
      } else {
        moviesData = await fetchMoviesByTab(tab); // Lấy phim theo tab
      }
      setMovies(moviesData || []);
      setFilteredMovies(moviesData || []);
    } catch (error) {
      message.error("Không thể tải dữ liệu phim. Vui lòng thử lại sau!");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu bình luận từ Firebase
  const fetchCommentsData = async () => {
    try {
      const commentsData = await getcomments(); // Lấy danh sách comment chính
      const commentsWithSubcomments = {};

      // Lấy subcomments cho từng comment
      for (const commentId in commentsData) {
        const subcomments = await getSubcomments(commentId);
        commentsData[commentId].subcomments = subcomments || {};
        commentsWithSubcomments[commentId] = commentsData[commentId];
      }

      setComments(commentsWithSubcomments);
    } catch (error) {
      message.error("Không thể tải dữ liệu bình luận. Vui lòng thử lại sau!");
      console.error("Error fetching comments:", error);
    }
  };

  // Hàm tính toán số lượng bình luận và subcomments
  const calculateCommentStats = () => {
    const stats = {};

    // Khởi tạo số lượng bình luận cho tất cả phim là 0
    movies.forEach((movie) => {
      stats[movie.movie_id] = {
        movie_name: movie.movie_name,
        totalComments: 0,
      };
    });

    // Duyệt qua dữ liệu bình luận
    Object.values(comments).forEach((comment) => {
      const movieId = comment.movieId;
      if (stats[movieId]) {
        // Tăng số lượng bình luận chính
        stats[movieId].totalComments += 1;
        // Tăng số lượng subcomments (nếu có)
        if (comment.subcomments) {
          stats[movieId].totalComments += Object.keys(comment.subcomments).length;
        }
      }
    });

    setCommentStats(stats);
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchMoviesData();
  }, [tab]);

  // Lấy dữ liệu bình luận khi component được mount
  useEffect(() => {
    fetchCommentsData();
  }, []);

  // Tính toán số lượng bình luận khi danh sách phim hoặc bình luận thay đổi
  useEffect(() => {
    if (movies.length > 0 && Object.keys(comments).length > 0) {
      calculateCommentStats();
    }
  }, [movies, comments]);

  // Lọc phim theo thể loại, trạng thái và thời gian
  useEffect(() => {
    let filtered = movies;

    // Lọc theo thể loại
    if (genreFilter) {
      filtered = filtered.filter((movie) => movie.genre.split(", ").includes(genreFilter));
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter((movie) => movie.status === statusFilter);
    }

    // Lọc theo thời gian
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filterMoviesByDateRange(filtered, startDate, endDate);
    }

    setFilteredMovies(filtered);
  }, [genreFilter, statusFilter, dateRange, movies]);

  // Tính toán thống kê
  const { statusStats, genreStats, viewingAgeStats, topRatedMovies, topTicketSoldMovies } =
    calculateMovieStats(filteredMovies);

  // Chuẩn bị dữ liệu cho biểu đồ
  const { genreChartData, statusChartData } = prepareChartData(genreStats, statusStats);

  // Cấu hình options cho biểu đồ
  const { pieChartOptions, statusChartOptions } = getChartOptions();

  // Tạo danh sách thể loại và trạng thái cho bộ lọc
  const genres = [
    ...new Set(movies.flatMap((movie) => movie.genre.split(", ").map((g) => g.trim()))),
  ];
  const statuses = ["active", "upcoming", "close"];

  // Cột cho bảng top 5 phim có rating cao nhất
  const ratingColumns = [
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "rating",
      key: "rating",
    },
  ];

  // Cột cho bảng top 5 phim có số vé bán ra cao nhất
  const ticketColumns = [
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Số vé bán ra",
      dataIndex: "total_tickets_sold",
      key: "total_tickets_sold",
    },
  ];

  // Cột cho bảng phim có nhiều bình luận nhất
  const commentColumns = [
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Tổng số bình luận",
      dataIndex: "totalComments",
      key: "totalComments",
    },
  ];

  // Top 5 phim có nhiều bình luận nhất
  const topCommentedMovies = Object.values(commentStats)
    .sort((a, b) => b.totalComments - a.totalComments)
    .slice(0, 5);

  return (
    <div className="movie-stats-dashboard">
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
                placeholder="Chọn thể loại"
                style={{ width: "100%" }}
                onChange={(value) => setGenreFilter(value)}
                allowClear>
                {genres.map((genre) => (
                  <Select.Option key={genre} value={genre}>
                    {genre}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: "100%" }}
                onChange={(value) => setStatusFilter(value)}
                allowClear>
                <Select.Option value="active">Đang chiếu</Select.Option>
                <Select.Option value="upcoming">Sắp chiếu</Select.Option>
                <Select.Option value="close">Đã đóng</Select.Option>
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

          {/* Thống kê trạng thái phim */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic title="Phim đang chiếu" value={statusStats.active} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Phim sắp chiếu" value={statusStats.upcoming} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Phim đã đóng" value={statusStats.close} />
              </Card>
            </Col>
          </Row>

          {/* Thống kê độ tuổi xem */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {Object.keys(viewingAgeStats).map((age) => (
              <Col span={6} key={age}>
                <Card>
                  <Statistic
                    title={`Độ tuổi ${age === "P" ? "Phổ thông" : age === "K" ? "Mọi lứa tuổi" : age + "+"}`}
                    value={viewingAgeStats[age]}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Biểu đồ và bảng thống kê */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Phân bố phim theo thể loại">
                <Pie data={genreChartData} options={pieChartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Phân bố phim theo trạng thái">
                <Pie data={statusChartData} options={statusChartOptions} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Top 5 phim có rating cao nhất">
                <Table
                  columns={ratingColumns}
                  dataSource={topRatedMovies}
                  pagination={false}
                  rowKey="movie_name"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top 5 phim có số vé bán ra cao nhất">
                <Table
                  columns={ticketColumns}
                  dataSource={topTicketSoldMovies}
                  pagination={false}
                  rowKey="movie_name"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Top 5 phim có nhiều bình luận nhất">
                <Table
                  columns={commentColumns}
                  dataSource={topCommentedMovies}
                  pagination={false}
                  rowKey="movie_name"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default MovieStatsDashboard;
