const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import {
  fetchOdersFromFirebase,
  cancelTicketFromFirebase,
  lockTicketFromFirebase,
} from "../firebase/firebaseOders.js";

// API LẤY DANH SÁCH ORDERS (TẤT CẢ HOẶC THEO EMAIL)
export const fetchOders = async (email, filters = {}, page = 1, limit = 15) => {
  return useFirebase
    ? await fetchOdersFromFirebase(email, filters, page, limit)
    : await fetchOdersFromSQL(email, filters, page, limit);
};

// API HUỶ VÉ
export const cancelTicket = async (ticketId) => {
  return useFirebase
    ? await cancelTicketFromFirebase(ticketId)
    : await cancelTicketFromSQL(ticketId);
};

// API KHOÁ VÉ
export const lockTicket = async (ticketId) => {
  return useFirebase ? await lockTicketFromFirebase(ticketId) : await lockTicketFromSQL(ticketId);
};
