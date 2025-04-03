import { useState, useEffect } from "react";
import { fetchMovies, deleteMovie } from "../../../services/service/serviceMovie";

const useMovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openRowId, setOpenRowId] = useState(null);
  const itemsPerPage = 7;

  // Lấy danh sách phim
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        setSortedMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getMovies();
  }, []);

  // Cập nhật tổng số trang
  useEffect(() => {
    setTotalPages(Math.ceil(sortedMovies.length / itemsPerPage));
  }, [sortedMovies]);

  // Xử lý mở/đóng dòng chi tiết
  const handleRowToggle = (id) => {
    setOpenRowId((prevId) => (prevId === id ? null : id));
  };

  // Xử lý tìm kiếm
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase().trim();
    const filtered = movies.filter((movie) => {
      const { movie_name, actor, genre, duration, release_date, rating } = movie;
      if (
        movie_name.toLowerCase().includes(lowerCaseQuery) ||
        actor.toLowerCase().includes(lowerCaseQuery) ||
        genre.toLowerCase().includes(lowerCaseQuery)
      ) {
        return true;
      }
      if (!isNaN(lowerCaseQuery)) {
        const numberQuery = parseFloat(lowerCaseQuery);
        return duration >= numberQuery || rating >= numberQuery;
      }
      if (release_date && release_date.includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });
    setFilteredMovies(filtered);
    applySort(filtered, sortKey);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (key) => {
    setSortKey(key);
    applySort(filteredMovies, key);
  };

  const applySort = (moviesList, key) => {
    const sorted = [...moviesList].sort((a, b) => {
      if (key === "id") return a.movie_id - b.movie_id;
      if (key === "movie_name" || key === "actor" || key === "genre") {
        return a[key]?.localeCompare(b[key]);
      }
      if (key === "release_date") return new Date(b[key]) - new Date(a[key]);
      if (key === "rating" || key === "duration") return b[key] - a[key];
      return 0;
    });
    setSortedMovies(sorted);
  };

  // THÊM PHIM MỚI
  const handleAddMovie = (newMovie) => {
    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    applySort(updatedMovies, sortKey);
  };

  // PHÂN TRANG
  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CHỈNH SỬA PHIM
  const handleUpdateMovie = (updatedMovie) => {
    const updatedMovies = movies.map((movie) =>
      movie.movie_id === updatedMovie.movie_id ? updatedMovie : movie
    );
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    applySort(updatedMovies, sortKey);
  };

  // XÓA PHIM
  const handleDeleteMovie = async (movieId) => {
    try {
      const success = await deleteMovie(movieId);
      if (success) {
        const updatedMovies = movies.filter((movie) => movie.movie_id !== movieId);
        setMovies(updatedMovies);
        setFilteredMovies(updatedMovies);
        applySort(updatedMovies, sortKey);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting movie:", error);
      return false;
    }
  };

  return {
    movies,
    sortedMovies,
    paginatedMovies,
    currentPage,
    totalPages,
    openRowId,
    sortKey,
    setCurrentPage,
    handleRowToggle,
    handleSearch,
    handleSort,
    handleAddMovie,
    handleUpdateMovie,
    handleDeleteMovie,
  };
};

export default useMovieManagement;
