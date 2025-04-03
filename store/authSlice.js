import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  loginWithFacebook,
} from "../src/services/authService";
import { setAuthToken, removeAuthToken } from "../src/utils/authStorage";

// Async actions cho các chức năng đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  // Hàm async để đăng ký người dùng với email và mật khẩu
  async ({ email, password, formData }, { rejectWithValue }) => {
    try {
      const response = await registerWithEmailAndPassword(
        email,
        password,
        formData
      );

      return response.user; // Trả về thông tin người dùng khi thành công
    } catch (error) {
      return rejectWithValue(error.code); // Trả về mã lỗi nếu thất bại
    }
  }
);

// Async actions cho các chức năng đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  // Hàm async để đăng nhập người dùng với email và mật khẩu
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginWithEmailAndPassword(email, password);

      if (response.error) {
        return rejectWithValue(response.error); // Truyền lỗi vào Redux nếu có
      }
      return response; // Trả về thông tin đăng nhập khi thành công
    } catch (error) {
      return rejectWithValue(error.message || error.code); // Trả về mã lỗi nếu thất bại
    }
  }
);

// Async action đăng nhập bằng Google
export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  const response = await loginWithGoogle();
  return response; // Trả về thông tin đăng nhập qua Google
});

// Async action đăng nhập bằng Facebook
export const facebookLogin = createAsyncThunk(
  "auth/facebookLogin",
  async () => {
    const response = await loginWithFacebook();
    return response; // Trả về thông tin đăng nhập qua Facebook
  }
);

// Tạo slice cho auth để quản lý trạng thái đăng nhập
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Thông tin người dùng
    token: null, // Token xác thực
    status: "idle", // Trạng thái xử lý (idle, loading, succeeded, failed)
    error: null, // Thông tin lỗi (nếu có)
    isLoggedIn: false, // Trạng thái đăng nhập
  },
  reducers: {
    // Action xử lý khi đăng nhập thất bại
    loginFailed: (state, action) => {
      state.error = action.payload; // Lưu lỗi trong Redux state
    },
    // Action reset lỗi về null
    resetError: (state) => {
      state.error = null;
    },
    // Logout action: Xóa thông tin người dùng và token khi đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      removeAuthToken(); // Xóa token khỏi local storage
      localStorage.removeItem("user"); // Xóa thông tin user khỏi local storage
      state.error = null; // Reset lỗi
    },
    // Action setAuth: Thiết lập trạng thái đăng nhập
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Khi đăng nhập bằng email/password thành công
      .addCase(loginUser.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1740322159/user-avatar-happy_jukint.png", // URL ảnh mặc định nếu không có ảnh từ response
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        setAuthToken(accessToken); // Lưu token vào local storage
      })
      // Khi đăng nhập bằng email/password thất bại
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload; // Lưu lỗi vào Redux state
      })
      // Khi đăng nhập bằng Google thành công
      .addCase(googleLogin.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1740322159/user-avatar-happy_jukint.png", // URL ảnh mặc định nếu không có ảnh từ response
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        setAuthToken(accessToken); // Lưu token vào local storage
      })
      // Khi đăng nhập bằng Google thất bại
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload; // Lưu lỗi nếu đăng nhập thất bại
      })
      // Khi đăng nhập bằng Facebook thành công
      .addCase(facebookLogin.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1740322159/user-avatar-happy_jukint.png", // URL ảnh mặc định nếu không có ảnh từ response
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        setAuthToken(accessToken); // Lưu token vào local storage
      })
      // Khi đăng nhập bằng Facebook thất bại
      .addCase(facebookLogin.rejected, (state, action) => {
        state.error = action.payload; // Lưu lỗi nếu đăng nhập thất bại
      });
  },
});

// Xuất action logout và setAuth để có thể sử dụng trong các component
export const { logout, setAuth, loginFailed, resetError } = authSlice.actions;

// Xuất reducer để thêm vào store chính của ứng dụng
export default authSlice.reducer;
