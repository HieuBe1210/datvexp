import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Modal,
} from "@mui/material";
import useMovieManagement from "./MovieManagementHandle";
import styles from "./MovieManagement.module.scss";
import MovieHeader from "./MovieHeader";
import MovieRow from "./MovieRow";
import AddMovieForm from "./AddMovieForm";
import EditMovieForm from "./EditMovieForm";
import { toast } from "react-toastify";

const MovieManagement = () => {
  const {
    paginatedMovies,
    currentPage,
    totalPages,
    openRowId,
    setCurrentPage,
    handleRowToggle,
    handleSearch,
    handleSort,
    handleAddMovie,
    handleUpdateMovie,
    handleDeleteMovie, // Thêm hàm xóa phim
  } = useMovieManagement();

  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleOpenEditForm = (movie) => {
    if (movie.is_protected) {
      toast.error("Bạn không thể chỉnh sửa dữ liệu do Team phát triển xây dựng!");
      return;
    }
    setSelectedMovie(movie);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedMovie(null);
  };

  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };

  // Xử lý xóa phim với xác nhận
  const handleDelete = async (movie) => {
    if (movie.is_protected) {
      toast.error("Bạn không thể xóa dữ liệu do Team phát triển xây dựng!");
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa phim "${movie.movie_name}" không?`
    );
    if (confirmDelete) {
      const success = await handleDeleteMovie(movie.movie_id);
      if (success) {
        toast.success(`Phim "${movie.movie_name}" đã được xóa thành công!`);
      } else {
        toast.error("Lỗi khi xóa phim!");
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MovieHeader onSearch={handleSearch} onSort={handleSort} onOpenAddForm={handleOpenAddForm} />

      {openAddForm && <AddMovieForm onAddMovie={handleAddMovie} onClose={handleCloseAddForm} />}

      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow className={styles.tableRowColor}>
              <TableCell>
                <strong className={styles.lableDetail}>Tên phim</strong>
              </TableCell>
              <TableCell>
                <strong className={styles.lableDetail}>Diễn viên</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Thời lượng</strong>
              </TableCell>
              <TableCell>
                <strong className={styles.lableDetail}>Thể loại</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Ngày chiếu</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Đánh giá</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMovies.map((movie) => (
              <MovieRow
                key={movie.movie_id}
                movie={movie}
                isOpen={openRowId === movie.movie_id}
                onToggle={handleRowToggle}
                onEdit={() => handleOpenEditForm(movie)}
                onDelete={() => handleDelete(movie)} // Truyền hàm xóa phim
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      <Modal
        open={openAddForm}
        aria-labelledby="add-movie-modal-title"
        aria-describedby="add-movie-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 600,
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
          <AddMovieForm onAddMovie={handleAddMovie} onClose={handleCloseAddForm} />
        </Box>
      </Modal>

      <Modal open={openEditForm} onClose={handleCloseEditForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 600,
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
          {selectedMovie && (
            <EditMovieForm
              movie={selectedMovie}
              onUpdateMovie={handleUpdateMovie}
              onClose={handleCloseEditForm}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieManagement;
