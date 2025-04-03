import axios from "axios";
import {
  getDatabase,
  ref,
  get,
  equalTo,
  set,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import {
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../services/firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi
const auth = getAuth();

// CHỨC NĂNG SEARCH (ĐÃ CHẠY OK)
export const searchFromFireBase = {
  searchMovies: async (queryText) => {
    const db = getDatabase();
    const movieRef = ref(db, "Movies");
    // Kiểm tra nếu queryText không hợp lệ
    if (!queryText || typeof queryText !== "string") {
      return []; // Trả về mảng rỗng nếu không có từ khóa
    }
    try {
      // Tìm kiếm theo `movie_name`
      const nameQuery = query(
        movieRef,
        orderByChild("movie_name"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );

      // Tìm kiếm theo `actor`
      const actorQuery = query(
        movieRef,
        orderByChild("actor"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );

      // Tìm kiếm theo `genre`
      const genreQuery = query(
        movieRef,
        orderByChild("genre"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
      const snapshot = await get(movieRef); // Lấy toàn bộ dữ liệu từ Firebase
      if (!snapshot.exists()) {
        return []; // Nếu không có dữ liệu, trả về mảng rỗng
      }
      const normalizedQuery = queryText.toLowerCase(); // Chuyển từ khóa tìm kiếm về chữ thường
      const allMovies = Object.values(snapshot.val()); // Chuyển dữ liệu từ Firebase thành mảng
      // Lọc dữ liệu không phân biệt chữ hoa và chữ thường
      const filteredMovies = allMovies.filter((movie) => {
        return (
          movie.movie_name?.toLowerCase().includes(normalizedQuery) ||
          movie.actor?.toLowerCase().includes(normalizedQuery) ||
          movie.genre?.toLowerCase().includes(normalizedQuery)
        );
      });
      return filteredMovies; // Trả về kết quả đã lọc
    } catch (error) {
      console.error("Error in fireBaseService:", error);
      return [];
    }
  },
};

// API ĐỔI MẬT KHẨU TRONG FIREBASE AUTHENTICATION (ĐÃ CHẠY OK)
export const updatePasswordInFirebase = async (email, oldPassword, newPassword) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Bạn cần đăng nhập để đổi mật khẩu.");
  }
  try {
    // Xác thực lại người dùng bằng mật khẩu cũ
    await signInWithEmailAndPassword(auth, email, oldPassword);
    // Cập nhật mật khẩu mới
    await updatePassword(user, newPassword);
    return "Thay đổi mật khẩu thành công!";
  } catch (error) {
    let errorMessage = error.message;
    switch (error.code) {
      case `auth/invalid-credential`:
        errorMessage = "Mật khẩu cũ không chính xác.";
        break;
      case `auth/wrong-password`:
        errorMessage = "Mật khẩu cũ không chính xác.";
        break;
      case `auth/weak-password`:
        errorMessage = "Mật khẩu mới quá yếu.";
        break;
      case `auth/too-many-requests`:
        errorMessage = "Bạn nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau.";
        break;
      case `auth/requires-recent-login`:
        errorMessage = "Vui lòng đăng nhập lại trước khi đổi mật khẩu.";
        break;
    }
    console.log("Lỗi khi đổi mật khẩu: ", errorMessage);
    throw new Error(errorMessage);
  }
};

// LẤY THÔNG TIN ACCOUNT
export const getAccountFromFirebase = async (account_id) => {
  const db = getDatabase();
  const userRef = ref(db, `Account/${account_id}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("User data not found");
  }
};

// HÀM LẤY DỮ LIỆU CHO MOVIES (ĐÃ CHẠY OK)
export const fetchMoviesFromFirebase = async () => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Movies.json");
    return Object.values(response.data); // Chuyển đổi thành array nếu dữ liệu là object
  } catch (error) {
    console.error("Error fetching movies from Firebase:", error);
    throw error; // Throw để các hàm gọi biết lỗi
  }
};

// HÀM LẤY DỮ LIỆU CHO MOVIES BY ID (ĐÃ CHẠY OK)
export const fetchMoviesByIdFromFirebase = async (movie_id) => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Movies.json");

    if (response.data) {
      // Chuyển dữ liệu từ object sang array và lọc theo `movie_id`
      const movies = Object.values(response.data);
      const movie = movies.find((m) => m.movie_id === parseInt(movie_id, 10)); // So khớp `movie_id`
      return movie || null;
    } else {
      console.log("No data found in Firebase.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie by ID from Firebase:", error);
    throw error;
  }
};

// HÀM LẤY DỮ LIỆU CHO CAROUSEL (ĐÃ CHẠY OK)
export const fetchCarouselDataFromFirebase = async () => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Banners.json");
    const data = response.data;
    const bannersArray = Object.keys(data).map((key) => ({
      ...data[key],
      id: key, // Lưu key Firebase làm ID
    }));
    return bannersArray;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// HÀM LẤY TÀI KHOẢN DỰA TRÊN EMAIL (ĐÃ CHẠY OK)
export const getAccountByEmailFromFirebase = async (email) => {
  const db = getDatabase();
  const accountRef = ref(db, "Account");
  const emailQuery = query(accountRef, orderByChild("email"), equalTo(email));

  try {
    const snapshot = await get(emailQuery);
    console.log("emailQuery: ", emailQuery);
    if (!snapshot.exists()) {
      throw new Error("Tài khoản không tồn tại trong hệ thống.");
    }
    // Kiểm tra xem có key hợp lệ hay không
    const uid = Object.keys(snapshot.val())[0]; // Lấy key đầu tiên
    if (!uid) {
      throw new Error("Không thể xác định uid.");
    }
    const accountData = snapshot.val()[uid];
    return { ...accountData, uid }; // Trả về cả dữ liệu và key
  } catch (error) {
    console.error("Lỗi khi lấy tài khoản từ Firebase:", error.message);
    throw error;
  }
};

// HÀM LƯU THÔNG TIN SEATS (ĐÃ CHẠY OK)
export const fetchSeatsFromFirebase = async () => {
  try {
    const reponse = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Seats.json");
    return Object.values(reponse.data);
  } catch (error) {
    console.error("Error fetching seats from Firebase:", error);
  }
};

// HÀM GỌI API ĐỂ LẤY DANH SÁCH RẠP (ĐÃ CHẠY OK)
export const fetchCinemasFromFirebase = async () => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Cinemas.json");
    return response.data; // Trả về dữ liệu danh sách rạp
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    throw error;
  }
};

// API RESET PASSWORD (ĐÃ CHẠY OK)
export const forgotPassword = {
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư!";
    } catch (error) {
      console.error("Lỗi reset mật khẩu:", error);
      throw new Error("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
    }
  },
};

// API UPDATE ACCOUNT (ĐÃ CHẠY OK)
export const updateAccountToFirebase = async (email, formData) => {
  const db = getDatabase();
  try {
    // Lấy thông tin tài khoản dựa trên email
    const accountData = await getAccountByEmailFromFirebase(email);
    // Kiểm tra uid
    const uid = accountData.uid;
    if (!uid) {
      throw new Error("Không thể xác định uid để cập nhật.");
    }
    const userRef = ref(db, `Account/${uid}`);
    // Cập nhật thông tin tài khoản
    await set(userRef, {
      ...accountData, // Giữ dữ liệu cũ
      ...formData, // Ghi đè bằng dữ liệu mới
      updated_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin Firebase:", error.message);
    throw error;
  }
};
