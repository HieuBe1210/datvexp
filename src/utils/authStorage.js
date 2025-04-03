const AUTH_TOKEN_KEY = "authToken";

// Lưu token vào LocalStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // console.log("Token đã được lưu:", token);
  }
};

// Lấy token từ LocalStorage
export const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    // console.log("Token đã được lấy:", token);
  } else {
    // console.warn("Không tìm thấy token trong LocalStorage");
  }
  return token;
};

// Xóa token khỏi LocalStorage
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  // console.log("Token đã bị xóa");
};
