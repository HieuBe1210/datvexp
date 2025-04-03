import axios from "axios";
import api from "./api";
import { setAuthToken, getAuthToken } from "../../utils/authStorage";
const API_URL = import.meta.env.VITE_API_URL;

// API lấy dữ liệu Movies từ SQL (ĐÃ CHẠY OK)
export const fetchMoviesFromSQL = async () => {
  try {
    const response = await api.get("/movie/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};
