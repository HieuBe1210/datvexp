import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

/**
 * Component RenderRatingStars
 * @param {function} onRatingSelect - Hàm callback được gọi khi chọn số sao
 * @param {number} rating - Số sao ban đầu (props từ parent)
 * @param {boolean} disabled - Trạng thái vô hiệu hóa thao tác
 */
const RenderRatingStars = ({ onRatingSelect, rating, disabled = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0); // Số sao khi hover
  const [selectedRating, setSelectedRating] = useState(0); // Số sao đã chọn

  // Cập nhật số sao đã chọn khi props `rating` thay đổi
  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  // Xử lý hover qua một ngôi sao
  const handleMouseEnter = (rating) => {
    if (!disabled) setHoveredRating(rating); // Chỉ cho phép hover khi không disabled
  };

  // Xử lý khi rời chuột khỏi ngôi sao
  const handleMouseLeave = () => {
    if (!disabled) setHoveredRating(0); // Reset hover khi không disabled
  };

  // Xử lý click chọn số sao
  const handleRatingClick = (rating) => {
    if (!disabled) {
      if (selectedRating === rating) {
        // Nếu click vào số sao đã chọn, reset về 0
        setSelectedRating(0);
        if (onRatingSelect) onRatingSelect(0); // Gửi trạng thái 0 về parent
      } else {
        // Chọn số sao mới
        setSelectedRating(rating);
        if (onRatingSelect) onRatingSelect(rating); // Gửi số sao mới về parent
      }
    }
  };

  return (
    <div className={`rating-stars ${disabled ? "disabled" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star} // Mỗi ngôi sao cần key duy nhất
          className={`star ${
            star <= Math.max(hoveredRating, selectedRating) ? "filled" : "empty"
          }`}
          onMouseEnter={() => handleMouseEnter(star)} // Hover qua sao
          onMouseLeave={handleMouseLeave} // Rời chuột khỏi sao
          onClick={() => handleRatingClick(star)} // Click chọn hoặc reset sao
        >
          <FontAwesomeIcon icon={solidStar} />
        </span>
      ))}
    </div>
  );
};

export default RenderRatingStars;
