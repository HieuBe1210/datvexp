import {
  // fetchMoviesFromFirebase,
  fetchCarouselDataFromFirebase,
  getAccountFromFirebase,
  getAccountByEmailFromFirebase,
  fetchSeatsFromFirebase,
  fetchCinemasFromFirebase,
  updateAccountToFirebase,
  fetchMoviesByIdFromFirebase,
  updatePasswordInFirebase,
  searchFromFireBase,
} from "./firebaseService";
import {
  // fetchMoviesFromSQL,
  fetchCarouselDataFromSQL,
  fetchAccountFromSQL,
  fetchAccountByEmailFromSQL,
  fetchSeatsFromSQL,
  fetchCinemasFromSQL,
  fetchMoviesByIdFromSQL,
  updatePasswordInSQL,
  searchFromSQL,
} from "./sql/sqlService";
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG! // Chọn nguồn dữ liệu trong .env
// console.log("Value of VITE_USE_FIREBASE:", import.meta.env.VITE_USE_FIREBASE);

// Hàm Search
export const searchDataService = {
  getSearchSuggestions: async (query) => {
    console.log("Query received in dataService:", query);
    if (!query || typeof query !== "string") {
      console.error("Invalid query passed to dataService:", query);
      return [];
    }
    try {
      if (useFirebase) {
        return await searchFromFireBase.searchMovies(query);
      } else {
        return await searchFromSQL.searchMovies(query);
      }
    } catch (error) {
      console.error("Error in dataService:", error);
      return [];
    }
  },
};

// Hàm đổi mật khẩu
export const changePassword = async (email, oldPassword, newPassword) => {
  if (useFirebase) {
    // Sử dụng Firebase
    return await updatePasswordInFirebase(email, oldPassword, newPassword);
  } else {
    // Sử dụng SQL
    return await updatePasswordInSQL(email, oldPassword, newPassword);
  }
};

// API lấy dữ liệu Account
export const fetchAccount = async (account_id) => {
  return useFirebase
    ? await getAccountFromFirebase(account_id)
    : await fetchAccountFromSQL(account_id);
};

// API lấy dữ liệu cho MoviesBYID
export const fetchMoviesById = async (movie_id) => {
  return useFirebase
    ? await fetchMoviesByIdFromFirebase(movie_id)
    : await fetchMoviesByIdFromSQL(movie_id);
};

// API lấy dữ liệu cho Carousel
export const fetchCarouselData = async () => {
  return useFirebase ? await fetchCarouselDataFromFirebase() : await fetchCarouselDataFromSQL();
};

// API lấy Account By email
export const fetchAccountByEmail = async (email) => {
  return useFirebase
    ? await getAccountByEmailFromFirebase(email)
    : await fetchAccountByEmailFromSQL(email);
};
// API Update Account By email
export const updateAccount = async (formData) => {
  // console.log("Form data trước khi gọi updateAccountToFirebase:", formData);
  return useFirebase
    ? await updateAccountToFirebase(formData.email, formData)
    : await updateAccountToSQL(formData.email, formData);
};
// Hàm lấy dữ liệu Seats
export const fetchSeats = async () => {
  return useFirebase ? await fetchSeatsFromFirebase() : await fetchSeatsFromSQL();
};
// API lấy dữ liệu Cinemas
export const fetchCinemas = async () => {
  return useFirebase ? await fetchCinemasFromFirebase() : await fetchCinemasFromSQL();
};
