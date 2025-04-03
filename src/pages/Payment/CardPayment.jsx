import React, { useState, useEffect } from "react";
import { getDatabase } from "firebase/database";
import { Service } from "./Service_Cinema/Service";
import { Timeout } from "../Booking_Seat/Timeout/Timeout";
import { Ticket_Detail } from "../Booking_Seat/Ticket_Detail/Ticket_Detail";
import { Price } from "../Booking_Seat/Timeout/Price";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Box, Typography, Button, Grid } from "@mui/material";
import combo from "../../assets/image/combo.webp";
import module from "./CardPayment.module.scss";
import ServiceOrders from "./Service_Cinema/ServiceOrders";
import LoadingIcon from "../../components/LoadingIcon";
import GuideModal from "../../components/GuideModal/GuideModal";

export const CardPayment = () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const db = getDatabase(); // Kết nối tới database Firebase
  const { state } = useLocation();
  const { selectSeatName, selectedSeatPrice } = state || {};
  const [comboPrice, setComboPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const totalPrice = selectedSeatPrice + comboPrice - discount;
  const handleCloseModal = () => setIsModalOpen(false);
  const [movieDetails, setMovieDetails] = useState(null); // Lưu thông tin phim
  const [selectedService, setSelectedService] = useState([]); // Lưu dịch vụ được chọn
  const [isLoading, setIsLoading] = useState(false);

  const [showGuide, setShowGuide] = useState(false); // State để hiển thị GuideModal
  useEffect(() => {
    setShowGuide(true); // Mở modal ngay khi vào CardPayment
  }, []);

  // Dữ liệu dịch vụ đi kèm
  const selectedServices = selectedService.map((service) => ({
    name: service.name_service,
    quantity: service.quantity,
    price: service.price * service.quantity,
  }));
  // console.log("Sending selected services to backend:", selectedServices);

  console.log("movieDetails in CardPayment:", movieDetails);
  const handlePayment = async () => {
    if (!movieDetails) {
      toast.error("Không tìm thấy thông tin phim để thanh toán.");
      return;
    }
    setIsLoading(true); // Bắt đầu hiển thị spinner
    const description = "Thanh toán vé xem phim"; // Nội dung thanh toán
    const email = userInfo?.email; // Lấy email truyền xuống BE để làm app_user
    try {
      // Gọi API server để tạo giao dịch.
      const response = await axios.post(
        "https://vticinema-zalopay-test.vercel.app/payment",
        // "https://81f0-2402-800-6344-e5b3-241b-be62-2d0c-272.ngrok-free.app/payment",
        {
          amount: totalPrice,
          description,
          email,
          services: selectedServices, // Thêm dịch vụ vào payload
          movieDetails, // Gửi thông tin phim lên BE
        }
      );
      if (response.data.order_url) {
        setSelectedService([]);
        setIsLoading(false); // Dừng spinner trước khi chuyển trang
        // Chuyển hướng người dùng đến URL thanh toán của ZaloPay
        window.location.href = response.data.order_url;
      } else {
        throw new Error("Không có URL thanh toán trong response.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi tạo giao dịch:", error);
      toast.error("Có lỗi xảy ra khi tạo giao dịch.");
      setIsLoading(false); // Dừng spinner khi gặp lỗi
    }
  };

  return (
    <>
      <div className="card_payment">
        <div className="content_tab">
          <div className="col1">
            {/*  */}
            <div className="person_inf_wrapper">
              <title>Thông tin thanh toán</title>
              <div className="person_inf">
                <div className="row_info">
                  <label htmlFor="">Họ tên</label>
                  <input type="text" value={userInfo?.fullname || userInfo?.displayName} readOnly />
                </div>
                <div className="row_info">
                  <label htmlFor="">Điện thoại</label>
                  <input type="text" value={userInfo?.phone || "Không có"} readOnly />
                </div>
                <div className="row_info">
                  <label htmlFor="">Email</label>
                  <input type="email" value={userInfo?.email} readOnly />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="service">
              <title>Dịch vụ kèm</title>
              <div className="lable_service">
                <div>
                  <label htmlFor="">Tên combo </label>
                </div>
                <div>
                  <label htmlFor="">Mô tả </label>
                </div>
                <div>
                  <label htmlFor="">Số lượng </label>
                </div>
              </div>
              <div className="service_data">
                <img className="combo_img" src={combo} alt="Combo ưu đãi" />
                <Service setComboPrice={setComboPrice} setSelectedService={setSelectedService} />
              </div>
            </div>
            {/*  */}
            <div className="voucher">
              <title>Giảm giá</title>
              {/* <span>VTI voucher (Nhấn vào đây để xem danh sách voucher)</span>
              <div className="button">
                <button>Đổi điểm</button>
              </div> */}
              <div className="code_voucher">
                <label htmlFor="">Mã voucher</label>
                <select onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}>
                  <option value="0">---</option>
                  <option value="5000">Mã giảm giá 5000đ</option>
                  <option value="10000">Mã giảm giá 10.000đ</option>
                  <option value="20000">Mã giảm giá 20.000đ</option>
                </select>
              </div>
              {/* <div className="point_voucher">
                <div>
                  <label htmlFor="">Điểm hiện có</label>
                  <input type="text" />
                </div>
                <div>
                  <label htmlFor="">Nhập điểm</label>
                  <input type="text" />
                </div>
              </div> */}
              {/*  */}
              <div className="price">
                <div class="title_price">
                  <p>Số tiền được giảm: </p>
                  <p>{discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ</p>
                </div>
                <div className="title_price">
                  <p>Số tiền cần thanh toán: </p>
                  <div className="total_price">
                    <Price price={totalPrice} />
                  </div>
                </div>
              </div>
            </div>
            <div className="timeout-wrapper">
              <div>
                <span>Vui lòng kiểm tra lại thông tin</span> <br /> <br />
                <span>* Vé mua rồi không hoàn trả lại dưới mọi hình thức</span>
              </div>

              <div>
                <p className="title_time_out">Thời gian đặt vé còn lại: </p>
                <div className="time_out">
                  <Timeout />
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col2">
            <title>Thông tin vé</title>
            <div className="detail_movie">
              <Ticket_Detail
                seat_name={selectSeatName}
                onFetchMovieDetails={setMovieDetails} // Lấy thông tin phim từ Ticket_Detail
              />
              <button onClick={handleOpenModal} disabled={!movieDetails}>
                Thanh toán
              </button>
            </div>
          </div>
        </div>
        <div className="modal-confirm-booking">
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: "2rem",
                  color: "#e74c3c",
                  marginBottom: "10px",
                }}
              >
                Xác nhận thông tin
              </Typography>
              <Box sx={{ fontSize: "1.4rem" }}>
                <div>
                  <Ticket_Detail seat_name={selectSeatName} showImage={false} />
                  {/* Dịch vụ */}
                  <div>
                    <Grid item xs={4}>
                      <Typography variant="body1" align="left">
                        <strong className={module.service_order_label}>Dịch vụ kèm:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Box sx={{ textAlign: "right", marginRight: "10px" }}>
                        {/* Lấy danh sách dịch vụ đã Orders */}
                        <div>
                          <ServiceOrders
                            services={selectedServices}
                            className={module.service_order_value}
                          />
                        </div>
                      </Box>
                    </Grid>
                  </div>
                </div>
                <div
                  style={{
                    lineHeight: 1.5,
                    marginTop: "5px",
                    fontWeight: "600",
                    textAlign: "right",
                    padding: "20px",
                  }}
                >
                  <div>
                    <p>Tổng thanh toán</p>
                    <Price price={totalPrice} />
                  </div>
                </div>
                <Typography sx={{ fontSize: "1.4rem", color: "red" }}>
                  (Khi bấm xác nhận sẽ chuyển đến trang thanh toán)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "10px",
                  }}
                >
                  <Button onClick={handleCloseModal} sx={{ fontSize: "1.2rem" }} color="secondary">
                    Hủy
                  </Button>
                  <Button
                    onClick={handlePayment}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                    disabled={isLoading} // Vô hiệu hóa nút khi đang gửi
                  >
                    {isLoading ? <LoadingIcon /> : "Xác nhận"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
      {/* Hiển thị GuideModal */}
      {showGuide && <GuideModal autoOpen={true} />}
    </>
  );
};
