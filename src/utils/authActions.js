import { logout } from "../../store/authSlice";
import { toast } from "react-toastify";
import { getDatabase, ref, set, update } from "firebase/database";
import { removeAuthToken } from "../utils/authStorage";
import { email } from "react-admin";

export const handleLogout = (dispatch) => {
  removeAuthToken();
  // Cập nhật Redux state
  dispatch(logout());
  const rememberMe = localStorage.getItem("rememberToken");
  if (!rememberMe) {
    localStorage.removeItem("rememberToken");
  }
};

export const saveUserToDatabase = (user) => {
  const db = getDatabase();
  const userRef = ref(db, `Account/${user.uid}`);

  update(userRef, {
    email: user.email,
    displayName: user.displayName,
    avatar_url: user.photoURL,
    lastLoginAt: new Date().toISOString(),
  })
    .then(() => {
      console.log("Dữ liệu người dùng đã được lưu thành công!");
    })
    .catch((error) => {
      console.error("Lỗi khi lưu dữ liệu người dùng:", error);
    });
};
