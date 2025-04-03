import axios from "axios";
import {
  getDatabase,
  ref,
  get,
  onValue,
  set,
  push,
  update,
  remove,
  runTransaction,
} from "firebase/database";
import { getAuth } from "firebase/auth";

const auth = getAuth();

// API LẤY DANH SÁCH KHUYẾN MÃI TỪ FIREBASE
export const fetchPromotionsFromFirebase = async () => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khuyến mãi từ Firebase:", error);
    return [];
  }
};

// API LẮNG NGHE KHI CÓ THAY ĐỔI TRONG DANH SÁCH KHUYẾN MÃI (REALTIME)
// export const listenToPromotions = (callback) => {
//   const db = getDatabase();
//   const promotionsRef = ref(db, "Promotions");

//   onValue(promotionsRef, (snapshot) => {
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       const promoList = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//       callback(promoList);
//     } else {
//       callback([]);
//     }
//   });
// };

// API LẤY CHI TIẾT SỰ KIỆN THEO SLUG
export const fetchPromotionBySlug = async (slug) => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const event = Object.values(data).find((item) => item.slug === slug);
      return event || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sự kiện:", error);
    return null;
  }
};
// API LẤY DANH SÁCH KHUYẾN MÃI LIÊN QUAN
export const fetchRelatedPromotionsFromFirebase = async (category, slug) => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((promo) => promo.category === category && promo.slug !== slug); // Loại bỏ bài viết hiện tại
      // .slice(0, 4); // Giới hạn hiển thị 4 bài viết liên quan
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khuyến mãi liên quan:", error);
    return [];
  }
};

// THÊM SỰ KIỆN MỚI
export const addEventToFirebase = async (eventData) => {
  try {
    const db = getDatabase();
    const newEventRef = push(ref(db, "Promotions"));
    await set(newEventRef, eventData);
    return newEventRef.key;
  } catch (error) {
    console.error("Lỗi khi thêm sự kiện mới:", error);
    throw error;
  }
};

// CẬP NHẬT SỰ KIỆN
export const updateEventInFirebase = async (eventId, eventData) => {
  try {
    const db = getDatabase();
    const eventRef = ref(db, `Promotions/${eventId}`);

    // Chuẩn hóa dữ liệu, loại bỏ các giá trị undefined
    const cleanedEventData = Object.fromEntries(
      Object.entries(eventData).filter(([_, value]) => value !== undefined)
    );
    // Chuẩn hóa dữ liệu trước khi cập nhật
    const updatedEventData = {
      ...eventData,
      startDate: eventData.startDate || new Date().toISOString().split("T")[0], // Đảm bảo có giá trị mặc định
      endDate: eventData.endDate || new Date().toISOString().split("T")[0],
      views: eventData.views || 0, // Giữ nguyên số lượt xem nếu không có trong eventData
      likes: eventData.likes || 0, // Giữ nguyên số lượt thích nếu không có trong eventData
      slug:
        eventData.slug ||
        eventData.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      updatedAt: new Date().toISOString(), // Thêm thời gian cập nhật
    };

    // Cập nhật dữ liệu vào Firebase
    await update(eventRef, updatedEventData);
    console.log(`Sự kiện ${eventId} đã được cập nhật thành công`);
    return true; // Trả về true để báo hiệu thành công
  } catch (error) {
    console.error("Lỗi khi cập nhật sự kiện:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// XÓA SỰ KIỆN
export const deleteEventFromFirebase = async (eventId) => {
  try {
    const db = getDatabase();
    const eventRef = ref(db, `Promotions/${eventId}`);
    await remove(eventRef);
  } catch (error) {
    console.error("Lỗi khi xóa sự kiện:", error);
    throw error;
  }
};
