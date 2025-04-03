import React from "react";
import "./LoadingScreen.scss";

export const LoadingScreen = ({ message = "Đang tải..." }) => {
  return (
    <div>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="message">{message}</p>
    </div>
  );
};

export default LoadingScreen;
