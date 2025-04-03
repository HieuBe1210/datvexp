export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

export const processRevenueData = (orders, movies, cinemas, filterType, startDate, endDate) => {
  let totalRevenue = 0;
  let ticketsSold = 0;
  const byTime = {};
  const byMovie = {};
  const byCinema = {};
  const byCustomer = {};

  Object.values(orders).forEach((order) => {
    if (order.status !== "success") return;

    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Nếu có lọc thời gian, chỉ tính đơn hàng trong khoảng thời gian
    if ((start && orderDate < start) || (end && orderDate > end)) return;

    const revenue = order.amount;
    totalRevenue += revenue;
    const seats = order.movieDetails.seat.split(",").length;
    ticketsSold += seats;

    let timeKey;
    if (filterType === "day") {
      timeKey = orderDate.toLocaleDateString();
    } else if (filterType === "month") {
      timeKey = orderDate.toLocaleString("default", { month: "long", year: "numeric" });
    } else if (filterType === "year") {
      timeKey = orderDate.getFullYear().toString();
    }
    byTime[timeKey] = (byTime[timeKey] || 0) + revenue;

    const movieId = order.movieDetails.movie_id;
    byMovie[movieId] = (byMovie[movieId] || 0) + revenue;

    const cinemaId = order.movieDetails.cinema_id;
    byCinema[cinemaId] = (byCinema[cinemaId] || 0) + revenue;

    const customerEmail = order.app_user;
    byCustomer[customerEmail] = (byCustomer[customerEmail] || 0) + revenue;
  });

  const revenueByMovie = Object.entries(byMovie)
    .map(([movieId, revenue]) => ({
      movie: movies[`movie${movieId}`]?.movie_name || "Unknown",
      revenue: formatCurrency(revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const revenueByCinema = Object.entries(byCinema)
    .map(([cinemaId, revenue]) => {
      const cinemaKey = `cinema${cinemaId.split("_")[1]}`;
      return {
        cinema: cinemas[cinemaKey]?.cinema_name || "Unknown",
        revenue: formatCurrency(revenue),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const topCustomers = Object.entries(byCustomer)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([email, revenue]) => ({ email, revenue: formatCurrency(revenue) }));

  return {
    totalRevenue: formatCurrency(totalRevenue),
    ticketsSold,
    revenueByTime: byTime,
    revenueByMovie,
    revenueByCinema,
    topCustomers,
  };
};

export const prepareExcelData = (
  totalRevenue,
  ticketsSold,
  revenueByTime,
  revenueByMovie,
  revenueByCinema,
  topCustomers,
  filterType
) => {
  const data = [];

  // Tổng quan
  data.push(["Tổng quan"]);
  data.push(["Doanh thu tổng (VND)", totalRevenue]);
  data.push(["Tổng số vé đã bán", ticketsSold]);
  data.push([]);

  // Doanh thu theo thời gian
  data.push([
    `Doanh thu theo ${filterType === "day" ? "ngày" : filterType === "month" ? "tháng" : "năm"}`,
  ]);
  data.push(["Thời gian", "Doanh thu (VND)"]);
  Object.entries(revenueByTime).forEach(([time, revenue]) => {
    data.push([time, revenue]);
  });
  data.push([]);

  // Doanh thu theo phim
  data.push(["Doanh thu theo phim"]);
  data.push(["Phim", "Doanh thu (VND)"]);
  revenueByMovie.forEach((item) => {
    data.push([item.movie, item.revenue]);
  });
  data.push([]);

  // Doanh thu theo rạp
  data.push(["Doanh thu theo rạp"]);
  data.push(["Rạp", "Doanh thu (VND)"]);
  revenueByCinema.forEach((item) => {
    data.push([item.cinema, item.revenue]);
  });
  data.push([]);

  // Top khách hàng
  data.push(["Top khách hàng VIP"]);
  data.push(["Email", "Doanh thu (VND)"]);
  topCustomers.forEach((item) => {
    data.push([item.email, item.revenue]);
  });

  return data;
};
