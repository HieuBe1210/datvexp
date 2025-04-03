import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingIcon = ({ size }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-block",
        borderRadius: "50%",
      }}
    >
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
};

export default LoadingIcon;
