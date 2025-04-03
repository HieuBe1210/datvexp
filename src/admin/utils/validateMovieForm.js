// Hàm kiểm tra URL hợp lệ
const isValidUrl = (string) => {
  const urlPattern = /^https?:\/\/([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
  return urlPattern.test(string);
};

// Hàm kiểm tra tên phim, diễn viên, thể loại, đạo diễn (hỗ trợ Tiếng Việt)
const isValidText = (text, allowComma = false) => {
  // Hỗ trợ Tiếng Việt, chữ cái, số, dấu cách, dấu gạch ngang, và dấu phẩy (nếu allowComma = true)
  const pattern = allowComma
    ? /^[a-zA-Z0-9\s,-]+$/ // Không hỗ trợ Tiếng Việt, chỉ để lại nếu cần kiểm tra thêm
    : /^[a-zA-Z\s]+$/; // Không hỗ trợ Tiếng Việt

  // regex hỗ trợ Tiếng Việt
  const vietnamesePattern = allowComma
    ? /^[\p{L}0-9\s,-]+$/u // Hỗ trợ Tiếng Việt, chữ cái, số, dấu cách, dấu phẩy, dấu gạch ngang
    : /^[\p{L}\s]+$/u; // Hỗ trợ Tiếng Việt, chữ cái, dấu cách

  return vietnamesePattern.test(text);
};

// Hàm kiểm tra độ tuổi xem (hỗ trợ ký hiệu chữ)
const isValidViewingAge = (age) => {
  // Hỗ trợ các định dạng: số nguyên dương, "13+", "18+", "P", "C13", "C18"
  const pattern = /^(?:\d+\+?|P|C13|C18)$/;
  return pattern.test(age);
};

// Hàm kiểm tra ngày không trong quá khứ
const isDateNotInPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chính xác
  const inputDate = new Date(date);
  return inputDate >= today;
};

export const validateMovieForm = (movie) => {
  const errors = {};

  // Validate Tên phim
  if (!movie.movie_name || movie.movie_name.trim() === "") {
    errors.movie_name = "Tên phim không được để trống.";
  } else if (!isValidText(movie.movie_name)) {
    errors.movie_name = "Tên phim chỉ được chứa chữ, số, dấu cách, dấu gạch ngang.";
  }

  // Validate Diễn viên
  if (!movie.actor || movie.actor.trim() === "") {
    errors.actor = "Diễn viên không được để trống.";
  } else if (!isValidText(movie.actor, true)) {
    errors.actor = "Diễn viên chỉ được chứa chữ, dấu cách, dấu phẩy.";
  }

  // Validate Thời lượng
  if (!movie.duration) {
    errors.duration = "Thời lượng không được để trống.";
  } else if (isNaN(movie.duration) || parseInt(movie.duration) <= 0) {
    errors.duration = "Thời lượng phải là số dương.";
  } else if (!Number.isInteger(Number(movie.duration))) {
    errors.duration = "Thời lượng phải là số nguyên.";
  } else if (parseInt(movie.duration) > 300) {
    errors.duration = "Thời lượng không được vượt quá 300 phút.";
  }

  // Validate Thể loại
  if (!movie.genre || movie.genre.trim() === "") {
    errors.genre = "Thể loại không được để trống.";
  } else if (!isValidText(movie.genre, true)) {
    errors.genre = "Thể loại chỉ được chứa chữ, dấu cách, dấu phẩy.";
  }

  // Validate Ngày phát hành
  if (!movie.release_date) {
    errors.release_date = "Ngày phát hành không được để trống.";
  } else if (!isDateNotInPast(movie.release_date)) {
    errors.release_date = "Ngày phát hành không được trong quá khứ.";
  }

  // Validate Đánh giá (không bắt buộc)
  if (movie.rating) {
    if (movie.rating < 0 || movie.rating > 10) {
      errors.rating = "Đánh giá phải từ 0 đến 10.";
    } else if (!/^\d+(\.\d{1})?$/.test(movie.rating)) {
      errors.rating = "Đánh giá chỉ được có tối đa 1 chữ số thập phân.";
    }
  }

  // Validate Mô tả
  if (!movie.description || movie.description.trim() === "") {
    errors.description = "Mô tả không được để trống.";
  } else if (movie.description.length < 10) {
    errors.description = "Mô tả phải có ít nhất 10 ký tự.";
  } else if (movie.description.length > 500) {
    errors.description = "Mô tả không được vượt quá 500 ký tự.";
  }

  // Validate Đạo diễn
  if (!movie.director || movie.director.trim() === "") {
    errors.director = "Đạo diễn không được để trống.";
  } else if (!isValidText(movie.director)) {
    errors.director = "Đạo diễn chỉ được chứa chữ và dấu cách.";
  }

  // Validate Link hình nền
  if (!movie.background || movie.background.trim() === "") {
    errors.background = "Link hình nền không được để trống.";
  } else if (!isValidUrl(movie.background)) {
    errors.background = "Link hình nền phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).";
  }

  // Validate Link hình ảnh
  if (!movie.image || movie.image.trim() === "") {
    errors.image = "Link hình ảnh không được để trống.";
  } else if (!isValidUrl(movie.image)) {
    errors.image = "Link hình ảnh phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).";
  }

  // Validate Link trailer
  if (!movie.trailer || movie.trailer.trim() === "") {
    errors.trailer = "Link trailer không được để trống.";
  } else if (!isValidUrl(movie.trailer)) {
    errors.trailer = "Link trailer phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).";
  }

  // Validate Ngôn ngữ
  if (!movie.language) {
    errors.language = "Ngôn ngữ không được để trống.";
  } else if (!["Vietnamese", "English", "Tiếng Anh (VietSub)"].includes(movie.language)) {
    errors.language = "Ngôn ngữ không hợp lệ.";
  }

  // Validate Trạng thái
  if (!movie.status) {
    errors.status = "Trạng thái không được để trống.";
  } else if (!["upcoming", "active", "close"].includes(movie.status)) {
    errors.status = "Trạng thái không hợp lệ.";
  }

  // Validate Độ tuổi xem
  if (!movie.viewing_age || movie.viewing_age.trim() === "") {
    errors.viewing_age = "Độ tuổi xem không được để trống.";
  } else if (!isValidViewingAge(movie.viewing_age)) {
    errors.viewing_age =
      "Độ tuổi xem phải là số nguyên dương, dạng '13+', '18+', 'P', 'C13', hoặc 'C18'.";
  }

  return errors;
};

export const isValidForm = (errors) => {
  return Object.values(errors).every((error) => !error);
};
