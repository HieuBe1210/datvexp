import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  query,
  update,
  orderByChild,
  equalTo,
  remove,
} from "firebase/database";
import { getAccountByEmailFromFirebase } from "./firebaseService";
import { toast } from "react-toastify";
import axios from "axios";
const auth = getAuth();
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG!
const db = getDatabase();

// HÀM ĐĂNG NHẬP BẰNG GOOGLE
export const loginWithGoogle = async (additionalData = {}) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const accessToken = await user.getIdToken(); // Lấy accessToken

  // Chuẩn bị dữ liệu người dùng
  const userData = {
    // uid: user.uid,
    role: "user", // Role mặc định
    status: "active",
    created_date: new Date().toISOString().split("T")[0],
    updated_date: new Date().toISOString().split("T")[0],
  };

  // Lưu dữ liệu vào Realtime Database
  try {
    const userRef = ref(db, `Account/${user.uid}`); // Sử dụng UID làm khóa
    const snapshot = await get(userRef); // Kiểm tra xem người dùng đã tồn tại chưa
    if (!snapshot.exists()) {
      await set(userRef, userData); // Chỉ lưu nếu chưa tồn tại
    } else {
      await update(userRef, { updated_date: new Date().toISOString().split("T")[0] }); // Cập nhật thời gian nếu đã tồn tại
    }
    console.log("Lưu dữ liệu vào Firebase thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào Firebase:", error);
    throw new Error("Không thể lưu thông tin người dùng vào database.");
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    accessToken,
  };
};

// HÀM ĐĂNG NHẬP BẰNG FACEBOOK
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const accessToken = await user.getIdToken(); // Lấy accessToken

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    accessToken,
  };
};

// HÀM KIỂM TRA EMAIL CÓ TỒN TẠI KHÔNG
export const getUserByEmail = async (email) => {
  const db = getDatabase();
  const userRef = ref(db, "users");
  const userQuery = query(userRef, orderByChild("email"), equalTo(email));

  const snapshot = await get(userQuery);
  if (!snapshot.exists()) {
    throw new Error("Người dùng không tồn tại!");
  }
  const userData = snapshot.val();
  // Nếu có nhiều kết quả, chọn kết quả đầu tiên
  const userValues = Object.values(userData);
  if (!userValues.length) {
    throw new Error("Dữ liệu không hợp lệ");
  }
  return userValues[0]; // Trả về người dùng đầu tiên
};

// HÀM ĐĂNG NHẬP BẰNG EMAIL VÀ MẬT KHẨU
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const checkUser = await getAccountByEmailFromFirebase(email);
    if (!checkUser) {
      throw new Error("Người dùng không tồn tại!");
    }

    // [QUAN TRỌNG] Kiểm tra trạng thái quản lý trước khi đăng nhập
    if (checkUser.status === "locked") {
      throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ Admin.");
    }
    console.log("checkUser: ", checkUser);

    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (!user.emailVerified) {
      throw new Error(`Email chưa được xác nhận. Vui lòng kiểm tra email.`);
    }

    // Cập nhật trạng thái trong Firebase Database nếu email đã xác thực
    // [QUAN TRỌNG] Chỉ cập nhật khi là lần đầu đăng nhập VÀ status hiện tại là "pending"
    if (checkUser.first_login === true && checkUser.status === "pending") {
      const db = getDatabase();
      const userRef = ref(db, `Account/${user.uid}`);

      await update(userRef, {
        status: "active",
        first_login: false,
        updated_date: new Date().toISOString().split("T")[0],
        lastLoginAt: new Date().toISOString().split("T")[0],
      });
      console.log("Cập nhật trạng thái thành active (lần đầu đăng nhập)");
    }
    return user;
  } catch (error) {
    switch (error.code) {
      case `auth/invalid-credential`:
        error.message = "Mật khẩu không đúng.";
        break;
      case `auth/invalid-email`:
        error.message = "Tài khoản không tồn tại.";
        break;
      case `auth/user-not-found`:
        error.message = "Tài khoản không tồn tại.";
        break;
      case `auth/wrong-password`:
        error.message = "Mật khẩu không đúng.";
        break;
      case `auth/user-disabled`:
        error.message = "Tài khoản của bạn đã bị vô hiệu hóa.";
        break;
      case `auth/too-many-requests`:
        error.message = "Bạn đã nhập sai quá nhiều lần, vui lòng thử lại sau.";
        break;
    }
    console.error("Lỗi đăng nhập:", error.code || error.message);
    throw new Error(error.message || "Lỗi đăng nhập");
  }
};
// HÀM ĐĂNG KÝ TÀI KHOẢN
export const registerWithEmailAndPassword = async (email, password, formData) => {
  const db = getDatabase();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  // Cập nhật displayName vào Firebase Auth ngay sau khi tạo tài khoản
  await updateProfile(user, {
    displayName: formData.name,
    photoURL:
      "https://res.cloudinary.com/ddia5yfia/image/upload/v1740322159/user-avatar-happy_jukint.png",
  });

  // LƯU THÊM DỮ LIỆU VÀO REALTIME DATABASE
  try {
    const userRef = ref(db, `Account/${user.uid}`);
    await set(userRef, {
      uid: user.uid,
      fullname: formData.name,
      email: formData.email,
      phone: formData.phone,
      passport: "",
      role: "user", // Role mặc định
      status: "pending", // "pending" vì chưa xác nhận email
      first_login: true,
      city: "",
      district: "",
      address: "",
      avatar_url:
        "https://res.cloudinary.com/ddia5yfia/image/upload/v1740322159/user-avatar-happy_jukint.png",
      created_date: new Date().toISOString().split("T")[0],
      updated_date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào Firebase:", error);
  }

  // Gửi email xác nhận
  await sendEmailVerification(user);
  const accessToken = await user.getIdToken(); // Lấy accessToken sau khi gửi email xác nhận
  console.log("Đăng ký thành công!");
  return {
    uid: user.uid,
    email: user.email,
    fullname: user.displayName,
    accessToken,
  };
};

// Hàm lắng nghe trạng thái đăng nhập
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// HÀM GỬI LẠI EMAIL XÁC NHẬN KHI NGƯỜI DÙNG ĐĂNG NHẬP VỚI EMAIL CHƯA XÁC NHẬN
export const resendVerificationEmail = async (email, password) => {
  const auth = getAuth();
  try {
    // Đăng nhập để lấy đối tượng user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user.emailVerified) {
      throw new Error("Email đã được xác nhận, không cần gửi lại.");
    }
    // Gửi lại email xác nhận
    await sendEmailVerification(userCredential.user);
    // Sau khi gửi, sign out để không cho đăng nhập trước khi xác nhận
    await signOut(auth);
    return "Email xác nhận đã được gửi lại. Vui lòng kiểm tra email của bạn.";
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error.message);
    throw error;
  }
};
// HÀM LẤY DANH SÁCH NGƯỜI DÙNG TỪ FIREBASE
export const fetchUsersFromFirebase = async () => {
  try {
    const response = await axios.get("https://vticinema-default-rtdb.firebaseio.com/Account.json");
    const userData = response.data;
    if (!userData) return [];
    const userList = Object.keys(userData).map((key) => ({
      id: key,
      ...userData[key],
    }));
    return userList;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Lỗi khi tải danh sách người dùng");
    throw error;
  }
};

// HÀM KHÓA TÀI KHOẢN
export const lockUserFromFirebase = async (userId) => {
  const userRef = ref(db, `Account/${userId}`);
  try {
    await update(userRef, { status: "locked" });
    toast.success("Khóa tài khoản thành công");
    return true;
  } catch (error) {
    console.error("Error locking user:", error);
    toast.error("Lỗi khi khóa tài khoản");
    throw error;
  }
};

// HÀM MỞ KHÓA TÀI KHOẢN
export const unlockUserFromFirebase = async (userId) => {
  const userRef = ref(db, `Account/${userId}`);
  try {
    await update(userRef, { status: "active" });
    toast.success("Mở khóa tài khoản thành công");
    return true;
  } catch (error) {
    console.error("Error unlocking user:", error);
    toast.error("Lỗi khi mở khóa tài khoản");
    throw error;
  }
};

// HÀM XÓA TÀI KHOẢN
export const deleteUserFromFirebase = async (userId) => {
  const userRef = ref(db, `Account/${userId}`);
  try {
    await remove(userRef);
    toast.success("Xóa tài khoản thành công");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Lỗi khi xóa tài khoản");
    throw error;
  }
};
