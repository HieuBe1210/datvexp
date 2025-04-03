// movieStatsUtils.js
import dayjs from "dayjs";

// Tính toán các số liệu thống kê cơ bản
export const calculateMovieStats = (movies) => {
  // Tổng số phim theo trạng thái
  const statusStats = {
    active: movies.filter((movie) => movie.status === "active").length,
    upcoming: movies.filter((movie) => movie.status === "upcoming").length,
    close: movies.filter((movie) => movie.status === "close").length,
  };

  // Số lượng phim theo thể loại
  const genreStats = movies.reduce((acc, movie) => {
    const genres = movie.genre.split(", ").map((g) => g.trim());
    genres.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  // Số lượng phim theo độ tuổi xem
  const viewingAgeStats = movies.reduce((acc, movie) => {
    const age = movie.viewing_age;
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});

  // Top 5 phim có rating cao nhất
  const topRatedMovies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map((movie) => ({
      movie_name: movie.movie_name,
      rating: movie.rating,
    }));

  // Top 5 phim có số vé bán ra cao nhất
  const topTicketSoldMovies = [...movies]
    .sort((a, b) => (b.total_tickets_sold || 0) - (a.total_tickets_sold || 0))
    .slice(0, 5)
    .map((movie) => ({
      movie_name: movie.movie_name,
      total_tickets_sold: movie.total_tickets_sold || 0,
    }));

  return {
    statusStats,
    genreStats,
    viewingAgeStats,
    topRatedMovies,
    topTicketSoldMovies,
  };
};

// Chuẩn bị dữ liệu cho biểu đồ
export const prepareChartData = (genreStats, statusStats) => {
  const genreChartData = {
    labels: Object.keys(genreStats),
    datasets: [
      {
        label: "Số lượng phim theo thể loại",
        data: Object.values(genreStats),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6F61",
          "#6B5B95",
          "#88B04B",
          "#F7CAC9",
        ],
      },
    ],
  };

  const statusChartData = {
    labels: ["Đang chiếu", "Sắp chiếu", "Đã đóng"],
    datasets: [
      {
        label: "Số lượng phim theo trạng thái",
        data: [statusStats.active, statusStats.upcoming, statusStats.close],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return { genreChartData, statusChartData };
};

// Cấu hình options cho biểu đồ
export const getChartOptions = () => {
  const pieChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} phim`,
        },
      },
    },
  };

  const statusChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} phim`,
        },
      },
    },
  };

  return { pieChartOptions, statusChartOptions };
};

// Hàm lọc phim theo khoảng thời gian
export const filterMoviesByDateRange = (movies, startDate, endDate) => {
  if (!startDate || !endDate) return movies;

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  return movies.filter((movie) => {
    const releaseDate = dayjs(movie.release_date, "DD-MM-YYYY");
    return releaseDate.isAfter(start) && releaseDate.isBefore(end);
  });
};
