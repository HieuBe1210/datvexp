const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import {
  fetchRegionsOfCinemasFromFirebase,
  fetchCinemasFromFirebase,
  fetchCinemasByRegionFromFirebase,
  sendContactInfoToFirebase,
  addCinemaToFirebase,
  fetchShowtimesFromFirebase,
  deleteCinemaFromFirebase,
  updateCinemaInFirebase,
} from "../firebase/firebaseCinemas.js";
import {
  fetchRegionsOfCinemasFromSQL,
  fetchCinemasFromSQL,
  sendContactInfoToSQL,
  fetchCinemasByRegionFromSQL,
  addCinemaToSQL,
} from "../sql/sqlCinemas.js";

// API LẤY DANH SÁCH TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchCinemas = async () => {
  return useFirebase ? await fetchCinemasFromFirebase() : await fetchCinemasFromSQL();
};
// API LẤY DANH SÁCH KHU VỰC CỦA TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchRegionsOfCinemas = async () => {
  return useFirebase
    ? await fetchRegionsOfCinemasFromFirebase()
    : await fetchRegionsOfCinemasFromSQL();
};
// API LẤY DANH SÁCH RẠP PHIM THEO KHU VỰC
export const fetchCinemasByRegion = async (region) => {
  return useFirebase
    ? await fetchCinemasByRegionFromFirebase(region)
    : await fetchCinemasByRegionFromSQL(region);
};

// API LẤY DỮ LIỆU SHOWTIMES
export const fetchShowtimes = async (cinema_id) => {
  return useFirebase
    ? await fetchShowtimesFromFirebase(cinema_id)
    : await fetchShowtimesFromSQL(cinema_id);
};

// API GỬI THÔNG TIN LIÊN HỆ
export const saveContactInfoToData = async (formData) => {
  return useFirebase
    ? await sendContactInfoToFirebase(formData)
    : await sendContactInfoToSQL(formData);
};

//API THÊM RẠP MỚI
export const addCinema = async (newCinema) => {
  return useFirebase ? await addCinemaToFirebase(newCinema) : await addCinemaToSQL(newCinema);
};

// API XÓA RẠP
export const deleteCinema = async (cinemaKey) => {
  return useFirebase
    ? await deleteCinemaFromFirebase(cinemaKey)
    : await deleteCinemaFromSQL(cinemaKey);
};

// API CHỈNH SỬA RẠP
export const updateCinema = async (cinemaKey, updatedCinema) => {
  return useFirebase
    ? await updateCinemaInFirebase(cinemaKey, updatedCinema)
    : await updateCinemaInSQL(cinemaKey, updatedCinema);
};
