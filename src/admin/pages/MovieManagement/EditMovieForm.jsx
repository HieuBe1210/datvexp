import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { updateMovie } from "../../../services/service/serviceMovie";
import { validateMovieForm, isValidForm } from "../../utils/validateMovieForm.js";
import { toast } from "react-toastify";

const EditMovieForm = ({ movie, onUpdateMovie, onClose }) => {
  const [updatedMovie, setUpdatedMovie] = useState({ ...movie });
  const [errors, setErrors] = useState({});

  // Cập nhật state khi movie thay đổi
  useEffect(() => {
    setUpdatedMovie({ ...movie });
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateMovieForm(updatedMovie);
    setErrors(validationErrors);

    if (!isValidForm(validationErrors)) {
      return;
    }

    try {
      const movieData = {
        ...updatedMovie,
        duration: parseInt(updatedMovie.duration, 10),
        rating: parseFloat(updatedMovie.rating) || 0,
      };
      const success = await updateMovie(movieData.movie_id, movieData);
      if (success) {
        onUpdateMovie(movieData);
        onClose();
        toast.success("Cập nhật phim thành công!");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Lỗi khi cập nhật phim!");
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Chỉnh Sửa Phim
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Tên phim *"
          name="movie_name"
          value={updatedMovie.movie_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.movie_name}
          helperText={errors.movie_name}
        />
        <TextField
          label="Diễn viên *"
          name="actor"
          value={updatedMovie.actor}
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
          value={updatedMovie.duration}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.duration}
          helperText={errors.duration}
        />
        <TextField
          label="Thể loại *"
          name="genre"
          value={updatedMovie.genre}
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
          value={updatedMovie.release_date}
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
          value={updatedMovie.rating}
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
          value={updatedMovie.description}
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
          value={updatedMovie.director}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.director}
          helperText={errors.director}
        />
        <TextField
          label="Link ảnh nền (Background) *"
          name="background"
          value={updatedMovie.background}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.background}
          helperText={errors.background}
        />
        <TextField
          label="Link ảnh (Thumbnail) *"
          name="image"
          value={updatedMovie.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.image}
          helperText={errors.image}
        />
        <TextField
          label="Link trailer *"
          name="trailer"
          value={updatedMovie.trailer}
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
            value={updatedMovie.language}
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
            value={updatedMovie.status}
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
          value={updatedMovie.viewing_age}
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
            Cập nhật
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditMovieForm;
