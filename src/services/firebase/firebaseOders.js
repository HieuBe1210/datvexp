import { getAuth } from "firebase/auth"; // Lấy module Firebase Authentication
import app from "../firebase/firebaseConfig"; // Import Firebase App đã được khởi tạo
import { getDatabase, ref, get, onValue, update } from "firebase/database"; // Các module để làm việc với Firebase Realtime Database

// Khởi tạo Authentication của Firebase
const auth = getAuth();
const db = getDatabase();

// API LẤY DANH SÁCH ODERS
export const fetchOdersFromFirebase = async (email, filters = {}, page = 1, limit = 15) => {
  const ordersRef = ref(db, `Orders/`);
  try {
    const snapshot = await get(ordersRef);
    let bookings = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (!email || data.app_user === email) {
          bookings.push(data);
        }
      });
    }

    // Áp dụng bộ lọc (nếu có)
    if (filters.theater) {
      bookings = bookings.filter((booking) => booking.movieDetails.theater === filters.theater);
    }
    if (filters.showDate) {
      bookings = bookings.filter((booking) => booking.movieDetails.showDate === filters.showDate);
    }
    if (filters.movieName) {
      bookings = bookings.filter((booking) => booking.movieDetails.movieName === filters.movieName);
    }
    if (filters.status) {
      bookings = bookings.filter((booking) => booking.status === filters.status);
    }

    // Phân trang
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBookings = bookings.slice(start, end);

    return {
      data: paginatedBookings,
      total: bookings.length, // Tổng số giao dịch để hiển thị phân trang
    };
  } catch (error) {
    console.error("Error fetching booking history:", error);
    throw new Error("Failed to fetch booking history");
  }
};

// API HỦY VÉ
export const cancelTicketFromFirebase = async (ticketId) => {
  const ticketRef = ref(db, `Orders/${ticketId}`);
  try {
    await update(ticketRef, { status: "canceled" });
    // Cập nhật trạng thái ghế (nếu cần)
    // const showtimeId = (await get(ticketRef)).val().movieDetails.showtime_id;
    // const seats = (await get(ticketRef)).val().movieDetails.seat.split(", ");
    // seats.forEach((seat) => {
    //   updateSeatStatus(showtimeId, seat, "available");
    // });
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("Error canceling ticket:", error);
    return false; // Trả về false nếu thất bại
  }
};

// API KHÓA VÉ
export const lockTicketFromFirebase = async (ticketId) => {
  const ticketRef = ref(db, `Orders/${ticketId}`);
  try {
    await update(ticketRef, { status: "locked" });
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("Error locking ticket:", error);
    return false; // Trả về false nếu thất bại
  }
};
