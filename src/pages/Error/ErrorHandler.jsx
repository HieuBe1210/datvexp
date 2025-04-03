import React from "react";

export const ErrorHandler = ({ title, message, image }) => {
  return (
    <div className="error-page">
      {/* Hiển thị tiêu đề lỗi */}
      <h1 className="title-error">{title}</h1>

      {/* Hiển thị hình ảnh minh họa lỗi */}
      <img className="image-error" src={image} alt="Error illustration" />

      {/* Hiển thị thông điệp lỗi */}
      <p className="message-error">{message}</p>
    </div>
  );
};
