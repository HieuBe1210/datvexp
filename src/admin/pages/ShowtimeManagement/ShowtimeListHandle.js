import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Modal } from "antd";

// Xử lý tìm kiếm
export const handleSearchShowtimes = (term, showtimes, setFilteredShowtimes) => {
  setFilteredShowtimes(showtimes);
  if (!term) return;

  const lowerTerm = term.toLowerCase();
  const filtered = showtimes.filter(
    (showtime) =>
      showtime.movieName.toLowerCase().includes(lowerTerm) ||
      showtime.cinemaName.toLowerCase().includes(lowerTerm) ||
      showtime.city.toLowerCase().includes(lowerTerm) ||
      showtime.room.toLowerCase().includes(lowerTerm)
  );
  setFilteredShowtimes(filtered);
};

// Xử lý bộ lọc
export const handleFilterShowtimes = (key, value, setFilters, setCurrentPage) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
  setCurrentPage(1);
};

// Xử lý xóa tất cả bộ lọc
export const handleClearShowtimeFilters = (
  setFilters,
  setSearchTerm,
  showtimes,
  setFilteredShowtimes,
  setCurrentPage
) => {
  setFilters({});
  setSearchTerm("");
  setFilteredShowtimes(showtimes);
  setCurrentPage(1);
};

// Xử lý thay đổi trang
export const handleShowtimePageChange = (page, setCurrentPage) => {
  setCurrentPage(page);
};

// Chuẩn bị dữ liệu lịch chiếu từ các nguồn
export const prepareShowtimeData = (showtimesData, moviesData, cinemasData) => {
  return Object.values(showtimesData).map((showtime) => {
    const movie = Object.values(moviesData).find((m) => m.movie_id === showtime.movie_id);
    const cinema = Object.values(cinemasData).find((c) => c.cinema_id === showtime.cinema_id);

    return {
      ...showtime,
      movieName: movie?.movie_name || "Không xác định",
      cinemaName: cinema?.cinema_name || "Không xác định",
      city: cinema?.city || "Không xác định",
      logo: cinema?.logo || "",
      duration: movie?.duration || 0,
      genre: movie?.genre || "Không xác định",
      startTimeFormatted: dayjs(showtime.start_time).format("DD/MM/YYYY HH:mm"),
      endTimeFormatted: dayjs(showtime.end_time).format("DD/MM/YYYY HH:mm"),
    };
  });
};

// Xử lý xuất báo cáo lịch chiếu
export const handleExportShowtimeReport = (
  filteredShowtimes,
  exportFormat,
  exportDateRange,
  setIsExportModalVisible
) => {
  try {
    let dataToExport = filteredShowtimes;

    // Lọc theo khoảng thời gian nếu có
    if (exportDateRange && Array.isArray(exportDateRange) && exportDateRange.length === 2) {
      const [start, end] = exportDateRange;
      if (start && end) {
        dataToExport = filteredShowtimes.filter((showtime) => {
          const showDate = dayjs(showtime.start_time);
          return showDate.isAfter(start) && showDate.isBefore(end);
        });
      }
    }

    if (dataToExport.length === 0) {
      toast.warning("Không có dữ liệu để xuất báo cáo!");
      setIsExportModalVisible(false);
      return;
    }

    // Chuẩn bị dữ liệu cho báo cáo
    const reportData = dataToExport.map((showtime) => ({
      "Tên phim": showtime.movieName,
      "Rạp chiếu": showtime.cinemaName,
      "Thành phố": showtime.city,
      "Phòng chiếu": showtime.room,
      "Thời gian bắt đầu": showtime.startTimeFormatted,
      "Thời gian kết thúc": showtime.endTimeFormatted,
      "Thể loại": showtime.genre,
      "Thời lượng": `${showtime.duration} phút`,
    }));

    const fileName = `BaoCaoLichChieu_${dayjs().format("YYYYMMDD_HHmmss")}`;

    if (exportFormat === "excel") {
      // Xuất file Excel
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách lịch chiếu");

      // Tùy chỉnh độ rộng cột
      worksheet["!cols"] = [
        { wch: 25 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
      ];

      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else if (exportFormat === "pdf") {
      // Xuất file PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setTextColor(22, 160, 133);
      doc.text("Báo cáo danh sách lịch chiếu", 14, 10);
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`, 14, 18);

      if (exportDateRange && Array.isArray(exportDateRange) && exportDateRange.length === 2) {
        const [start, end] = exportDateRange;
        if (start && end) {
          doc.text(
            `Khoảng thời gian: ${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`,
            14,
            24
          );
        }
      }

      autoTable(doc, {
        head: [
          [
            "Tên phim",
            "Rạp chiếu",
            "Thành phố",
            "Phòng chiếu",
            "Thời gian bắt đầu",
            "Thời gian kết thúc",
            "Thể loại",
            "Thời lượng",
          ],
        ],
        body: reportData.map((row) => Object.values(row)),
        startY:
          exportDateRange && Array.isArray(exportDateRange) && exportDateRange.length === 2
            ? 30
            : 24,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      doc.save(`${fileName}.pdf`);
    }

    setIsExportModalVisible(false);
  } catch (error) {
    console.error("Error exporting report:", error);
    toast.error("Đã có lỗi xảy ra khi xuất báo cáo!");
    setIsExportModalVisible(false);
  }
};
