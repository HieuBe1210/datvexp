import { getAuth } from "firebase/auth"; // Lấy module Firebase Authentication
import app from "../firebase/firebaseConfig"; // Import Firebase App đã được khởi tạo
import { getDatabase, ref, get, onValue, update } from "firebase/database"; // Các module để làm việc với Firebase Realtime Database

// Khởi tạo Authentication của Firebase
const auth = getAuth();
const db = getDatabase();
/**
 * HÀM LẤY LỊCH SỬ ĐẶT CHỖ TỪ FIREBASE
 * @param {string} email - Địa chỉ email của người dùng để tìm kiếm lịch sử
 * @returns {Promise<Array>} - Trả về danh sách các booking (mảng)
 */
export const fetchBookingHistoryFromFirebase = async (email) => {
  const ordersRef = ref(db, `Orders/`); // Tạo tham chiếu đến nhánh `orders` trong database

  try {
    // Lấy toàn bộ dữ liệu từ nhánh `orders`
    const snapshot = await get(ordersRef);
    let bookings = []; // Mảng để lưu trữ các booking liên quan đến người dùng

    // Kiểm tra nếu nhánh `orders` tồn tại trong database
    if (snapshot.exists()) {
      // Duyệt qua từng child (đơn đặt chỗ) trong `orders`
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val(); // Lấy dữ liệu từng child
        if (data.app_user === email) {
          // Kiểm tra nếu email trùng khớp với người dùng
          bookings.push(data); // Thêm đơn đặt chỗ vào mảng
        }
      });
    }

    return bookings; // Trả về danh sách các booking
  } catch (error) {
    // Xử lý lỗi nếu có trong quá trình lấy dữ liệu
    console.error("Error fetching booking history:", error);
    throw new Error("Failed to fetch booking history"); // Ném lỗi để bên gọi xử lý
  }
};

/**
 * LẮNG NGHE TRẠNG THÁI GHẾ THEO THỜI GIAN THỰC TỪ FIREBASE
 * @param {string} showtimeId - ID của suất chiếu
 * @param {function} callback - Hàm callback để cập nhật state trong React
 * @returns {function} - Hàm hủy đăng ký listener
 */
export const listenToSeats = (showtimeId, callback) => {
  if (!showtimeId) return () => {};

  const seatRef = ref(db, `showtimes/${showtimeId}/seats`);

  const unsubscribe = onValue(seatRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val()); // Cập nhật state trong React
    }
  });

  return () => unsubscribe(); // Hủy đăng ký listener khi component unmount
};

/**
 * Cập nhật trạng thái ghế trong Firebase
 * @param {string} showtimeId - ID của suất chiếu
 * @param {string} seatId - ID của ghế
 * @param {string} newStatus - Trạng thái mới của ghế ("available", "reserved", "booked")
 */
export const updateSeatStatus = (showtimeId, seatId, newStatus) => {
  if (!showtimeId || !seatId) return;

  const seatRef = ref(db, `showtimes/${showtimeId}/seats/${seatId}`);
  update(seatRef, { status: newStatus });
};
