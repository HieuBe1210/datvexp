import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { useCustomMovieSchedule } from "./useCustomMovieSchedule";
import not_found_showtimes from "../../assets/image/not_found_showtimes.svg";
import { calculateDistance } from "../../utils/utilsFunction";
import CustomModal from "../Home/MovieSchedule/CustomModal/CustomModal"; // Import CustomModal
import "./BookingFlow.scss";

const BookingFlow = ({ movie, onClose }) => {
  const navigate = useNavigate();

  // State và handlers từ MovieSchedule (đã custom lại)
  const {
    regions,
    selectedRegion,
    filteredCinemas,
    selectedCinema,
    selectedDate,
    dates,
    isSortedByLocation,
    isLoadingLocation,
    handleGetLocation,
    handleDisableNearYou,
    handleRegionChange,
    handleCinemaChange,
    handleDateChange,
    groupedShowtimes,
    formatDateLabel,
    userLocation,
  } = useCustomMovieSchedule(movie.movie_id);

  // State cho modal và tìm kiếm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách vùng dựa trên từ khóa tìm kiếm
  const filteredRegions = regions.filter((region) =>
    region.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Mở và đóng modal
  const openModal = () => {
    setIsModalOpen(true);
    setSearchTerm(""); // Reset từ khóa tìm kiếm khi mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý khi chọn một vùng
  const handleRegionSelect = (region) => {
    handleRegionChange({ target: { value: region } });
    closeModal();
  };

  const handleShowtimeSelect = (showtime) => {
    const cinema = filteredCinemas.find((c) => c.id === selectedCinema);
    if (!cinema || !cinema.id) {
      console.error("Invalid cinema data:", cinema);
      toast.error("Vui lòng chọn rạp chiếu hợp lệ");
      return;
    }

    const cinemaId = cinema.id.replace("cinema_", "");
    const numericCinemaId = cinemaId.match(/\d+/)?.[0] || "00";

    const formattedDate = selectedDate.toISOString().split("T")[0].replace(/-/g, "");
    const startTime = new Date(showtime.start_time);
    const hours = String(startTime.getHours()).padStart(2, "0");
    const minutes = String(startTime.getMinutes()).padStart(2, "0");

    const showtime_id = `showtime_${formattedDate}_${hours}${minutes}_cinema_${numericCinemaId.padStart(2, "0")}_movie${movie.movie_id}`;

    navigate(`/booking_seat/${movie.movie_id}`, {
      state: {
        cinema: cinema.name,
        cinema_id: cinema.id,
        date: selectedDate.toISOString().split("T")[0],
        time: `${hours}:${minutes}`,
        movie_id: movie.movie_id,
        showtime_id: showtime_id,
      },
    });
  };

  return (
    <div className="booking-flow">
      {/* Header thông tin phim */}
      <div className="movie-header">
        <img src={movie.image} alt={movie.movie_name} className="movie-poster" />
        <div className="movie-info">
          <h2>{movie.movie_name}</h2>
          <div className="movie-meta">
            <span className={`age-rating age-${movie.viewing_age}`}>{movie.viewing_age}+</span>
            <span>Thời lượng: {movie.duration} phút</span>
            <span>Thể loại: {movie.genre}</span>
            <span>Diễn viên: {movie.actor}</span>
          </div>
        </div>
      </div>

      {/* Khu vực chọn rạp và lịch */}
      <div className="booking-container">
        {/* Panel chọn rạp bên trái */}
        <div className="cinema-selection">
          <div className="location-controls">
            <button className="region-select-button" onClick={openModal}>
              {selectedRegion || "Chọn khu vực"} <span className="dropdown-icon">▼</span>
            </button>

            {isSortedByLocation ? (
              <button onClick={handleDisableNearYou} className="location-btn active">
                <FontAwesomeIcon icon={faLocationCrosshairs} />
                <span>Đang dùng vị trí</span>
              </button>
            ) : (
              <button
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className="location-btn">
                <FontAwesomeIcon icon={faLocationCrosshairs} />
                <span>{isLoadingLocation ? "Đang xác định..." : "Gần bạn"}</span>
              </button>
            )}
          </div>

          {/* Sử dụng CustomModal */}
          <CustomModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={
              <div className="modal-title-with-search">
                <span>Chọn khu vực</span>
                <div className="custom-modal-search-container">
                  <span className="custom-modal-search-icon"></span>
                  <input
                    type="text"
                    placeholder="Tìm khu vực..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="custom-modal-search-input"
                  />
                </div>
              </div>
            }>
            <div className="region-list">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region, index) => (
                  <div
                    key={index}
                    className={`region-item ${selectedRegion === region ? "active" : ""}`}
                    onClick={() => handleRegionSelect(region)}>
                    {region}
                  </div>
                ))
              ) : (
                <p className="no-results">Không tìm thấy khu vực.</p>
              )}
            </div>
          </CustomModal>

          <div className="cinema-list">
            {filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema) => (
                <div
                  key={cinema.id}
                  className={`cinema-card ${selectedCinema === cinema.id ? "active" : ""}`}
                  onClick={() => handleCinemaChange(cinema.id)}>
                  <div className="cinema-logo">
                    <img src={cinema.logo} alt="Logo" />
                  </div>
                  <div className="cinema-details">
                    <div className="cinema-info">
                      <h3>{cinema.name}</h3>
                      {userLocation && cinema.latitude && cinema.longitude && (
                        <p className="cinema-distance">
                          {calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            cinema.latitude,
                            cinema.longitude
                          ).toFixed(1)}{" "}
                          km
                        </p>
                      )}
                    </div>
                    <p className="cinema-address">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {cinema.location}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-cinemas">
                {isSortedByLocation
                  ? "Không tìm thấy rạp gần bạn. Vui lòng thử chọn khu vực khác."
                  : "Không có rạp nào trong khu vực này."}
              </div>
            )}
          </div>
        </div>

        {/* Panel chọn lịch chiếu bên phải */}
        <div className="schedule-selection">
          <div className="date-selector">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`date-card ${selectedDate.getDate() === date.getDate() ? "active" : ""}`}
                onClick={() => handleDateChange(date)}>
                <div className="day">{formatDateLabel(date)}</div>
                <div className="date">{date.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="showtime-panel">
            {selectedCinema && Object.keys(groupedShowtimes).length > 0 ? (
              Object.keys(groupedShowtimes).map((movieId) => {
                const showtimes = groupedShowtimes[movieId];
                return (
                  <div key={movieId} className="showtime-group">
                    <div className="showtime-header">
                      <FontAwesomeIcon icon={faClock} />
                      <h3>Suất chiếu ngày {selectedDate.toLocaleDateString()}</h3>
                    </div>
                    <div className="showtime-grid">
                      {showtimes.map((showtime, idx) => (
                        <button
                          key={idx}
                          className="showtime-btn"
                          onClick={() => handleShowtimeSelect(showtime)}>
                          {new Date(showtime.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="not-found">
                <img src={not_found_showtimes} alt="Not found" />
                <p>Úi, Không tìm thấy suất chiếu.</p>
                <p>Bạn hãy thử tìm ngày khác nhé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer với nút đóng */}
      <div className="booking-flow-close">
        <button onClick={onClose} className="booking-flow-close-btn">
          Huỷ
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;
