import dayjs from "dayjs";

// Tạo ánh xạ movie_id -> movieName từ orders hoặc movies
const createMovieNameMapping = (orders, movies = []) => {
  const movieNameMap = {};

  // Ưu tiên lấy từ movies nếu có
  movies.forEach((movie) => {
    if (movie.movie_id && movie.movie_name) {
      movieNameMap[movie.movie_id] = movie.movie_name;
    }
  });

  // Nếu không có movies, lấy từ orders
  Object.values(orders).forEach((order) => {
    const movieId = order.movieDetails?.movie_id;
    const movieName = order.movieDetails?.movieName;
    if (movieId && movieName && !movieNameMap[movieId]) {
      movieNameMap[movieId] = movieName;
    }
  });

  return movieNameMap;
};

// Tính toán các số liệu thống kê
export const calculateCinemaStats = (cinemas, orders = [], showtimes = [], movies = []) => {
  // Log để kiểm tra dữ liệu đầu vào
  console.log("Dữ liệu cinemas:", cinemas);
  console.log("Dữ liệu orders:", orders);
  console.log("Dữ liệu showtimes:", showtimes);
  console.log("Dữ liệu movies:", movies);

  // Tổng số rạp
  const totalCinemas = Object.keys(cinemas).length;

  // Số lượng rạp theo thành phố
  const cityStats = Object.values(cinemas).reduce((acc, cinema) => {
    const city = cinema.city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Số lượng rạp theo hệ thống
  const systemStats = Object.values(cinemas).reduce((acc, cinema) => {
    let system = "Other";
    if (cinema.cinema_name.includes("CGV")) system = "CGV";
    else if (cinema.cinema_name.includes("Lotte")) system = "Lotte";
    else if (cinema.cinema_name.includes("Galaxy")) system = "Galaxy";
    else if (cinema.cinema_name.includes("VTI")) system = "VTI";
    acc[system] = (acc[system] || 0) + 1;
    return acc;
  }, {});

  // Top 5 rạp có số vé bán ra cao nhất
  const topTicketSoldCinemas = Object.values(cinemas)
    .map((cinema) => {
      const cinemaOrders = orders.filter((order) => {
        const isMatch =
          order.movieDetails?.cinema_id === cinema.cinema_id && order.status === "success";
        // Log để kiểm tra từng order
        if (isMatch) {
          console.log(`Order khớp với rạp ${cinema.cinema_name}:`, order);
        }
        return isMatch;
      });

      const totalTickets = cinemaOrders.reduce((sum, order) => {
        const seats = order.movieDetails?.seat?.split(", ") || [];
        return sum + seats.length;
      }, 0);

      return {
        cinema_name: cinema.cinema_name,
        total_tickets_sold: totalTickets || 0,
      };
    })
    .sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)
    .slice(0, 5);

  // Log kết quả trung gian
  console.log("Top 5 rạp có số vé bán ra cao nhất (trước khi sắp xếp):", topTicketSoldCinemas);

  // Top 5 rạp có doanh thu cao nhất
  const topRevenueCinemas = Object.values(cinemas)
    .map((cinema) => {
      const cinemaOrders = orders.filter((order) => {
        const isMatch =
          order.movieDetails?.cinema_id === cinema.cinema_id && order.status === "success"; // Sửa ở đây
        console.log("orders: ", orders);
        return isMatch;
      });

      console.log("cinemaOrders: ", cinemaOrders);
      const totalRevenue = cinemaOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

      return {
        cinema_name: cinema.cinema_name,
        total_revenue: totalRevenue || 0,
      };
    })
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5);

  // Log kết quả trung gian
  console.log("Top 5 rạp có doanh thu cao nhất (trước khi sắp xếp):", topRevenueCinemas);

  // Top 5 rạp có nhiều lịch chiếu nhất
  const topShowtimeCinemas = Object.values(cinemas)
    .map((cinema) => {
      const totalShowtimes = showtimes.filter(
        (showtime) => showtime.cinema_id === cinema.cinema_id
      ).length;
      return {
        cinema_name: cinema.cinema_name,
        total_showtimes: totalShowtimes || 0,
      };
    })
    .sort((a, b) => b.total_showtimes - a.total_showtimes)
    .slice(0, 5);

  // Tạo ánh xạ movie_id -> movieName
  const movieNameMap = createMovieNameMapping(orders, movies);

  // Top 5 phim được chiếu nhiều nhất tại mỗi rạp
  const topMoviesByCinema = [];
  Object.values(cinemas).forEach((cinema) => {
    const cinemaShowtimes = showtimes.filter((showtime) => showtime.cinema_id === cinema.cinema_id);

    // Đếm số lịch chiếu của từng phim
    const movieCount = cinemaShowtimes.reduce((acc, showtime) => {
      const movieId = showtime.movie_id;
      acc[movieId] = (acc[movieId] || 0) + 1;
      return acc;
    }, {});

    // Lấy 1 phim
    const topMovies = Object.entries(movieCount)
      .map(([movieId, count]) => {
        return {
          cinema_name: cinema.cinema_name,
          movie_name: movieNameMap[movieId] || `Unknown (Movie ID: ${movieId})`,
          total_showtimes: count,
        };
      })
      .sort((a, b) => b.total_showtimes - a.total_showtimes)
      .slice(0, 1);

    topMoviesByCinema.push(...topMovies);
  });

  return {
    totalCinemas,
    cityStats,
    systemStats,
    topTicketSoldCinemas,
    topRevenueCinemas,
    topShowtimeCinemas,
    topMoviesByCinema,
  };
};

// Chuẩn bị dữ liệu cho biểu đồ
export const prepareChartData = (cityStats, systemStats) => {
  const cityChartData = {
    labels: Object.keys(cityStats),
    datasets: [
      {
        label: "Số lượng rạp theo thành phố",
        data: Object.values(cityStats),
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
          "#C71585",
          "#20B2AA",
        ],
      },
    ],
  };

  const systemChartData = {
    labels: Object.keys(systemStats),
    datasets: [
      {
        label: "Số lượng rạp theo hệ thống",
        data: Object.values(systemStats),
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  return { cityChartData, systemChartData };
};

// Cấu hình options cho biểu đồ
export const getChartOptions = () => {
  const cityChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} rạp`,
        },
      },
    },
  };

  const systemChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} rạp`,
        },
      },
    },
  };

  return { cityChartOptions, systemChartOptions };
};

// Hàm lọc orders và showtimes theo khoảng thời gian
export const filterByDateRange = (items, startDate, endDate, dateField) => {
  if (!startDate || !endDate) return items;

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const filteredItems = items.filter((item) => {
    const itemDate = dayjs(item[dateField]);
    const isWithinRange = itemDate.isAfter(start) && itemDate.isBefore(end);
    // Log để kiểm tra từng item
    console.log(
      `Item: ${item.app_trans_id || item.showtime_id}, Date: ${itemDate}, Within Range: ${isWithinRange}`
    );
    return isWithinRange;
  });

  return filteredItems;
};
