import axios from "axios";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
  runTransaction,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { setAuthToken } from "../../utils/authStorage";
import app from "../firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi

const db = getDatabase();
const auth = getAuth();
// API LẤY DANH SÁCH PHIM (ĐÃ CHẠY OK)
export const fetchMoviesFromFirebase = async () => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Movies.json");
    return Object.values(response.data); // Chuyển đổi thành array nếu dữ liệu là object
  } catch (error) {
    console.error("Error fetching movies from Firebase:", error);
    throw error; // Throw để các hàm gọi biết lỗi
  }
};

// API LẤY DANH SÁCH PHIM THEO ID (ĐÃ CHẠY OK)
export const fetchMoviesByIdFromFirebase = async (movie_id) => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Movies.json");

    if (response.status === 200 && response.data) {
      const entries = Object.entries(response.data);
      const [key, movie] = entries.find(([_, m]) => String(m.movie_id) === String(movie_id)) || [];

      if (key && movie) {
        // console.log(`Lấy dữ liệu phim thành công (Key: ${key})`, movie);
        return { ...movie, key };
      } else {
        console.warn(`Không tìm thấy movie_id = ${movie_id} trong Firebase.`);
        return null;
      }
    } else {
      console.warn("Không tìm thấy dữ liệu trong Firebase.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phim từ Firebase:", error);
    throw error;
  }
};

// HÀM LẤY DỮ LIỆU CHO MOVIES BẰNG TAB (ĐÃ CHẠY OK)
export const fetchMoviesByTabFromFirebase = async (tab) => {
  try {
    // Khởi tạo kết nối tới Firebase Realtime Database
    const db = getDatabase();
    const moviesRef = ref(db, "Movies");

    // Lấy toàn bộ dữ liệu từ Firebase
    const snapshot = await get(moviesRef);

    // Kiểm tra xem dữ liệu có tồn tại không
    if (!snapshot.exists()) {
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    }

    const movies = Object.values(snapshot.val()); // Chuyển dữ liệu từ object sang array
    // Lọc dữ liệu dựa trên tab
    let filteredMovies = [];
    if (tab === "upcoming") {
      // Phim sắp chiếu: status === "upcoming"
      filteredMovies = movies.filter((movie) => movie.status === "upcoming");
    } else if (tab === "nowShowing") {
      // Phim đang chiếu: status === "active"
      filteredMovies = movies.filter((movie) => movie.status === "active");
    } else if (tab === "specialShows") {
      // Suất chiếu đặc biệt: is_special_show === true
      filteredMovies = movies.filter((movie) => movie.is_special_show);
    } else if (tab === "all") {
      // Tất cả các phim: trả về toàn bộ danh sách
      filteredMovies = movies;
    } else if (tab === "close") {
      // Phim đã đóng: status === "close"
      filteredMovies = movies.filter((movie) => movie.status === "close");
    }
    return filteredMovies;
  } catch (error) {
    console.error(`Error fetching ${tab} movies from Firebase:`, error);
    throw error;
  }
};

// API LẤY DANH SÁCH COMMENT (ĐÃ CHẠY OK)
export const getcommentsFromFirebase = async () => {
  const commentsRef = ref(getDatabase(), "Comments");
  const snapshot = await get(commentsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

// API LẤY DNH SÁCH SUBCOMMENT (ĐÃ CHẠY OK)
export const getSubcommentsFromFirebase = async (commentId) => {
  try {
    const db = getDatabase();
    const subcommentsRef = ref(db, `Comments/${commentId}/subcomments`);
    const snapshot = await get(subcommentsRef);

    if (snapshot.exists()) {
      return Object.values(snapshot.val()); // Trả về danh sách subcomments
    }
    return []; // Nếu không có subcomments, trả về mảng rỗng
  } catch (error) {
    console.error("Lỗi khi lấy subcomments:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// API THÊM SUBCOMMENT (ĐÃ CHẠY OK)
export const pushSubcommentToFirebase = async (commentId, newSubcommentData) => {
  try {
    const db = getDatabase();
    const subcommentsRef = ref(db, `Comments/${commentId}/subcomments`);
    const newSubcommentRef = push(subcommentsRef);
    await set(newSubcommentRef, newSubcommentData);
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("Lỗi khi thêm subcomment:", error);
    return false; // Trả về false nếu thất bại
  }
};

// API CẬP NHẬT COMMENTCOUNT (ĐÃ CHẠY OK)
export const updateCommentsCountInFirebase = async (commentId, increment = 1) => {
  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);
    const snapshot = await get(commentRef);

    if (snapshot.exists()) {
      const currentCount = snapshot.val().commentsCount || 0;
      await update(commentRef, { commentsCount: currentCount + increment });
      return true;
    } else {
      console.warn(`Comment với ID ${commentId} không tồn tại!`);
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật commentsCount:", error);
    return false;
  }
};

// API CHỈNH SỬA SUBCOMMENT (ĐÃ CHẠY OK)
export const updateSubcommentInFirebase = async (commentId, subcommentId, newText) => {
  if (!commentId || !subcommentId || !newText.trim()) {
    console.error("Lỗi: Dữ liệu cập nhật không hợp lệ.");
    return false;
  }
  try {
    const db = getDatabase();
    const subcommentRef = ref(db, `Comments/${commentId}/subcomments/${subcommentId}`);
    await update(subcommentRef, { subcontent: newText });
    console.log("Subcomment đã được cập nhật:", subcommentId);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật subcomment trong Firebase:", error);
    return false;
  }
};

// API XOÁ BÌNH LUẬN (ĐÃ CHẠY OK)
export const deleteCommentFromFirebase = async (commentId) => {
  if (!commentId) return false;

  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);
    // console.log("Xoá bình luận từ Firebase - ID:", commentId);
    const snapshot = await get(commentRef);
    if (!snapshot.exists()) {
      console.warn("Bình luận không tồn tại:", commentId);
      return false;
    }

    // Kiểm tra và xóa subcomments trước nếu có
    const commentData = snapshot.val();
    if (commentData.subcomments) {
      const subcommentRef = ref(db, `Comments/${commentId}/subcomments`);
      await remove(subcommentRef);
    }

    // Xóa bình luận chính
    await remove(commentRef);
    console.log("Đã xoá bình luận:", commentId);
    return true;
  } catch (error) {
    console.error("Lỗi khi xoá bình luận từ Firebase:", error);
    return false;
  }
};

// API XOÁ SUBCOMMENT (ĐÃ CHẠY OK)
export const deleteSubcommentInFirebase = async (commentId, subcommentId) => {
  if (!commentId || !subcommentId) return false;

  try {
    const db = getDatabase();
    const subcommentRef = ref(db, `Comments/${commentId}/subcomments/${subcommentId}`);
    await remove(subcommentRef);
    return true;
  } catch (error) {
    console.error("Lỗi khi xoá subcomment từ Firebase:", error);
    return false;
  }
};

// HÀM CẬP NHẬT SỐ LƯỢNG SUBCOMMENT CỦA COMMENT CHA (ĐÃ CHẠY OK)
export const updateCommentCountInFirebase = async (commentId, change) => {
  if (!commentId) return false;

  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}/commentsCount`);

    // Sử dụng transaction để đảm bảo chính xác và không bị trừ nhiều lần
    const result = await runTransaction(commentRef, (currentCount) => {
      if (currentCount === null || currentCount === undefined) return 0;
      return Math.max(0, currentCount + change);
    });

    if (result.committed) {
      console.log(`Cập nhật commentsCount: ${result.snapshot.val()}`);
    }

    return result.committed;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng bình luận:", error);
    return false;
  }
};

// API THÊM COMMENT (ĐÃ CHẠY OK)
export const addCommentToFirebase = async (commentData) => {
  try {
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");
    const newCommentRef = push(commentsRef);
    await set(newCommentRef, commentData);
    // console.log("Bình luận đã được thêm:", newCommentRef.key);
    return newCommentRef.key; // Trả về ID của bình luận mới
  } catch (error) {
    console.error("Lỗi khi thêm bình luận vào Firebase:", error);
    return null;
  }
};

// API CẬP NHẬT TỔNG SỐ BÌNH LUẬN VÀ ĐÁNH GIÁ CỦA PHIM (ĐÃ CHẠY OK)
export const updateMovieRatingInFirebase = async (movieId, ratingDelta, isAdding = true) => {
  if (!movieId) {
    console.error("Lỗi: `movieId` không được truyền vào updateMovieRating!");
    return false;
  }

  try {
    const db = getDatabase();
    const moviesRef = ref(db, "Movies");
    const snapshot = await get(moviesRef);

    if (!snapshot.exists()) {
      console.error("Không tìm thấy danh sách Movies trong Firebase!");
      return false;
    }

    const movies = snapshot.val();

    // Tìm phim theo `movie_id`
    const movieKey = Object.keys(movies).find((key) => movies[key].movie_id === movieId);

    if (!movieKey) {
      console.error(`Lỗi: Không tìm thấy phim với movie_id = ${movieId} trong Firebase!`);
      return false;
    }
    const movieRef = ref(db, `Movies/${movieKey}`);
    const movieData = movies[movieKey];

    // Tính tổng số bình luận mới dựa trên `totalReviews`
    const newTotalReviews = Math.max(
      0,
      isAdding ? (movieData.totalReviews || 0) + 1 : (movieData.totalReviews || 0) - 1
    );

    // Tính tổng điểm đánh giá mới
    const newTotalRatings = Math.max(
      0,
      isAdding
        ? (movieData.totalRatings || 0) + ratingDelta
        : (movieData.totalRatings || 0) - ratingDelta
    );

    // Tính điểm trung bình mới
    const newAverageRating =
      newTotalReviews === 0 ? 0 : parseFloat((newTotalRatings / newTotalReviews).toFixed(1));

    // Cập nhật Firebase
    await update(movieRef, {
      totalReviews: newTotalReviews, // Cập nhật số lượng bình luận
      totalRatings: newTotalRatings,
      rating: newAverageRating,
    });

    console.log(
      `Đã cập nhật phim ${movieId}: totalReviews = ${newTotalReviews}, totalRatings = ${newTotalRatings}, rating = ${newAverageRating}`
    );
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng đánh giá phim:", error);
    return false;
  }
};

// API CHỈNH SỬA COMMENT  (ĐÃ CHẠY OK)
export const updateCommentInFirebase = async (commentId, updatedData) => {
  if (!commentId || !updatedData) {
    console.error("Lỗi: Thiếu dữ liệu để cập nhật bình luận!");
    return false;
  }

  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);
    const snapshot = await get(commentRef);

    if (!snapshot.exists()) {
      console.error("Lỗi: Không tìm thấy bình luận để cập nhật!");
      return false;
    }

    // Chỉ cập nhật nội dung và ảnh, không động đến rating
    await update(commentRef, updatedData);

    console.log(`Bình luận ${commentId} đã được cập nhật thành công!`);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận:", error);
    return false;
  }
};

// HÀM KIỂM TRA XEM NGƯỜI DÙNG CÓ BÌNH LUẬN HAY CHƯA
export const checkUserHasCommentedInFirebase = async (movieId, userEmail) => {
  if (!movieId || !userEmail) return false;

  try {
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("email_movieId"),
      equalTo(`${userEmail}_${movieId}`)
    );

    const snapshot = await get(commentsQuery);
    if (snapshot.exists()) {
      console.log(`Người dùng ${userEmail} đã bình luận cho phim ${movieId}`);
      return true; // Người dùng đã có bình luận
    }
    return false; // Người dùng chưa bình luận
  } catch (error) {
    console.error("Lỗi khi kiểm tra bình luận người dùng:", error);
    return false;
  }
};

// HÀM KIỂM TRA XEM NGƯỜI DÙNG ĐÃ MUA VÉ CHƯA
export const checkUserPurchaseInFirebase = async (email, movieId) => {
  const db = getDatabase();
  const ordersRef = ref(db, "Orders");

  try {
    const ordersQuery = query(ordersRef, orderByChild("app_user"), equalTo(email));
    const snapshot = await get(ordersQuery);

    if (snapshot.exists()) {
      const orders = Object.values(snapshot.val());
      return orders.some(
        (order) => order.movieDetails?.movie_id === movieId && order.status === "success"
      );
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra vé đã mua:", error);
  }

  return false;
};

// HÀM THÊM PHIM MỚI (TẠO KEY VÀ MOVIE_ID TĂNG DẦN)
export const addMovieToFirebase = async (movieData) => {
  try {
    const moviesRef = ref(db, "Movies");
    const snapshot = await get(moviesRef);

    let newKeyNumber = 1; // Mặc định bắt đầu từ 1 nếu không có phim nào

    if (snapshot.exists()) {
      // Lấy danh sách các key hiện có (movie1, movie10, movie60, ...)
      const keys = Object.keys(snapshot.val());

      // Tìm số lớn nhất từ các key (movie60 -> 60)
      const keyNumbers = keys
        .map((key) => {
          const match = key.match(/^movie(\d+)$/); // Tìm số trong key (movie60 -> 60)
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => !isNaN(num)); // Lọc bỏ các giá trị không phải số

      if (keyNumbers.length > 0) {
        newKeyNumber = Math.max(...keyNumbers) + 1; // Tăng số lớn nhất lên 1 (60 -> 61)
      }
    }

    // Tạo key mới (movie61) và movie_id mới (61)
    const newKey = `movie${newKeyNumber}`;
    const newMovieId = newKeyNumber; // movie_id là "61"

    // Thêm movie_id vào movieData
    const movieDataWithId = {
      ...movieData,
      movie_id: newMovieId,
    };

    // Sử dụng set() để thêm phim mới với key thủ công (movie61)
    const newMovieRef = ref(db, `Movies/${newKey}`);
    await set(newMovieRef, movieDataWithId);

    console.log(`Phim đã được thêm với key: ${newKey} và movie_id: ${newMovieId}`);
    return newMovieId; // Trả về movie_id (61)
  } catch (error) {
    console.error("Error adding movie to Firebase:", error);
    throw error;
  }
};

// API CHỈNH SỬA PHIM
export const updateMovieInFirebase = async (movieId, updatedMovieData) => {
  if (!movieId || !updatedMovieData) {
    console.error("Lỗi: Thiếu movieId hoặc dữ liệu cập nhật!");
    return false;
  }

  try {
    const db = getDatabase();
    const moviesRef = ref(db, "Movies");
    const snapshot = await get(moviesRef);

    if (!snapshot.exists()) {
      console.error("Không tìm thấy danh sách Movies trong Firebase!");
      return false;
    }

    const movies = snapshot.val();
    // Tìm key của phim dựa trên movie_id
    const movieKey = Object.keys(movies).find((key) => movies[key].movie_id === movieId);

    if (!movieKey) {
      console.error(`Không tìm thấy phim với movie_id = ${movieId} trong Firebase!`);
      return false;
    }

    // Tham chiếu đến phim cần cập nhật
    const movieRef = ref(db, `Movies/${movieKey}`);

    // Cập nhật dữ liệu phim
    await update(movieRef, updatedMovieData);

    console.log(`Phim với movie_id = ${movieId} đã được cập nhật thành công!`);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật phim trong Firebase:", error);
    return false;
  }
};

// API XÓA PHIM
export const deleteMovieFromFirebase = async (movieId) => {
  if (!movieId) {
    console.error("Lỗi: Thiếu movieId để xóa phim!");
    return false;
  }

  try {
    const db = getDatabase();
    const moviesRef = ref(db, "Movies");
    const snapshot = await get(moviesRef);

    if (!snapshot.exists()) {
      console.error("Không tìm thấy danh sách Movies trong Firebase!");
      return false;
    }

    const movies = snapshot.val();
    // Tìm key của phim dựa trên movie_id
    const movieKey = Object.keys(movies).find((key) => movies[key].movie_id === movieId);

    if (!movieKey) {
      console.error(`Không tìm thấy phim với movie_id = ${movieId} trong Firebase!`);
      return false;
    }

    // Tham chiếu đến phim cần xóa
    const movieRef = ref(db, `Movies/${movieKey}`);

    // Xóa phim
    await remove(movieRef);

    console.log(`Phim với movie_id = ${movieId} đã được xóa thành công!`);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa phim trong Firebase:", error);
    return false;
  }
};
