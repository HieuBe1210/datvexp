import dayjs from "dayjs";

// Tính toán các số liệu thống kê
export const calculateTicketStats = (tickets) => {
  // 1. Tổng số vé đã bán (theo ngày, tuần, tháng)
  const ticketsByDay = tickets
    .filter((ticket) => ticket.status === "success")
    .reduce((acc, ticket) => {
      const day = dayjs(ticket.createdAt).format("DD/MM");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

  const totalTicketsWeek = Object.values(ticketsByDay).reduce((sum, count) => sum + count, 0);
  const totalTicketsMonth = totalTicketsWeek; // Giả định chỉ có dữ liệu trong tháng 03

  // 2. Số lượng vé đã sử dụng / chưa sử dụng / đã hủy
  const currentDate = dayjs();
  const usedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "success" &&
      dayjs(`${ticket.movieDetails.showDate}/2025`, "DD/MM/YYYY").isBefore(currentDate)
  ).length;
  const unusedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "success" &&
      dayjs(`${ticket.movieDetails.showDate}/2025`, "DD/MM/YYYY").isAfter(currentDate)
  ).length;
  const canceledTickets = tickets.filter((ticket) => ticket.status === "canceled").length;
  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending").length;

  return {
    ticketsByDay,
    totalTicketsWeek,
    totalTicketsMonth,
    usedTickets,
    unusedTickets,
    canceledTickets,
    pendingTickets,
  };
};

// Tính tỷ lệ lấp đầy ghế
export const calculateFillRate = (tickets) => {
  // Giả định số ghế cho từng phòng
  const roomCapacities = {
    P1: 80, // Phòng P1 có 80 ghế
  };

  const seatsByShowtime = tickets.reduce((acc, ticket) => {
    const showtimeId = ticket.movieDetails.showtime_id;
    const seats = ticket.movieDetails.seat.split(", ").length;
    acc[showtimeId] = (acc[showtimeId] || 0) + seats;
    return acc;
  }, {});

  const fillRateByShowtime = Object.keys(seatsByShowtime).map((showtimeId) => {
    const ticket = tickets.find((t) => t.movieDetails.showtime_id === showtimeId);
    const totalSeats = roomCapacities[ticket?.movieDetails.room] || 100;
    return {
      showtimeId,
      fillRate: (seatsByShowtime[showtimeId] / totalSeats) * 100,
    };
  });

  return fillRateByShowtime;
};

// Kiểm tra cảnh báo
export const checkAlerts = (tickets, fillRateByShowtime) => {
  // Cảnh báo suất chiếu sắp hết chỗ
  const nearFullShowtimes = fillRateByShowtime.filter((item) => item.fillRate > 90);

  // Cảnh báo vé bất thường (ghế bị đặt trùng)
  const unusualTickets = tickets.filter((ticket) => {
    const sameSeatTickets = tickets.filter(
      (t) =>
        t.movieDetails.showtime_id === ticket.movieDetails.showtime_id &&
        t.movieDetails.seat === ticket.movieDetails.seat &&
        t.app_trans_id !== ticket.app_trans_id
    );
    return sameSeatTickets.length > 0;
  });

  return {
    nearFullShowtimes,
    unusualTickets,
  };
};

// Chuẩn bị dữ liệu cho biểu đồ
export const prepareChartData = (ticketsByDay, fillRateByShowtime) => {
  // Biểu đồ số lượng vé đã bán theo thời gian
  const lineChartData = {
    labels: Object.keys(ticketsByDay),
    datasets: [
      {
        label: "Số lượng vé đã bán",
        data: Object.values(ticketsByDay),
        borderColor: "#52c41a",
        backgroundColor: "rgba(82, 196, 26, 0.2)",
        fill: true,
      },
    ],
  };

  // Biểu đồ tỷ lệ lấp đầy ghế
  const barChartData = {
    labels: fillRateByShowtime.map((item) => item.showtimeId),
    datasets: [
      {
        label: "Tỷ lệ lấp đầy ghế (%)",
        data: fillRateByShowtime.map((item) => item.fillRate),
        backgroundColor: "#1890ff",
      },
    ],
  };

  return { lineChartData, barChartData };
};

// Cấu hình options cho biểu đồ
export const getChartOptions = (tickets, fillRateByShowtime) => {
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số lượng vé đã bán theo thời gian",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} vé`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng vé",
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tỷ lệ lấp đầy ghế theo suất chiếu",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Suất chiếu",
        },
        ticks: {
          callback: (value, index) => {
            const showtimeId = fillRateByShowtime[index].showtimeId;
            const ticket = tickets.find((t) => t.movieDetails.showtime_id === showtimeId);
            return ticket
              ? `${ticket.movieDetails.movieName} - ${ticket.movieDetails.showTime} ${ticket.movieDetails.showDate}`
              : showtimeId;
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Tỷ lệ lấp đầy (%)",
        },
      },
    },
  };

  return { lineChartOptions, barChartOptions };
};
