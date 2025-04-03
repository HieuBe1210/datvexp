import React from "react";
import { Modal } from "antd";

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  deleteType,
}) => {
  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          {deleteType === "comment"
            ? "Xác nhận xoá bình luận"
            : "Xác nhận xoá phản hồi"}
        </div>
      }
      open={isOpen}
      onOk={() => {
        onConfirm(); // Đảm bảo hàm này được gọi khi nhấn "Xóa"
        onClose(); // Đóng modal sau khi xóa
      }}
      onCancel={onClose}
      okText="Xoá"
      cancelText="Hủy"
      centered
      destroyOnClose={false} // Giữ nguyên state khi đóng/mở
      okButtonProps={{
        style: { backgroundColor: "#fa052cc9" },
      }}
      styles={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <p style={{ textAlign: "center" }}>
        Bạn chắc chắn muốn{" "}
        {deleteType === "comment" ? "xoá bình luận này" : "xoá phản hồi này"}{" "}
        không?
      </p>
    </Modal>
  );
};
