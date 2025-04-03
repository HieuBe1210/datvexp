import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Hàm xuất Excel
export const exportToExcel = (data, fileName) => {
  // Chuẩn bị dữ liệu
  const formattedData = data.map((user) => ({
    ID: user.id,
    Tên: user.fullname || user.displayName,
    Email: user.email,
    "Vai trò": user.role === "admin" ? "Admin" : "User",
    "Trạng thái": getStatusText(user.status),
    "Ngày tạo": user.created_date,
    SĐT: user.phone || "Chưa cập nhật",
  }));

  // Tạo workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Định dạng cột
  const wscols = [
    { wch: 10 }, // ID
    { wch: 25 }, // Tên
    { wch: 30 }, // Email
    { wch: 15 }, // Vai trò
    { wch: 15 }, // Trạng thái
    { wch: 15 }, // Ngày tạo
    { wch: 20 }, // SĐT
  ];
  ws["!cols"] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, "VTI Danh sách người dùng");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Hàm xuất PDF
export const exportToPDF = (data, fileName) => {
  const doc = new jsPDF();

  // Tiêu đề
  doc.setFontSize(18);
  doc.text("VTI DANH SÁCH NGƯỜI DÙNG", 105, 15, { align: "center" });

  // Ngày xuất
  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

  // Bảng dữ liệu
  const tableData = data.map((user) => [
    user.id,
    user.fullname || user.displayName,
    user.email,
    user.role === "admin" ? "Admin" : "User",
    getStatusText(user.status),
    user.created_date,
    user.phone || "Chưa cập nhật",
  ]);

  autoTable(doc, {
    head: [["ID", "Tên", "Email", "Vai trò", "Trạng thái", "Ngày tạo", "SĐT"]],
    body: tableData,
    startY: 30,
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 25 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
    },
  });

  doc.save(`${fileName}.pdf`);
};

// Hàm chuyển đổi status sang text
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "locked":
      return "Đã khóa";
    case "pending":
      return "Chờ xác thực";
    default:
      return status;
  }
};
