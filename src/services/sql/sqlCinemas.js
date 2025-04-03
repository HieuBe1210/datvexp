import axios from "axios";
import api from "./api";
import { setAuthToken, getAuthToken } from "../../utils/authStorage";
const API_URL = import.meta.env.VITE_API_URL;

// API LẤY DANH SÁCH TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchCinemasFromSQL = async () => {
  try {
    const response = await api.get("/cinema/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API LẤY DANH SÁCH RẠP PHIM THEO KHU VỰC
export const fetchCinemasByRegionFromSQL = async (region) => {
  try {
    // Gửi request đến endpoint của backend
    const response = await api.get(`/cinema/find-by-region`, {
      params: { region }, // Truyền tham số khu vực vào query params
    });

    // Trả về danh sách rạp từ response
    return response.data; // Đảm bảo backend trả về danh sách rạp ở `response.data`
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp từ SQL:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong component
  }
};

// API LẤY DANH SÁCH KHU VỰC CỦA TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchRegionsOfCinemasFromSQL = async () => {
  try {
    const response = await api.get("/cinema/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API GỬI THÔNG TIN LIÊN HỆ
export const sendContactInfoToSQL = async () => {
  try {
    const response = await api.post("/contact"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching contact from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API THÊM RẠP MỚI
export const addCinemaToSQL = async (cinema) => {
  try {
    const response = await axios.post("/api/cinemas", cinema); // Đường dẫn API SQL
    console.log("Rạp mới đã thêm vào SQL:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm rạp vào SQL:", error);
    throw error;
  }
};
