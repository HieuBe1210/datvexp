const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import { fetchBookingHistoryFromFirebase } from "../firebase/firebaseBooking.js";
// import { fetchBookingHistoryFromSQL } from "../sql/sqlBooking.js";

// API LẤY DANH SÁCH ORDERS THEO EMAIL
export const fetchBookingHistory = async (email) => {
  return useFirebase
    ? await fetchBookingHistoryFromFirebase(email)
    : await fetchBookingHistoryFromSQL(email);
};
