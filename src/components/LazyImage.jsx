import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ src, alt, height, width, className }) => {
  // console.log("className truyền vào LazyImage:", className);
  return (
    <LazyLoadImage
      src={src} // Link ảnh
      alt={alt} // Text thay thế
      height={height}
      width={width}
      offset={100} // Load trước khi ảnh xuất hiện trong viewport
      effect="blur" // Hiệu ứng mờ khi tải
      className={className} // Áp dụng className truyền vào
    />
  );
};

export default LazyImage;
