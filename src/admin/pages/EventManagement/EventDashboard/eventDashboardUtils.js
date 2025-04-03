import dayjs from "dayjs";

// Tính toán thống kê sự kiện
export const calculateEventStats = (events) => {
  // Kiểm tra nếu events không phải là mảng hoặc undefined, trả về giá trị mặc định
  if (!Array.isArray(events)) {
    return {
      activeEvents: 0,
      endedEvents: 0,
      upcomingEvents: 0,
      totalViews: 0,
      totalLikes: 0,
      eventsByDate: {},
    };
  }
  const now = dayjs();
  // Sự kiện đang diễn ra: endDate > now
  const activeEvents = events.filter((event) => dayjs(event.endDate).isAfter(now)).length;
  // Sự kiện đã kết thúc: endDate < now
  const endedEvents = events.filter((event) => dayjs(event.endDate).isBefore(now)).length;
  // Sự kiện sắp diễn ra: startDate > now
  const upcomingEvents = events.filter((event) => dayjs(event.startDate).isAfter(now)).length;
  const totalViews = events.reduce((sum, event) => sum + (event.views || 0), 0);
  const totalLikes = events.reduce((sum, event) => sum + (event.likes || 0), 0);

  const eventsByDate = events.reduce((acc, event) => {
    const date = dayjs(event.startDate).format("DD/MM");
    acc[date] = (acc[date] || 0) + (event.views || 0);
    return acc;
  }, {});

  return { activeEvents, endedEvents, totalViews, totalLikes, eventsByDate };
};

// Kiểm tra cảnh báo
export const checkEventAlerts = (events) => {
  const now = dayjs();
  const nearEndEvents = events.filter(
    (event) => dayjs(event.endDate).isBefore(now.add(7, "day")) && dayjs(event.endDate).isAfter(now)
  );
  const lowViewEvents = events.filter(
    (event) => event.views < 1000 && dayjs(event.startDate).isBefore(now.subtract(7, "day"))
  );

  return { nearEndEvents, lowViewEvents };
};

// Chuẩn bị dữ liệu biểu đồ
export const prepareEventChartData = (eventsByDate, events) => {
  const lineChartData = {
    labels: Object.keys(eventsByDate),
    datasets: [
      {
        label: "Lượt xem theo ngày",
        data: Object.values(eventsByDate),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const priorityCounts = events.reduce((acc, event) => {
    acc[event.priority] = (acc[event.priority] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        label: "Số lượng sự kiện",
        data: Object.values(priorityCounts),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return { lineChartData, barChartData };
};

// Cấu hình options cho biểu đồ
export const getEventChartOptions = (events) => {
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Lượt xem sự kiện theo thời gian" },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Số lượng sự kiện theo mức độ ưu tiên" },
    },
  };

  return { lineChartOptions, barChartOptions };
};
