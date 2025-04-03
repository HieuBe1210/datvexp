import { useState, useEffect } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchShowtimes } from "../../../services/service/serviceCinemas";
import { fetchMovies } from "../../../services/service/serviceMovie";
import {
  fetchCinemasWithShowtimesFromFirebase,
  fetchRegionsOfCinemasFromFirebase,
  fetchCinemasByRegionFromFirebase,
} from "../../../services/firebase/firebaseCinemas";
import { toast } from "react-toastify";
import { calculateDistance } from "../../../utils/utilsFunction";

export const useMovieSchedule = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date("2025-03-25"));
  const [dates, setDates] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isSortedByLocation, setIsSortedByLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Tạo danh sách ngày
  useEffect(() => {
    const today = new Date();
    const dateList = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateList.push(date);
    }
    setDates(dateList);
    setSelectedDate(today);
  }, []);

  // Lấy danh sách vùng
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = await fetchRegionsOfCinemasFromFirebase();
        setRegions(regionData);
        if (regionData.length > 0) setSelectedRegion(regionData[0]);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    loadRegions();
  }, []);

  // Lấy danh sách rạp
  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const cinemaData = await fetchCinemasWithShowtimesFromFirebase();
        setCinemas(cinemaData);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    loadCinemas();
  }, []);

  // Lọc rạp theo vùng hoặc vị trí
  useEffect(() => {
    const loadFilteredCinemas = async () => {
      try {
        let filteredCinemasWithShowtimes = [];
        if (isSortedByLocation && userLocation) {
          const nearestCinema = cinemas.reduce((nearest, cinema) => {
            if (!cinema.latitude || !cinema.longitude) return nearest;
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              cinema.latitude,
              cinema.longitude
            );
            return !nearest || distance < nearest.distance ? { cinema, distance } : nearest;
          }, null);

          if (nearestCinema) {
            const nearestRegion = nearestCinema.cinema.city;
            setSelectedRegion(nearestRegion);
            const filteredData = await fetchCinemasByRegionFromFirebase(nearestRegion);
            filteredCinemasWithShowtimes = cinemas
              .filter((cinema) =>
                filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
              )
              .sort(
                (a, b) =>
                  calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    a.latitude,
                    a.longitude
                  ) -
                  calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    b.latitude,
                    b.longitude
                  )
              );
          }
        } else if (selectedRegion) {
          const filteredData = await fetchCinemasByRegionFromFirebase(selectedRegion);
          filteredCinemasWithShowtimes = cinemas
            .filter((cinema) =>
              filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
            )
            .sort((a, b) =>
              userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    a.latitude,
                    a.longitude
                  ) -
                  calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    b.latitude,
                    b.longitude
                  )
                : 0
            );
        } else {
          filteredCinemasWithShowtimes = [...cinemas];
        }

        setFilteredCinemas(filteredCinemasWithShowtimes);
        if (filteredCinemasWithShowtimes.length > 0) {
          setSelectedCinema(filteredCinemasWithShowtimes[0].id);
        }
      } catch (error) {
        console.error("Error filtering cinemas:", error);
      }
    };
    loadFilteredCinemas();
  }, [selectedRegion, cinemas, userLocation, isSortedByLocation]);

  // Lấy danh sách phim
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    loadMovies();
  }, []);

  // Lấy lịch chiếu
  useEffect(() => {
    if (selectedCinema) {
      const loadShowtimes = async () => {
        try {
          const showtimeData = await fetchShowtimes(selectedCinema);
          setShowtimes(showtimeData);
        } catch (error) {
          console.error("Error fetching showtimes:", error);
        }
      };
      loadShowtimes();
    }
  }, [selectedCinema]);

  // Xử lý lấy vị trí người dùng
  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setIsSortedByLocation(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc chọn khu vực thủ công."
          );
          setIsSortedByLocation(false);
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng chọn khu vực thủ công.");
      setIsSortedByLocation(false);
      setIsLoadingLocation(false);
    }
  };

  // Tắt chế độ gần bạn
  const handleDisableNearYou = () => {
    setIsSortedByLocation(false);
    setUserLocation(null);
    if (selectedRegion) {
      const loadFilteredCinemas = async () => {
        const filteredData = await fetchCinemasByRegionFromFirebase(selectedRegion);
        const filteredCinemasWithShowtimes = cinemas.filter((cinema) =>
          filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
        );
        setFilteredCinemas(filteredCinemasWithShowtimes);
        if (filteredCinemasWithShowtimes.length > 0) {
          setSelectedCinema(filteredCinemasWithShowtimes[0].id);
        }
      };
      loadFilteredCinemas();
    }
  };

  // Xử lý thay đổi vùng
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setIsSortedByLocation(false);
  };

  // Xử lý thay đổi rạp
  const handleCinemaChange = (cinemaId) => setSelectedCinema(cinemaId);

  // Xử lý thay đổi ngày
  const handleDateChange = (date) => setSelectedDate(date);

  // Xử lý chọn suất chiếu
  const handleShowtimeClick = (showtime) => {
    const cinema = filteredCinemas.find((c) => c.id === selectedCinema);
    const time = new Date(showtime.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!showtime.movie_id) {
      console.error("Movie ID is undefined for this showtime:", showtime);
      return;
    }
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    navigate(`/booking_seat/${showtime.movie_id}`, {
      state: {
        cinema: cinema.name,
        cinema_id: selectedCinema,
        date: selectedDate.toISOString().split("T")[0],
        time,
        movie_id: showtime.movie_id,
        showtime_id: `showtime_${selectedDate
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "")}_${time.replace(":", "")}_${selectedCinema}_movie${showtime.movie_id}`,
      },
    });
  };

  // Nhóm suất chiếu theo phim
  const groupedShowtimes = useMemo(() => {
    return Object.values(showtimes).reduce((acc, showtime) => {
      const showtimeDate = new Date(showtime.start_time);
      if (
        showtime.cinema_id === selectedCinema &&
        showtimeDate.getDate() === selectedDate.getDate() &&
        showtimeDate.getMonth() === selectedDate.getMonth() &&
        showtimeDate.getFullYear() === selectedDate.getFullYear()
      ) {
        const movieId = showtime.movie_id;
        if (!acc[movieId]) acc[movieId] = [];
        acc[movieId].push(showtime);
      }
      return acc;
    }, {});
  }, [showtimes, selectedCinema, selectedDate]); // Chỉ tính lại khi các dependency này thay đổi

  // Sắp xếp showtimes trong groupedShowtimes
  useEffect(() => {
    Object.keys(groupedShowtimes).forEach((movieId) =>
      groupedShowtimes[movieId].sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    );
  }, [groupedShowtimes]);

  // Lấy thông tin phim theo ID
  const getMovieById = (movieId) => movies.find((movie) => movie.movie_id === movieId) || {};

  // Định dạng nhãn ngày
  const formatDateLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((inputDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";
    return `Thứ ${inputDate.getDay() === 0 ? "CN" : inputDate.getDay() + 1}`;
  };

  return {
    regions,
    selectedRegion,
    filteredCinemas,
    selectedCinema,
    movies,
    showtimes,
    selectedDate,
    dates,
    userLocation,
    isSortedByLocation,
    isLoadingLocation,
    handleGetLocation,
    handleDisableNearYou,
    handleRegionChange,
    handleCinemaChange,
    handleDateChange,
    handleShowtimeClick,
    groupedShowtimes,
    getMovieById,
    formatDateLabel,
  };
};
