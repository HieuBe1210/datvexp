// HÀM ĐÓNG MODAL KHI LICK VÀO OVERLAY
export const closeModal = () => {
  const overlay = document.querySelector(".modal-overlay");
  const content = document.querySelector(".modal-content");

  if (overlay && content) {
    overlay.classList.add("fade-out");
    content.classList.add("scale-out");

    // Lắng nghe sự kiện transitionend để xử lý sau khi hiệu ứng hoàn tất
    const handleTransitionEnd = () => {
      overlay.style.display = "none"; // Ẩn Modal
      overlay.classList.remove("fade-out");
      content.classList.remove("scale-out");

      // Loại bỏ sự kiện lắng nghe để tránh lặp lại
      overlay.removeEventListener("transitionend", handleTransitionEnd);
    };

    overlay.addEventListener("transitionend", handleTransitionEnd);
  }
};

// HÀM ĐÓNG MODAL
export const handleClose = () => {
  setIsClosing(true); // Bật hiệu ứng fade-out
  setTimeout(() => {
    closeModal(); // Đóng modal sau 300ms
  }, 300);
};
