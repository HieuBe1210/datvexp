import React from "react";
import { Box, TableCell, TableRow, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import styles from "./MovieManagement.module.scss";
import "./MovieRow.scss";

const MovieRow = ({ movie, isOpen, onToggle, onEdit, onDelete }) => {
  return (
    <>
      {/* Hàng chính */}
      <TableRow
        onClick={() => onToggle(movie.movie_id)}
        className={`${styles.tableRow} ${isOpen ? styles.tableRowSelected : ""}`}>
        <TableCell>{movie.movie_name}</TableCell>
        <TableCell>{movie.actor}</TableCell>
        <TableCell align="center">{movie.duration} phút</TableCell>
        <TableCell>{movie.genre}</TableCell>
        <TableCell align="center">{movie.release_date}</TableCell>
        <TableCell align="center">{movie.rating}</TableCell>

        {/* SỬA VÀ XOÁ */}
        <TableCell align="center" className="no-wrap">
          <Tooltip
            title={movie.is_protected ? "Không thể chỉnh sửa dữ liệu mẫu" : ""}
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "16px",
                  padding: "8px 12px",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "#fff",
                },
              },
            }}>
            <span>
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                disabled={movie.is_protected} // Làm mờ nút nếu is_protected là true
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={movie.is_protected ? "Không thể xoá dữ liệu mẫu" : ""}
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "16px",
                  padding: "8px 12px",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "#fff",
                },
              },
            }}>
            <span>
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(); // Gọi hàm xóa phim
                }}
                disabled={movie.is_protected} // Làm mờ nút nếu is_protected là true
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Hàng chi tiết */}
      <TableRow>
        <TableCell colSpan={7} style={{ padding: 0 }}>
          <Box className={`${styles.detailContainer} ${isOpen ? styles.detailContainerOpen : ""}`}>
            <Typography>
              <span className={styles.lableDetail}>- Đạo diễn:</span>
              {movie.director || "Không có thông tin"}
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Ngôn ngữ:</span>
              {movie.language}
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Trailer:</span>
              <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.trailerLink}>
                Xem trailer
              </a>
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Ảnh:</span>
              <a
                href={movie.image}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.trailerLink}>
                Xem ảnh
              </a>
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Mô tả:</span>
              <span className={styles.detailText}>{movie.description || "Không có mô tả"}</span>
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

export default MovieRow;
