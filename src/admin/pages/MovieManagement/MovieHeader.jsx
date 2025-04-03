import React from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import SearchBar from "../../components/SearchBar/SearchBar";
import zIndex from "@mui/material/styles/zIndex";

const MovieHeader = ({ onSearch, onSort, onOpenAddForm }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
      }}>
      <Typography variant="h5">Danh sách Phim</Typography>
      <TextField
        select
        label="Sắp xếp theo"
        onChange={(e) => onSort(e.target.value)}
        SelectProps={{ native: true }}
        variant="outlined"
        size="small"
        sx={{ width: "150px", marginLeft: "50px" }}
        InputLabelProps={{
          shrink: true, // Giữ label cố định phía trên
        }}>
        <option value="id">Không</option>
        <option value="movie_name">Tên phim</option>
        <option value="actor">Diễn viên</option>
        <option value="genre">Thể loại</option>
        <option value="release_date">Ngày chiếu</option>
        <option value="rating">Đánh giá</option>
        <option value="duration">Thời lượng</option>
      </TextField>
      <div className="search-admin">
        <SearchBar onSearch={onSearch} placeholder="Tìm kiếm theo phim, thể loại, diễn viên..." />
      </div>
      <Button
        sx={{
          backgroundColor: "#1976d2",
          ":hover": { backgroundColor: "#125a9c" },
          fontSize: "1.4rem",
        }}
        variant="contained"
        color="primary"
        onClick={onOpenAddForm} // Gọi hàm mở form
      >
        Thêm phim mới
      </Button>
    </Box>
  );
};

export default MovieHeader;
