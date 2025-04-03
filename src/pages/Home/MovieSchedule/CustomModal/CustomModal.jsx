import React from "react";
import "./CustomModal.scss";

const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <div className="custom-modal-title">{title}</div>
        </div>
        <div className="custom-modal-body">{children}</div>
        <button className="modal-confirm-button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
