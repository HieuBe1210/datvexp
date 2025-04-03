import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";
import searchReducer from "./searchSlice";

// Tạo store chính cho ứng dụng, kết hợp các reducer
const store = configureStore({
  // Khai báo reducer của auth (xử lý trạng thái authentication)
  reducer: {
    auth: authReducer, // Sử dụng authReducer từ authSlice để quản lý auth state
    search: searchReducer, // Thêm searchReducer vào store
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }), // Bật redux-thunk
});

export default store;
