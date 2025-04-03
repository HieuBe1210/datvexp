import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Table, Dropdown, DatePicker, Button, Modal, Radio, Tag } from "antd";
import { fetchShowtimes, fetchCinemas } from "../../../../services/service/serviceCinemas";
import { fetchMovies } from "../../../../services/service/serviceMovie";
import {
  handleSearchShowtimes,
  handleFilterShowtimes,
  handleClearShowtimeFilters,
  handleShowtimePageChange,
  prepareShowtimeData,
  handleExportShowtimeReport,
} from "../ShowtimeListHandle";
import "./ShowtimeList.scss";
import SearchBar from "../../../components/SearchBar/SearchBar";

const ShowtimeList = () => {
  const [showtimes, setShowtimes] = useState([]); // Dữ liệu gốc từ API
  const [filteredShowtimes, setFilteredShowtimes] = useState([]); // Dữ liệu đã lọc
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({}); // Bộ lọc hiện tại
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDateRange, setExportDateRange] = useState(null);
  const [moviesData, setMoviesData] = useState([]);
  const [cinemasData, setCinemasData] = useState([]);

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
        setShowtimes(preparedData); // Lưu dữ liệu gốc
        setFilteredShowtimes(preparedData); // Ban đầu hiển thị toàn bộ dữ liệu
        setTotal(preparedData.length);
        setMoviesData(moviesRes);
        setCinemasData(cinemasRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ chạy một lần khi mount

  // Áp dụng bộ lọc và tìm kiếm khi filters hoặc searchTerm thay đổi
  useEffect(() => {
    let filteredData = [...showtimes]; // Lấy dữ liệu gốc để lọc

    // Áp dụng bộ lọc
    if (filters.movieName) {
      filteredData = filteredData.filter((showtime) => showtime.movieName === filters.movieName);
    }
    if (filters.cinemaName) {
      filteredData = filteredData.filter((showtime) => showtime.cinemaName === filters.cinemaName);
    }
    if (filters.city) {
      filteredData = filteredData.filter((showtime) => showtime.city === filters.city);
    }
    if (filters.room) {
      filteredData = filteredData.filter((showtime) => showtime.room === filters.room);
    }
    if (filters.startDate) {
      filteredData = filteredData.filter((showtime) =>
        dayjs(showtime.start_time).isSame(filters.startDate, "day")
      );
    }

    // Áp dụng tìm kiếm
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (showtime) =>
          showtime.movieName.toLowerCase().includes(lowerTerm) ||
          showtime.cinemaName.toLowerCase().includes(lowerTerm) ||
          showtime.city.toLowerCase().includes(lowerTerm) ||
          showtime.room.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredShowtimes(filteredData);
    setTotal(filteredData.length);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [filters, searchTerm, showtimes]); // Chạy lại khi filters hoặc searchTerm thay đổi

  const cities = [...new Set(showtimes.map((showtime) => showtime.city))];
  const cinemas = [...new Set(showtimes.map((showtime) => showtime.cinemaName))];
  const movies = [...new Set(showtimes.map((showtime) => showtime.movieName))];
  const rooms = [...new Set(showtimes.map((showtime) => showtime.room))];
  const genres = [...new Set(showtimes.map((showtime) => showtime.genre))];

  const columns = [
    {
      title: "Tên phim",
      dataIndex: "movieName",
      key: "movieName",
      width: 350,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.logo}
            alt={text}
            style={{ width: 50, height: 50, objectFit: "cover", marginRight: 10 }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinemaName",
      key: "cinemaName",
      width: 200,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.city}</div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 200,
      render: (record) => (
        <div>
          <div>{record.startTimeFormatted}</div>
          <div style={{ fontSize: 12, color: "#666" }}>→ {record.endTimeFormatted}</div>
        </div>
      ),
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      width: 100,
      key: "genre",
      render: (genre) => <Tag color="blue">{genre}</Tag>,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      render: (duration) => `${duration} phút`,
    },
  ];

  return (
    <div className="showtime-list">
      <div className="toolbar">
        <Dropdown
          menu={{
            items: cities.map((city) => ({
              key: city,
              label: city,
              onClick: () => handleFilterShowtimes("city", city, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Thành phố</Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: cinemas.map((cinema) => ({
              key: cinema,
              label: cinema,
              onClick: () =>
                handleFilterShowtimes("cinemaName", cinema, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Rạp chiếu</Button>
        </Dropdown>

        <DatePicker
          onChange={(date) => handleFilterShowtimes("startDate", date, setFilters, setCurrentPage)}
          placeholder="Chọn ngày"
        />

        <Dropdown
          menu={{
            items: movies.map((movie) => ({
              key: movie,
              label: movie,
              onClick: () => handleFilterShowtimes("movieName", movie, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Phim</Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: rooms.map((room) => ({
              key: room,
              label: room,
              onClick: () => handleFilterShowtimes("room", room, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Phòng chiếu</Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: genres.map((genre) => ({
              key: genre,
              label: genre,
              onClick: () => handleFilterShowtimes("genre", genre, setFilters, setCurrentPage),
            })),
          }}>
          <Button>Thể loại</Button>
        </Dropdown>

        <Button onClick={() => setIsExportModalVisible(true)}>Xuất báo cáo</Button>

        {Object.keys(filters).length > 0 || searchTerm ? (
          <Button
            className="delete-filter-btn"
            onClick={() =>
              handleClearShowtimeFilters(
                setFilters,
                setSearchTerm,
                showtimes,
                setFilteredShowtimes,
                setCurrentPage
              )
            }>
            Xóa bộ lọc
          </Button>
        ) : null}

        <div className="showtime-list-search">
          <SearchBar
            onSearch={(term) => {
              setSearchTerm(term);
              // handleSearchShowtimes(term, showtimes, setFilteredShowtimes); // Chuyển logic tìm kiếm vào useEffect
            }}
            placeholder="Tìm theo tên phim, rạp chiếu, thành phố..."
            value={searchTerm}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredShowtimes}
        rowKey={(record) => `${record.cinema_id}_${record.movie_id}_${record.start_time}`}
        pagination={{
          current: currentPage,
          total: total,
          onChange: (page) => handleShowtimePageChange(page, setCurrentPage),
        }}
        loading={loading}
      />

      <Modal
        title="Xuất báo cáo lịch chiếu"
        open={isExportModalVisible}
        onOk={() => {
          handleExportShowtimeReport(
            filteredShowtimes,
            exportFormat,
            exportDateRange,
            setIsExportModalVisible
          );
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

export default ShowtimeList;
