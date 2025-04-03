import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchFromFireBase } from "../src/services/firebaseService";

// Async thunk để gọi API tìm kiếm
export const searchMovies = createAsyncThunk(
  "search/searchMovies",
  async (query, { rejectWithValue }) => {
    try {
      const results = await searchFromFireBase.searchMovies(query); // Gọi API Firebase
      //   console.log("Results in searchSlice: ", results);
      return results; // Trả về kết quả tìm kiếm
    } catch (error) {
      return rejectWithValue(error.message || "Tìm kiếm thất bại"); // Trả về lỗi nếu có
    }
  }
);

// Tạo slice để quản lý trạng thái tìm kiếm
const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchResults: [], // Danh sách kết quả tìm kiếm
    isSearching: false, // Trạng thái tìm kiếm
    error: null, // Lỗi nếu có
  },
  reducers: {
    resetSearch: (state) => {
      state.searchResults = [];
      state.isSearching = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        // console.log("Search started...");
        state.isSearching = true; // Đang tìm kiếm
        state.error = null; // Xóa lỗi cũ
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        // console.log("Search success:", action.payload);
        state.searchResults = action.payload; // Cập nhật kết quả tìm kiếm
        state.isSearching = false; // Hoàn thành tìm kiếm
      })
      .addCase(searchMovies.rejected, (state, action) => {
        // console.error("Search failed:", action.payload);
        state.error = action.payload; // Lưu lỗi vào state
        state.isSearching = false; // Kết thúc tìm kiếm
      });
  },
});

// Xuất action để reset tìm kiếm
export const { resetSearch } = searchSlice.actions;

// Xuất reducer để thêm vào store
export default searchSlice.reducer;
