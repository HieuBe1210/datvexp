import { useEffect, useState } from "react";
// import { CardPayment } from "../../components/Cards/Cards";
import "./Payment.scss";
import { CardPayment } from "./CardPayment";

export const Payment = () => {
  return (
    <>
      <div className="content">
        <CardPayment />
      </div>
    </>
  );
};
