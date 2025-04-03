import React from "react";
import { Modal } from "antd";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Fade,
} from "@mui/material";
import module from "./BookingDetailsModal.module.scss";
import ServiceOrders from "../../../Payment/Service_Cinema/ServiceOrders";
const BookingDetailsModal = ({
  isVisible,
  handleCancel,
  bookingData,
  services,
}) => {
  return (
    <Modal
      className={module.booking_details_container}
      title={
        <span className={module.booking_modal_title}>Thông tin giao dịch</span>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          onClick={handleCancel}
          className={module.booking_details_buttons}
        >
          Quay lại
        </Button>,
      ]}
    >
      {bookingData ? (
        <section className={module.booking_details}>
          <Grid container spacing={2}>
            {/* Mã giao dịch */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.app_trans_id}
              </Typography>
            </Grid>

            {/* Tên phim */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.movieName}
              </Typography>
            </Grid>

            {/* Hình thức */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.format}
              </Typography>
            </Grid>

            {/* Địa chỉ rạp */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.theater}
              </Typography>
            </Grid>

            {/* Ghế ngồi */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.room} -{" "}
                {bookingData.movieDetails?.seat}
              </Typography>
            </Grid>

            {/* Ngày chiếu */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.showDate}
              </Typography>
            </Grid>

            {/* Suất chiếu */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_value}
              >
                {bookingData.movieDetails?.showTime}
              </Typography>
            </Grid>

            {/* Dịch vụ */}
            <Grid item xs={4}>
              <Typography
                className={module.booking_details_title}
                variant="body1"
                align="left"
              >
                <strong>Dịch vụ kèm:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body1"
                align="right"
                className={module.booking_details_value}
              >
                <ServiceOrders services={bookingData.services} />
              </Typography>
            </Grid>

            {/* Tổng thanh toán */}
            <Grid item xs={6}>
              <Typography
                className={module.booking_details_title}
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
                className={module.booking_details_title}
              >
                {new Intl.NumberFormat("vi-VN").format(bookingData.amount)} VNĐ
              </Typography>
            </Grid>
          </Grid>
        </section>
      ) : (
        <p style={{ color: "red", textAlign: "center" }}>
          Không tìm thấy giao dịch!
        </p>
      )}
    </Modal>
  );
};

export default BookingDetailsModal;
