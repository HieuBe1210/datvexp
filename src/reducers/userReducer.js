// Trạng thái ban đầu của người dùng
const initialState = {
  isLoggedIn: false,
  name: "",
  email: "",
  imageUrl: "",
};

// Reducer xử lý trạng thái đăng nhập
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        name: action.payload.name,
        email: action.payload.email,
        imageUrl: action.payload.imageUrl,
      };
    default:
      return state;
  }
};

export default userReducer;
