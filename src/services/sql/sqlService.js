import axios from "axios";
import api from "./api";
import { setAuthToken, getAuthToken } from "../../utils/authStorage";
const API_URL = import.meta.env.VITE_API_URL;
export const searchFromSQL = {
  searchMovies: async (query) => {
    try {
      // Gọi API từ backend SQL
      const response = await axios.get("/api/movies/search", {
        params: { keyword: query },
      });
      return response.data; // Trả về danh sách kết quả từ backend
    } catch (error) {
      console.error("Error in sqlService:", error);
      return [];
    }
  },
};
// API lấy thông tin Account bằng ID
export const fetchAccountFromSQL = async (account_id) => {
  const response = await api.get(`/api/account/findId/${account_id}`); // endpoint của backend
  return response.data;
};

// API lấy thông tin Account bằng Email
export const fetchAccountByEmailFromSQL = async (email) => {
  const response = await api.get(`${API_URL}/findEmail/${email}`, email); // endpoint của backend
  return response.data;
};

// API đăng nhập với Email/Password (ĐÃ CHẠY OK)
export const loginWithEmailAndPasswordFromSQL = async (email, password) => {
  try {
    // Gửi email đến backend để lấy thông tin user từ SQL
    const response = await axios.post(`${API_URL}/login/email`, {
      email,
      password,
    });
    const { token } = response.data;
    // Lưu token riêng biệt
    if (token) {
      setAuthToken(token);
    } else {
      console.error("Token không tồn tại hoặc undefined!");
    }

    // Lưu toàn bộ thông tin user
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (error.response) {
      // Lấy thông báo lỗi từ server
      const errorMessage = error.response.data?.message;
      console.log(errorMessage); // Hiển thị thông báo lỗi chi tiết
      return { error: errorMessage }; // Trả lỗi để Redux xử lý
    } else {
      alert("Không thể kết nối tới server. Kiểm tra kết nối mạng.");
    }
  }
};
// API lấy dữ liệu MoviesById từ SQL (ĐÃ CHẠY OK)
export const fetchMoviesByIdFromSQL = async (movie_id) => {
  try {
    const response = await api.get(`movie/findId/${movie_id}`); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};
export const fetchShowtimesFromSQL = async (data) => {
  const movie_id = data.movie_id; // Lấy giá trị movie_id từ Object
  console.log("movie_id in fetchShowtimesFromSQL", data);
  console.log("Type of movie_id:", typeof data);
  console.log("movie_id:", data);
  try {
    const response = await api.get(
      `/showTime/findMovieAndShowDate/${movie_id}`
    ); // endpoint của backend
    return response.data; // Trả về danh sách suất chiếu
  } catch (error) {
    console.error("Error fetching showtimes from SQL:", error);
    throw error;
  }
};
// API lấy dữ liệu cho Movies bằng 3 Nút lọc (ĐÃ CHẠY OK)
export const fetchMoviesByTabFromSQL = async (tab) => {
  let endpoint = "/movie";
  switch (tab) {
    case "upcoming":
      endpoint = "/movie/findComingSoon";
      break;
    case "nowShowing":
      endpoint = "/movie/findShowing";
      break;
    case "specialShows":
      endpoint = "/movie/findSpecial";
      break;
    default:
      endpoint = "/movie";
  }

  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${tab} movies from SQL:`, error);
    throw error;
  }
};

// API lấy dữ liệu Carousel từ SQL (ĐÃ CHẠY OK)
export const fetchCarouselDataFromSQL = async () => {
  const response = await api.get("/banner/find"); // endpoint của backend
  return response.data;
};

// API Create Account
export const registerAccountToSQL = async (accountRequest) => {
  try {
    const response = await api.post("/register", {
      fullname: accountRequest.name,
      email: accountRequest.email,
      username: accountRequest.username,
      phone_number: accountRequest.phone,
      birth_date: accountRequest.birthDate,
      gender: accountRequest.gender,
      password: accountRequest.password, // Có thể mã hóa trước khi gửi
    });
    console.log("Lưu dữ liệu vào SQL thành công:", response.data);
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào SQL:", error);
  }
};
// API lấy dữ liệu CINEMAS từ SQL (ĐÃ CHẠY OK)
export const fetchCinemasFromSQL = async () => {
  try {
    const response = await api.get("/cinema/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API Lấy danh sách suất chiếu từ SQL
// cái này theo em thì đầu tiên khi ấn vào Cinema sẽ show ra list phim
export const fetchMovieFormSql = async (cinema_id) => {
  try {
    const response = await api.get(`/cinema/findMovies/${cinema_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie", error);
  }
};
// sau đó khi người dùng ấn vào phim cụ thể sẽ show ra lịch chiếu
// export const fetchShowtimesFromSQL = async (movie_id) => {
//   try {
//     const reponse = api.get(`/showTime/findMovieAndShowDate/${movie_id}`);
//     return reponse.data; // => cái này sẽ trả về lịch chiếu phim trong ngày hôm đó không hiện những ngày khác
//   } catch (error) {
//     console.error("Error fetching showtime by movie", error);
//   }
// };

// sau khi chọn xong phim thì sẽ hiện ra các button là các ghế cụ thể logic em nghĩ sẽ là:
// chọn cinema => chọn phim => chọn giờ chiếu => tìm kiếm xem phòng nào chiếu phim đó giờ đó
// sau đó fetchSeat theo movie với start time tìm ra room rồi kiếm ra seatRoom
const fetchSeatRoomByMovieIdAndStartTime = async (movie_id, start_time) => {
  try {
    return api.get(
      `/showtime/findSeatRoomByMovieAndStartTime/${movie_id}/${start_time}`.data
    );
  } catch (error) {
    console.error("Error fetching SeatRoom by Movie and StartTime" + error);
  }
};
// nãy giờ em chỉnh đang làm 1 trường hợp đối với phim được chiếu trong ngày hôm đó thui nhé

const createTikcet = async (TicketRequest) => {
  try {
  } catch (error) {}
};
// Hàm lấy dữ liệu Seat
export const fetchSeatsFromSQL = async () => {
  const reponse = await api.get("/seat");
  return reponse.data;
};

// API Update Account by Email
export const updateAccountToSQL = async (email, formData) => {
  try {
    const response = await axios.put(`/api/users/${email}`, formData); // endpoint API
    console.log("Cập nhật thông tin thành công:", response.data);
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin SQL:", error);
    throw error;
  }
};

// API Update Password by Email
export const updatePasswordInSQL = async (email, oldPassword, newPassword) => {
  try {
    // Lấy thông tin người dùng từ SQL dựa trên email
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user) {
      throw new Error("Người dùng không tồn tại trong SQL!");
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không chính xác!");
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    return "Mật khẩu đã được thay đổi trong SQL!";
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu trong SQL:", error);
    throw new Error("Lỗi khi đổi mật khẩu trong SQL!");
  }
};
