import {
  fetchPromotionsFromFirebase,
  fetchRelatedPromotionsFromFirebase,
  addEventToFirebase,
  updateEventInFirebase,
  deleteEventFromFirebase,
} from "../firebase/firebasePromotion";

const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

// API LẤY DANH SÁCH KHUYẾN MÃI
export const fetchPromotions = async () => {
  return useFirebase ? await fetchPromotionsFromFirebase() : await fetchPromotionsFromSQL();
};
// API LẮNG NGHE SỰ KIỆN KHUYẾN MÃI REALTIME
// export const subscribeToPromotions = (callback) => {
//   if (useFirebase) {
//     listenToPromotions(callback);
//   }
// };
// API LẤY DANH SÁCH KHUYẾN MÃI LIÊN QUAN
export const fetchRelatedPromotions = async (category, slug) => {
  return useFirebase
    ? await fetchRelatedPromotionsFromFirebase(category, slug)
    : await fetchRelatedPromotionsFromSQL(category, slug);
};

// THÊM SỰ KIỆN MỚI
export const addEvent = async (eventData) => {
  return useFirebase ? await addEventToFirebase(eventData) : await addEventToSQL(eventData);
};

// CẬP NHẬT SỰ KIỆN
export const updateEvent = async (eventId, eventData) => {
  return useFirebase
    ? await updateEventInFirebase(eventId, eventData)
    : await updateEventFromSQL(eventId, eventData);
};

// XÓA SỰ KIỆN
export const deleteEvent = async (eventId) => {
  return useFirebase ? await deleteEventFromFirebase(eventId) : await deleteEventFromSQL(eventId);
};
