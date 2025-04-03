import { useEffect } from "react";

const useAutosizeTextarea = (textareaRef, value) => {
  useEffect(() => {
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // Reset chiều cao trước khi tính toán lại
      textarea.style.height = textarea.scrollHeight + "px"; // Gán chiều cao dựa trên nội dung
    }
  }, [textareaRef, value]); // Chạy lại khi giá trị thay đổi
};

export default useAutosizeTextarea;

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    console.error("Invalid coordinates:", { lat1, lon1, lat2, lon2 });
    return Infinity;
  }
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
