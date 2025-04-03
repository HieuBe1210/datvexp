import React, { useEffect, useState } from "react";

const TagSelector = ({ onSelectTags, selectedTags }) => {
  const availableTags = [
    "Tuyệt vời!",
    "Hài lòng",
    "Cảm động",
    "Đáng xem",
    "Hài hước",
    "Siêu phẩm",
    "Tạm được!",
  ];

  const [internalTags, setInternalTags] = useState(selectedTags || []);

  // Đồng bộ tags khi parent cập nhật
  useEffect(() => {
    setInternalTags(selectedTags || []);
  }, [selectedTags]);

  const handleTagToggle = (tag) => {
    const updatedTags = internalTags.includes(tag)
      ? internalTags.filter((t) => t !== tag) // Bỏ tag nếu đã được chọn
      : [...internalTags, tag]; // Thêm tag nếu chưa được chọn

    setInternalTags(updatedTags);
    onSelectTags(updatedTags); // Truyền tags đã chọn lên parent
  };

  return (
    <div className="tag-selector">
      <p className="tag-title">Chọn cảm xúc của bạn:</p>
      <div className="tags-list">
        {availableTags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${
              internalTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
