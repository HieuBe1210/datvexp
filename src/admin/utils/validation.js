export const validateTheaterForm = (cinema) => {
  const errors = {};

  // Kiểm tra các trường bắt buộc
  if (!cinema.name || cinema.name.trim() === "") errors.name = "Tên rạp không được để trống";
  if (!cinema.city || cinema.city.trim() === "") errors.city = "Khu vực không được để trống";
  if (!cinema.location || cinema.location.trim() === "")
    errors.location = "Địa chỉ không được để trống";
  if (!cinema.latitude || isNaN(cinema.latitude) || cinema.latitude < -90 || cinema.latitude > 90)
    errors.latitude = "Vĩ độ phải là số trong khoảng -90 đến 90";
  if (
    !cinema.longitude ||
    isNaN(cinema.longitude) ||
    cinema.longitude < -180 ||
    cinema.longitude > 180
  )
    errors.longitude = "Kinh độ phải là số trong khoảng -180 đến 180";
  if (!cinema.logo || !isValidUrl(cinema.logo)) errors.logo = "URL logo không hợp lệ";
  if (!cinema.opening_hours || cinema.opening_hours.trim() === "")
    errors.opening_hours = "Giờ mở cửa không được để trống";
  if (!cinema.description || cinema.description.trim() === "")
    errors.description = "Mô tả không được để trống";
  if (!cinema.status || cinema.status.trim() === "")
    errors.status = "Trạng thái không được để trống";

  // Kiểm tra các trường không bắt buộc nhưng nếu có thì phải hợp lệ
  if (cinema.phone_number && !/^\d{10,11}$/.test(cinema.phone_number))
    errors.phone_number = "Số điện thoại phải có 10-11 chữ số";
  if (cinema.email && !/\S+@\S+\.\S+/.test(cinema.email)) errors.email = "Email không hợp lệ";
  if (cinema.website && !isValidUrl(cinema.website)) errors.website = "Website không hợp lệ";
  if (cinema.capacity && (isNaN(cinema.capacity) || cinema.capacity < 0))
    errors.capacity = "Sức chứa phải là số không âm";

  return errors;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidForm = (errors) => {
  return Object.values(errors).every((error) => !error);
};
