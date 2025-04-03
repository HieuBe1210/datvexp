import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Zoom,
  Button,
} from "@mui/material"; // Các thành phần giao diện từ Material-UI
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon trợ giúp
import CloseIcon from "@mui/icons-material/Close"; // Icon đóng Modal
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "./GuideModal.module.scss";
import classNames from "classnames";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const GuideModal = ({ autoOpen = false }) => {
  // State quản lý trạng thái mở/đóng của Modal
  const [isClosing, setIsClosing] = useState(false); // Trạng thái thu nhỏ (animation khi đóng)
  const [isOpening, setIsOpening] = useState(false); // Trạng thái phóng to (animation khi mở lại)
  const [open, setOpen] = useState(autoOpen);

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  // Hàm xử lý đóng Modal
  const handleClose = () => {
    setIsClosing(true); // Kích hoạt hiệu ứng thu nhỏ
    setTimeout(() => {
      setOpen(false); // Đóng Modal sau khi hoàn tất hiệu ứng
      setIsClosing(false); // Reset trạng thái animation
    }, 500); // Thời gian animation (500ms)
  };

  // Hàm xử lý mở lại Modal
  const handleReopen = () => {
    setIsOpening(true); // Kích hoạt hiệu ứng phóng to
    setOpen(true); // Hiển thị Modal
    setTimeout(() => {
      setIsOpening(false); // Reset trạng thái animation
    }, 500); // Thời gian animation (500ms)
  };
  // Hàm sao chép nội dung vào clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!"); // Thông báo người dùng
  };
  return (
    <>
      {/* Hiển thị Modal (Dialog) nếu đang mở hoặc trong trạng thái animation */}
      {(open || isClosing || isOpening) && (
        <Dialog
          open={open} // Trạng thái mở/đóng của Modal
          onClose={handleClose} // Đóng Modal khi nhấn overlay
          disableScrollLock={true} // Không khóa cuộn trang khi Modal hiển thị
          scroll="body" // Nội dung Modal không khóa cuộn
          maxWidth="sm" // Giới hạn chiều rộng tối đa
          fullWidth // Cho phép Modal chiếm toàn bộ chiều rộng trên mobile
          PaperProps={{
            // Gán class animation cho phần tử Modal
            className: `${isClosing ? styles.modalShrink : ""} ${
              isOpening ? styles.modalExpand : ""
            }`,
            style: {
              minWidth: "300px", // Đảm bảo modal không quá nhỏ
            },
          }}
          aria-labelledby="guide-modal-title" // Thẻ `aria` để tăng khả năng truy cập
        >
          {/* Tiêu đề của Modal */}
          <DialogTitle id="guide-modal-title" className={styles.guide__title}>
            Hướng dẫn sử dụng Web
            {/* Nút đóng Modal */}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {/* Nội dung Modal */}
          <DialogContent>
            <p className={styles.guide_intro}>
              Sau khi chọn phim và đặt vé, bạn cần tài khoản để thanh toán. Do
              dó Team phát triển cung cấp các tài khoản thanh toán để bạn trải
              nghiệm Webside
            </p>
            <div className={styles.guide_content}>
              <strong className={styles.guide_intro}>
                1. Thanh toán bằng App ZaloPay :
              </strong>
              <a
                href="https://beta-docs.zalopay.vn/docs/developer-tools/test-instructions/test-wallets/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tải App tại đây (bản thử nghiệm)
              </a>
            </div>

            <div className={styles.guide_content}>
              <p className={styles.guide_intro}>
                2. Thanh toán bằng thẻ Visa, Master, JCB
              </p>
              <p>
                <strong className={styles.title_card}>Số thẻ :</strong>{" "}
                4111111111111111{" "}
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("4111111111111111")}
                >
                  Copy
                </Button>
                <br />
                <strong className={styles.title_card}>Tên :</strong> NGUYEN VAN
                A
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("NGUYEN VAN A")}
                >
                  Copy
                </Button>
                <br />
                <strong className={styles.title_card}>
                  Ngày hết hạn :
                </strong>{" "}
                01/26 <br />
                <strong className={styles.title_card}>Mã CVV :</strong> 123
              </p>
              <FontAwesomeIcon icon={faCheck} className={styles.check_icon} />
            </div>
            <div
              className={classNames(styles.guide_content, styles.guide_intro)}
            >
              3. Để trải nghiệm giao diện quản lý vui lòng liên hệ Team phát
              triển để được cung cấp tài khoản Admin thông qua email:{" "}
              <Link to="mailto:mock2406@gmail.com">mock2406@gmail.com</Link>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Action Button (FAB) để mở lại Modal */}
      {!open && !isOpening && (
        <Zoom in>
          <Fab
            color="primary" // Màu sắc của FAB
            onClick={handleReopen} // Xử lý mở lại Modal
            className={styles.reopenButton} // Class CSS cho FAB
          >
            <HelpOutlineIcon className="help=icon" /> {/* Icon trợ giúp */}
          </Fab>
        </Zoom>
      )}
    </>
  );
};

export default GuideModal;
