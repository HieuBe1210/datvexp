import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Slide,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useCinemaManagement from "./CinemaManagement.js";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import "./TheaterManagement.modul.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TheaterManagement = () => {
  const {
    cinemas,
    currentPage,
    totalPages,
    open,
    sortCriterion,
    newCinema,
    errors,
    confirmDeleteOpen,
    editOpen,
    editCinema,
    setSortCriterion,
    handleSearch,
    handleOpen,
    handleClose,
    handleChangePage,
    handleChange,
    handleAddCinema,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDeleteCinema,
    handleOpenEdit,
    handleCloseEdit,
    handleUpdateCinema,
  } = useCinemaManagement();

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header bảng */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}>
        <Typography variant="h5">Danh sách rạp</Typography>
        <TextField
          select
          label="Sắp xếp theo"
          value={sortCriterion}
          onChange={(e) => setSortCriterion(e.target.value)}
          SelectProps={{ native: true }}
          variant="outlined"
          size="small"
          sx={{ width: "150px", marginLeft: "50px" }}
          InputLabelProps={{ shrink: true }}>
          <option value="">Không</option>
          <option value="name">Tên rạp</option>
          <option value="city">Khu vực</option>
          <option value="location">Địa chỉ</option>
        </TextField>
        <div className="search-admin">
          <SearchBar
            onSearch={(query) => handleSearch(query)}
            placeholder="Tìm kiếm rạp, khu vực, địa chỉ..."
          />
        </div>
        <Button
          sx={{
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#125a9c" },
            fontSize: "1.4rem",
          }}
          variant="contained"
          color="primary"
          onClick={handleOpen}>
          Thêm rạp mới
        </Button>
      </Box>

      {/* Bảng danh sách rạp */}
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(22, 10, 95, 0.2)" }}>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <strong className="lableDetail">Tên rạp chiếu</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <strong className="lableDetail">Khu vực</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <strong className="lableDetail">Địa chỉ</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }} align="center">
                <strong className="lableDetail">Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          {cinemas.length > 0 ? (
            <TableBody>
              {cinemas.map((cinema, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}>
                  <TableCell className="no-wrap">{cinema.cinema_name}</TableCell>
                  <TableCell className="no-wrap">{cinema.city}</TableCell>
                  <TableCell>{cinema.location}</TableCell>
                  <TableCell align="center" className="no-wrap">
                    <Tooltip
                      title={cinema.is_protected ? "Không thể chỉnh sửa dữ liệu mẫu" : ""}
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
                          onClick={() => handleOpenEdit(cinema)}
                          disabled={cinema.is_protected} // Làm mờ nút nếu is_protected là true
                        >
                          <Edit />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={cinema.is_protected ? "Không thể xoá dữ liệu mẫu" : ""}
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
                          onClick={() => handleOpenConfirmDelete(cinema.id, cinema.is_protected)}
                          disabled={cinema.is_protected} // Làm mờ nút nếu is_protected là true
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Typography sx={{ display: "block", textAlign: "center", padding: "7px" }}>
              Không tìm thấy rạp nào
            </Typography>
          )}
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          sx={{ fontSize: "2rem" }}
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      {/* Dialog Thêm Rạp */}
      <Dialog open={open} TransitionComponent={Transition} keepMounted>
        <DialogTitle>Thêm Rạp Mới</DialogTitle>
        <DialogContent sx={{ fontSize: "1.4rem" }}>
          <Box className="theater-input-container">
            <TextField
              label="Tên rạp *"
              name="name"
              value={newCinema.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Khu vực *"
              name="city"
              value={newCinema.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.city}
              helperText={errors.city}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Địa chỉ *"
              name="location"
              value={newCinema.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Vĩ độ (Latitude) *"
              name="latitude"
              value={newCinema.latitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.latitude}
              helperText={errors.latitude}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Kinh độ (Longitude) *"
              name="longitude"
              value={newCinema.longitude}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.longitude}
              helperText={errors.longitude}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="URL Logo *"
              name="logo"
              value={newCinema.logo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.logo}
              helperText={errors.logo}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Số điện thoại"
              name="phone_number"
              value={newCinema.phone_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Email"
              name="email"
              value={newCinema.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Website"
              name="website"
              value={newCinema.website}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.website}
              helperText={errors.website}
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Giờ mở cửa *"
              name="opening_hours"
              value={newCinema.opening_hours}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.opening_hours}
              helperText={errors.opening_hours}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Sức chứa"
              name="capacity"
              value={newCinema.capacity}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.capacity}
              helperText={errors.capacity}
            />
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Mô tả *"
              name="description"
              value={newCinema.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Box>

          <Box className="theater-input-container">
            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Trạng thái *</InputLabel>
              <Select
                name="status"
                value={newCinema.status}
                onChange={handleChange}
                label="Trạng thái"
                required>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
              {!!errors.status && (
                <Typography className="error-message" color="error">
                  {errors.status}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" className="dialog-actions-btn">
            Hủy
          </Button>
          <Button
            onClick={handleAddCinema}
            color="primary"
            variant="contained"
            className="dialog-actions-btn">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chỉnh Sửa Rạp */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        TransitionComponent={Transition}
        keepMounted>
        <DialogTitle>Chỉnh sửa rạp</DialogTitle>
        <DialogContent sx={{ fontSize: "1.4rem" }}>
          {editCinema && (
            <>
              <Box className="theater-input-container">
                <TextField
                  label="Tên rạp *"
                  name="name"
                  value={editCinema.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Khu vực *"
                  name="city"
                  value={editCinema.city}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.city}
                  helperText={errors.city}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Địa chỉ *"
                  name="location"
                  value={editCinema.location}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.location}
                  helperText={errors.location}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Vĩ độ (Latitude) *"
                  name="latitude"
                  value={editCinema.latitude}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.latitude}
                  helperText={errors.latitude}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Kinh độ (Longitude) *"
                  name="longitude"
                  value={editCinema.longitude}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.longitude}
                  helperText={errors.longitude}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="URL Logo *"
                  name="logo"
                  value={editCinema.logo}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.logo}
                  helperText={errors.logo}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Số điện thoại"
                  name="phone_number"
                  value={editCinema.phone_number}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Email"
                  name="email"
                  value={editCinema.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Website"
                  name="website"
                  value={editCinema.website}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.website}
                  helperText={errors.website}
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Giờ mở cửa *"
                  name="opening_hours"
                  value={editCinema.opening_hours}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.opening_hours}
                  helperText={errors.opening_hours}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Sức chứa"
                  name="capacity"
                  value={editCinema.capacity}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                />
              </Box>
              <Box className="theater-input-container">
                <TextField
                  label="Mô tả *"
                  name="description"
                  value={editCinema.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Box>
              <Box className="theater-input-container">
                <FormControl fullWidth margin="normal" error={!!errors.status}>
                  <InputLabel>Trạng thái *</InputLabel>
                  <Select
                    name="status"
                    value={editCinema.status}
                    onChange={handleChange}
                    label="Trạng thái"
                    required>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                  </Select>
                  {!!errors.status && (
                    <Typography className="error-message" color="error">
                      {errors.status}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary" className="dialog-actions-btn">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateCinema}
            color="primary"
            variant="contained"
            className="dialog-actions-btn">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác Nhận Xóa */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        TransitionComponent={Transition}
        keepMounted>
        <DialogTitle>Xác nhận xóa rạp</DialogTitle>
        <DialogContent>
          <DialogContentText className="confirm-delete-dialog-text">
            Bạn có chắc chắn muốn xóa rạp này không?
          </DialogContentText>
          <DialogContentText className="confirm-delete-dialog-text">
            Dữ liệu đã xoá không thể khôi phục
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteCinema} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TheaterManagement;
