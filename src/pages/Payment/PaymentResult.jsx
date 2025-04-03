import React from "react";
import { PaymentNotification } from "./PaymentNotification";

const PaymentResult = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const appTransId = searchParams.get("appTransId"); // Lấy appTransId từ URL

  return <PaymentNotification appTransId={appTransId} />;
};

export default PaymentResult;
