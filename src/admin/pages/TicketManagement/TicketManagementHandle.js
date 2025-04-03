import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { fetchOders, cancelTicket, lockTicket } from "../../../services/service/serviceOdres";
import { Modal } from "antd";

// Xử lý tìm kiếm
export const handleSearch = (term, tickets, setFilteredTickets) => {
  setFilteredTickets(tickets);
  if (!term) return;

  const lowerTerm = term.toLowerCase();
  const filtered = tickets.filter(
    (ticket) =>
      ticket.app_trans_id.toLowerCase().includes(lowerTerm) ||
      ticket.app_user.toLowerCase().includes(lowerTerm) ||
      ticket.movieDetails.movieName.toLowerCase().includes(lowerTerm)
  );
  setFilteredTickets(filtered);
};

// Xử lý bộ lọc
export const handleFilter = (key, value, setFilters, setCurrentPage) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
  setCurrentPage(1);
};

// Xử lý xóa tất cả bộ lọc
export const handleClearFilters = (
  setFilters,
  setSearchTerm,
  tickets,
  setFilteredTickets,
  setCurrentPage
) => {
  setFilters({});
  setSearchTerm("");
  setFilteredTickets(tickets);
  setCurrentPage(1);
};

// Xử lý thay đổi trang
export const handlePageChange = (page, setCurrentPage) => {
  setCurrentPage(page);
};

// Lấy danh sách vé
export const fetchTickets = async (
  filters,
  currentPage,
  setTickets,
  setFilteredTickets,
  setTotal,
  setLoading
) => {
  setLoading(true);
  try {
    const response = await fetchOders("", filters, currentPage, 15);
    setTickets(response.data);
    setFilteredTickets(response.data);
    setTotal(response.total);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    toast.error("Không thể tải danh sách vé!");
  } finally {
    setLoading(false);
  }
};

// Xử lý hủy vé
export const cancelTicketHandler = async (
  ticketId,
  filters,
  currentPage,
  setTickets,
  setFilteredTickets,
  setTotal,
  setIsModalVisible
) => {
  Modal.confirm({
    title: "Xác nhận hủy vé",
    content: "Bạn có chắc chắn muốn hủy vé này không?",
    onOk: async () => {
      try {
        const success = await cancelTicket(ticketId);
        if (success) {
          const response = await fetchOders("", filters, currentPage, 15);
          setTickets(response.data);
          setFilteredTickets(response.data);
          setTotal(response.total);
          setIsModalVisible(false);
          toast.success("Hủy vé thành công!");
        } else {
          toast.error("Không thể hủy vé!");
        }
      } catch (error) {
        console.error("Failed to cancel ticket:", error);
        if (error.message.includes("PERMISSION_DENIED")) {
          toast.error("Bạn không có quyền hủy vé này!");
        } else {
          toast.error("Đã có lỗi xảy ra khi hủy vé!");
        }
      }
    },
  });
};

// Xử lý khóa vé
export const lockTicketHandler = async (
  ticketId,
  filters,
  currentPage,
  setTickets,
  setFilteredTickets,
  setTotal,
  setIsModalVisible
) => {
  Modal.confirm({
    title: "Xác nhận khóa vé",
    content: "Bạn có chắc chắn muốn khóa vé này không?",
    onOk: async () => {
      try {
        const success = await lockTicket(ticketId);
        if (success) {
          const response = await fetchOders("", filters, currentPage, 15);
          setTickets(response.data);
          setFilteredTickets(response.data);
          setTotal(response.total);
          setIsModalVisible(false);
          toast.success("Khóa vé thành công!");
        } else {
          toast.error("Không thể khóa vé!");
        }
      } catch (error) {
        console.error("Failed to lock ticket:", error);
        if (error.message.includes("PERMISSION_DENIED")) {
          toast.error("Bạn không có quyền khóa vé này!");
        } else {
          toast.error("Đã có lỗi xảy ra khi khóa vé!");
        }
      }
    },
  });
};

// Xử lý xuất báo cáo
export const handleExportReport = (
  filteredTickets,
  exportFormat,
  exportDateRange,
  setIsExportModalVisible
) => {
  try {
    let dataToExport = filteredTickets;

    // Kiểm tra exportDateRange có hợp lệ không
    if (exportDateRange && Array.isArray(exportDateRange) && exportDateRange.length === 2) {
      const [start, end] = exportDateRange;
      if (start && end) {
        dataToExport = filteredTickets.filter((ticket) => {
          const transactionDate = dayjs(ticket.transactionTime);
          return transactionDate.isAfter(start) && transactionDate.isBefore(end);
        });
      }
    }

    if (dataToExport.length === 0) {
      toast.warning("Không có dữ liệu để xuất báo cáo!");
      setIsExportModalVisible(false);
      return;
    }

    // Chuẩn bị dữ liệu cho báo cáo
    const reportData = dataToExport.map((ticket) => ({
      "Mã vé": ticket.app_trans_id,
      "Tên phim": ticket.movieDetails.movieName,
      "Trạng thái": ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
      "Chi nhánh": ticket.movieDetails.theater,
      "Khách hàng": ticket.app_user,
      "Suất chiếu": `${ticket.movieDetails.showTime}, ${ticket.movieDetails.showDate}`,
      Ghế: ticket.movieDetails.seat,
      Giá: ticket.amount.toLocaleString() + " VNĐ",
      "Thời gian giao dịch": ticket.transactionTime,
    }));

    const fileName = `BaoCaoVe_${dayjs().format("YYYYMMDD_HHmmss")}`;

    if (exportFormat === "excel") {
      // Xuất file Excel
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách vé");

      // Tùy chỉnh độ rộng cột
      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 10 },
        { wch: 15 },
        { wch: 20 },
      ];

      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      //   toast.success("Xuất báo cáo Excel thành công!");
    } else if (exportFormat === "pdf") {
      // Xuất file PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setTextColor(22, 160, 133);
      doc.text("Báo cáo danh sách vé", 14, 10);
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
            "Mã vé",
            "Tên phim",
            "Trạng thái",
            "Chi nhánh",
            "Khách hàng",
            "Suất chiếu",
            "Ghế",
            "Giá",
            "Thời gian giao dịch",
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
      //   toast.success("Xuất báo cáo PDF thành công!");
    }

    setIsExportModalVisible(false);
  } catch (error) {
    console.error("Error exporting report:", error);
    toast.error("Đã có lỗi xảy ra khi xuất báo cáo!");
    setIsExportModalVisible(false);
  }
};
