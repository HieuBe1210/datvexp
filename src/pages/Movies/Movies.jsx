import React, { useState, useEffect } from "react";
import "./Movies.scss";
import { CardMovie } from "../../components/Cards/Cards";
import { fetchMoviesByTab } from "../../services/service/serviceMovie";
import { Pagination } from "antd";
import { useSelector } from "react-redux";
import { CarouselSlide } from "../../components/Carousel/Carousel";
import FullPageSkeleton from "../../components/Skeleton/FullPageSkeleton"; // Import Skeleton để hiển thị khi tải dữ liệu

export const Movies = () => {
  const [movies, setMovies] = useState([]); // State lưu danh sách phim
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
  const moviesPerPage = 15; // Số lượng phim hiển thị trên mỗi trang
  const [activeTab, setActiveTab] = useState("nowShowing"); // Tab hiện tại (default là "PHIM ĐANG CHIẾU")
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading
  const { searchResults, isSearching } = useSelector((state) => state.search);

  // Gọi API để lấy danh sách phim khi component được render
  useEffect(() => {
    const fetchMoviesDataByTab = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesByTab(activeTab); // Lấy dữ liệu theo tab
        // Sắp xếp phim theo release_date giảm dần (mới nhất lên trên)
        const sortedMovies = data.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        setMovies(sortedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesDataByTab();
    window.scrollTo(0, 0); // Cuộn về đầu trang khi thay đổi trang
  }, [activeTab, currentPage]); // useEffect chạy lại khi currentPage thay đổi

  // Tính toán danh sách phim hiển thị trên trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage; // Vị trí phim cuối cùng trên trang hiện tại
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; // Vị trí phim đầu tiên trên trang hiện tại
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie); // Lấy danh sách phim của trang hiện tại

  // Hàm xử lý khi chuyển sang trang mới
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="content">
        <CarouselSlide />
        {/* Các nút lựa chọn loại phim */}
        <div className="movie-buttons">
          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}>
            PHIM SẮP CHIẾU
          </button>
          <button
            className={activeTab === "nowShowing" ? "active" : ""}
            onClick={() => setActiveTab("nowShowing")}>
            PHIM ĐANG CHIẾU
          </button>
          <button
            className={activeTab === "specialShows" ? "active" : ""}
            onClick={() => setActiveTab("specialShows")}>
            SUẤT CHIẾU ĐẶC BIỆT
          </button>
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}>
            TẤT CẢ CÁC PHIM
          </button>
        </div>

        {/* Phần nội dung danh sách phim */}
        {loading ? (
          <FullPageSkeleton />
        ) : (
          <div className="home__movie movies__list">
            {movies.length > 0 ? (
              currentMovies.map((item, index) => <CardMovie item={item} key={index} />)
            ) : (
              <p>Không có phim nào theo yêu cầu.</p>
            )}
          </div>
        )}
        {/* Phân trang */}
        <Pagination
          current={currentPage} // Trang hiện tại
          pageSize={moviesPerPage} // Số lượng phim trên mỗi trang
          total={isSearching ? searchResults.length : movies.length} // Tổng số phim
          onChange={handlePageChange} // Hàm xử lý khi chuyển trang
          showSizeChanger={false} // Ẩn tùy chọn thay đổi kích thước trang
          style={{ marginTop: "20px", textAlign: "center" }} // Căn giữa và thêm khoảng cách phía trên
        />
      </div>
    </>
  );
};
