import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper, Button, Grid, Fade } from "@mui/material";
import { getDatabase, ref, onValue, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import module from "./PaymentNotification.module.scss";
import ServiceOrders from "./Service_Cinema/ServiceOrders";

export const PaymentNotification = ({ appTransId }) => {
  const [status, setStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();
  const db = getDatabase(); // Kết nối tới database Firebase

  useEffect(() => {
    if (!appTransId) {
      console.error("Thiếu appTransId để lắng nghe trạng thái");
      setStatus("not_found");
      return;
    }
    const db = getDatabase(); // Kết nối Firebase Realtime Database
    const orderRef = ref(db, `Orders/${appTransId}`); // Tham chiếu giao dịch

    // Lắng nghe sự thay đổi trạng thái từ Firebase
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Dữ liệu Firebase:", data); // In toàn bộ dữ liệu giao dịch
        setStatus(data.status); // Cập nhật trạng thái
        setPaymentData(data); // Lưu thông tin giao dịch

        // Nếu giao dịch thành công, cập nhật trạng thái ghế
        if (data.status === "success") {
          console.log("Gọi hàm updateSeatStatus với data:", data);
          updateSeatStatus(data);
        }
      } else {
        setStatus("not_found");
        console.error("Không tìm thấy giao dịch:", appTransId);
      }
    });

    return () => unsubscribe(); // Cleanup listener khi component bị unmount
  }, [appTransId]);

  // Hàm cập nhật trạng thái ghế
  const updateSeatStatus = async (data) => {
    let movieDetails = data.movieDetails;
    if (!movieDetails && data.embed_data) {
      try {
        movieDetails = JSON.parse(data.embed_data).movieDetails;
      } catch (error) {
        console.error("Lỗi khi parse embed_data:", error);
        return;
      }
    }

    if (!movieDetails) {
      console.error("Không tìm thấy movieDetails trong data hoặc embed_data:", data);
      return;
    }

    const { cinema_id, showtime_id, seat } = movieDetails;

    if (!cinema_id || !showtime_id || !seat) {
      console.error("Thiếu thông tin cần thiết để cập nhật ghế:", { cinema_id, showtime_id, seat });
      return;
    }

    const seats = seat.split(", ").map((seatName) => seatName.trim().toLowerCase()); // Chuẩn hóa seatName thành chữ thường
    console.log(`Đường dẫn seatsRef: Bookings/${showtime_id}/seats`);
    console.log("Danh sách ghế cần cập nhật:", seats);

    try {
      const seatsRef = ref(db, `Bookings/${showtime_id}/seats`);
      const snapshot = await get(seatsRef);
      if (!snapshot.exists()) {
        console.error(`Không tìm thấy ghế trong suất chiếu ${showtime_id}`);
        return;
      }

      const seatsData = snapshot.val();
      console.log("Dữ liệu ghế từ Firebase:", seatsData);

      const updates = {};

      for (const seatName of seats) {
        if (seatsData[seatName]) {
          console.log(`Trạng thái ghế ${seatName} trước khi cập nhật:`, seatsData[seatName]);
          // Chỉ cập nhật nếu ghế đang ở trạng thái "reserved"
          if (seatsData[seatName].status === "reserved") {
            updates[seatName] = {
              status: "sold",
              user: null,
              timestamp: null,
            };
            console.log(`Ghế ${seatName} đã được cập nhật thành "sold"`);
          } else {
            console.warn(
              `Ghế ${seatName} không ở trạng thái "reserved", trạng thái hiện tại: ${seatsData[seatName].status}`
            );
          }
        } else {
          console.error(`Không tìm thấy ghế ${seatName} trong Firebase`);
        }
      }

      if (Object.keys(updates).length > 0) {
        // Cập nhật tất cả ghế cùng lúc
        await update(seatsRef, updates);
        console.log("Đã cập nhật trạng thái ghế thành công:", updates);
      } else {
        console.log("Không có ghế nào được cập nhật, kiểm tra trạng thái ghế hoặc danh sách ghế.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái ghế:", error);
    }
  };

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === "not_found") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Giao dịch thất bại! {paymentData ? `Mã lỗi: ${paymentData.errorCode}` : ""}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={1000}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        className={module.notification_overlay}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, borderRadius: 2, maxWidth: 400 }}
          className={module.notification_container}
        >
          {status === "success" ? (
            <>
              <Typography
                variant="h5"
                color="success.main"
                textAlign="center"
                className={module.success_title}
              >
                Giao dịch thành công!
              </Typography>
              {paymentData && (
                <section className="notification-container">
                  <Grid container spacing={2}>
                    {/* Mã giao dịch */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Mã giao dịch:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {appTransId}
                      </Typography>
                    </Grid>

                    {/* Tên phim */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Tên phim:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.movieName}
                      </Typography>
                    </Grid>

                    {/* Hình thức */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Hình thức:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.format}
                      </Typography>
                    </Grid>

                    {/* Địa chỉ rạp */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Rạp:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.theater}
                      </Typography>
                    </Grid>

                    {/* Ghế ngồi */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Phòng - Ghế ngồi:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.room} - {paymentData.movieDetails?.seat}
                      </Typography>
                    </Grid>

                    {/* Ngày chiếu */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Ngày chiếu:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.showDate}
                      </Typography>
                    </Grid>

                    {/* Suất chiếu */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Suất chiếu:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.showTime}
                      </Typography>
                    </Grid>

                    {/* Dịch vụ */}
                    <Grid item xs={4}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Dịch vụ kèm:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Box className={module.notification_value} sx={{ textAlign: "right" }}>
                        {/* Lấy danh sách dịch vụ đã Orders */}
                        <ServiceOrders services={paymentData.services} />
                      </Box>
                    </Grid>

                    {/* Tổng thanh toán */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Tổng thanh toán:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_title}
                      >
                        {new Intl.NumberFormat("vi-VN").format(paymentData.amount)} VNĐ
                      </Typography>
                    </Grid>
                  </Grid>
                </section>
              )}
              <Box mt={2}>
                <Button
                  className={module.action_buttons}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/")}
                >
                  Quay lại trang chủ
                </Button>
                <Button
                  className={module.action_buttons}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate("/members?tab=booking-history")}
                >
                  Xem lịch sử giao dịch
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                color="error.main"
                textAlign="center"
                className={module.error_title}
              >
                Giao dịch thất bại!
              </Typography>
              <Button
                className={module.action_buttons}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate("/payment")}
              >
                Thử lại
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};
