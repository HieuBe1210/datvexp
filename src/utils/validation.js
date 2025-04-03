// KIỂM TRA EMAIL HOẶC SỐ ĐIỆN THOẠI
export const validateEmailOrPhone = (value) => {
  if (!value) return "Vui lòng nhập email hoặc số điện thoại";

  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Định dạng email cơ bản
  const phonePattern = /^[0-9]{10}$/; // Định dạng cho số điện thoại 10 chữ số

  if (emailPattern.test(value)) {
    return ""; // Hợp lệ với email
  } else if (phonePattern.test(value)) {
    return ""; // Hợp lệ với số điện thoại
  } else {
    return "Vui lòng nhập đúng email hoặc số điện thoại";
  }
};

// KIỂM TRA MẬT KHẨU (VÍ DỤ: YÊU CẦU TỐI THIỂU 6 KÝ TỰ)
export const validatePassword = (password) => {
  if (!password) return "Vui lòng nhập mật khẩu";
  return password.length >= 6 ? "" : "Mật khẩu phải có ít nhất 6 ký tự";
};

// HÀM TỔNG HỢP ĐỂ VALIDATE TOÀN BỘ FORM ĐĂNG NHẬP
export const validateLoginForm = ({ emailOrPhone, password }) => {
  return {
    emailOrPhone: validateEmailOrPhone(emailOrPhone),
    password: validatePassword(password),
  };
};

// HÀM KIỂM TRA HỢP LỆ CỦA TRƯỜNG "HỌ VÀ TÊN"
export const validateName = (name) => {
  if (!name) return "Họ và tên không được để trống";
  if (name.length < 4) return "Họ và tên phải có ít nhất 4 ký tự";
  return "";
};

// HÀM KIỂM TRA HỢP LỆ CỦA TRƯỜNG "EMAIL"
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) return "Email không được để trống";
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return "";
};

// HÀM KIỂM TRA HỢP LỆ CỦA TRƯỜNG "SỐ ĐIỆN THOẠI"
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?(\d.*){10,}$/;
  if (!phone) return "Số điện thoại không được để trống";
  if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
  return "";
};

// HÀM KIỂM TRA HỢP LỆ CỦA TRƯỜNG "NHẬP LẠI MẬT KHẨU"
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Vui lòng nhập lại mật khẩu";

  // So sánh "Nhập lại mật khẩu" với "Mật khẩu"
  if (confirmPassword !== password) return "Mật khẩu không khớp";
  return "";
};

// CHUẨN HOÁ KÝ TỰ IN HOA CHỮ CÁI MỖI TỪ (DÙNG CHO TÊN ĐỊA DANH)
export const normalizeString = (str) => {
  if (!str) return ""; // Kiểm tra chuỗi null hoặc undefined
  return str
    .trim() // Loại bỏ khoảng trắng thừa
    .toLowerCase() // Chuyển chuỗi về chữ thường
    .split(" ") // Tách chuỗi thành mảng từ
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết in hoa chữ cái đầu mỗi từ
    .join(" "); // Ghép lại thành chuỗi
};

//  CHUYỂN ĐỔI NGÀY PHÁT HÀNH TỪ ĐỊNH DẠNG DD-MM-YYYY THÀNH ĐỐI TƯỢNG DATE
export const parseReleaseDate = (releaseDateStr) => {
  try {
    if (!releaseDateStr) return null;
    if (/\d{2}-\d{2}-\d{4}/.test(releaseDateStr)) {
      const [day, month, year] = releaseDateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    }
    throw new Error("Invalid date format");
  } catch (error) {
    console.error("Error parsing release date:", error);
    return null;
  }
};
