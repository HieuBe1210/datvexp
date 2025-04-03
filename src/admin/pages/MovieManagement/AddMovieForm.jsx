import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { addMovie } from "../../../services/service/serviceMovie";
import CloseIcon from "@mui/icons-material/Close";
import { validateMovieForm, isValidForm } from "../../utils/validateMovieForm.js";
import { toast } from "react-toastify";

const AddMovieForm = ({ onAddMovie, onClose }) => {
  const [newMovie, setNewMovie] = useState({
    movie_name: "",
    actor: "",
    duration: "",
    genre: "",
    release_date: "",
    rating: 0,
    description: "",
    director: "",
    background: "",
    image: "",
    trailer: "",
    language: "Vietnamese",
    status: "upcoming",
    is_protected: false,
    is_special_show: false,
    viewing_age: "",
    totalRatings: 0,
    totalReviews: 0,
    total_tickets_sold: 0,
  });

  const [errors, setErrors] = useState({}); // State để lưu lỗi validate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));

    // Xóa lỗi của trường khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sử dụng hàm validate từ file validateMovieForm.js
    const validationErrors = validateMovieForm(newMovie);
    setErrors(validationErrors);

    // Kiểm tra nếu form hợp lệ
    if (!isValidForm(validationErrors)) {
      return; // Dừng lại nếu có lỗi
    }

    try {
      const movieData = {
        ...newMovie,
        movie_id: Date.now().toString(), // Tạo ID tạm thời (nên dùng UUID trong thực tế)
        duration: parseInt(newMovie.duration, 10),
        rating: parseFloat(newMovie.rating) || 0,
      };
      const movieId = await addMovie(movieData);
      if (movieId) {
        onAddMovie(movieData);
        onClose(); // Đóng form sau khi thêm phim thành công
        toast.success("Thêm phim mới thành công!");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto", position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Thêm Phim Mới
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Tên phim *"
          name="movie_name"
          value={newMovie.movie_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.movie_name}
          helperText={errors.movie_name}
        />
        <TextField
          label="Diễn viên *"
          name="actor"
          value={newMovie.actor}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.actor}
          helperText={errors.actor}
        />
        <TextField
          label="Thời lượng (phút) *"
          name="duration"
          type="number"
          value={newMovie.duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.duration}
          helperText={errors.duration}
        />
        <TextField
          label="Thể loại *"
          name="genre"
          value={newMovie.genre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.genre}
          helperText={errors.genre}
        />
        <TextField
          label="Ngày phát hành *"
          name="release_date"
          type="date"
          value={newMovie.release_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.release_date}
          helperText={errors.release_date}
        />
        <TextField
          label="Đánh giá (0-10)"
          name="rating"
          type="number"
          value={newMovie.rating}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          error={!!errors.rating}
          helperText={errors.rating}
        />
        <TextField
          label="Mô tả *"
          name="description"
          value={newMovie.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          label="Đạo diễn *"
          name="director"
          value={newMovie.director}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.director}
          helperText={errors.director}
        />
        <TextField
          label="Link ảnh nền (Background) *"
          name="background"
          value={newMovie.background}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.background}
          helperText={errors.background}
        />
        <TextField
          label="Link ảnh (Thumbnail) *"
          name="image"
          value={newMovie.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.image}
          helperText={errors.image}
        />
        <TextField
          label="Link trailer *"
          name="trailer"
          value={newMovie.trailer}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.trailer}
          helperText={errors.trailer}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Ngôn ngữ *</InputLabel>
          <Select
            name="language"
            value={newMovie.language}
            onChange={handleChange}
            label="Ngôn ngữ *"
            error={!!errors.language}>
            <MenuItem value="Vietnamese">Vietnamese</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Tiếng Anh (VietSub)">Tiếng Anh (VietSub)</MenuItem>
          </Select>
          {errors.language && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.language}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Trạng thái *</InputLabel>
          <Select
            name="status"
            value={newMovie.status}
            onChange={handleChange}
            label="Trạng thái *"
            error={!!errors.status}>
            <MenuItem value="upcoming">Sắp chiếu</MenuItem>
            <MenuItem value="active">Đang chiếu</MenuItem>
            <MenuItem value="close">Đã đóng</MenuItem>
          </Select>
          {errors.status && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.status}
            </Typography>
          )}
        </FormControl>
        <TextField
          label="Độ tuổi xem *"
          name="viewing_age"
          value={newMovie.viewing_age}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.viewing_age}
          helperText={errors.viewing_age}
        />
        <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Thêm
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddMovieForm;
