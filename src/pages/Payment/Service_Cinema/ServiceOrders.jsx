import React from "react";
import { Box, Typography } from "@mui/material";
import module from "./ServiceOrders.module.scss";

const ServiceOrders = ({ services }) => {
  return (
    <Box>
      {services && services.length > 0 ? (
        services.map((service, index) => (
          <Typography
            key={index}
            variant="body2"
            className={module.service_order_value}
          >
            {service.name} - {service.quantity} x{" "}
            {new Intl.NumberFormat("vi-VN").format(service.price)} VNĐ
          </Typography>
        ))
      ) : (
        <Typography variant="body2" className={module.service_order_value}>
          Không có dịch vụ nào
        </Typography>
      )}
    </Box>
  );
};

export default ServiceOrders;
