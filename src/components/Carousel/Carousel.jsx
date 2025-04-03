import { Carousel } from "antd";
import "./carousel.scss";
import { React, useState, useEffect } from "react";
import { CardCarousel } from "../Cards/Cards";
import { fetchCarouselData } from "../../../src/services/dataService";
import FullPageSkeleton from "../Skeleton/FullPageSkeleton";

export const CarouselSlide = () => {
  const [imgCarousel, setImgCarousel] = useState([]);
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading

  // Call API từ dataService
  useEffect(() => {
    const getData = async () => {
      try {
        const bannersArray = await fetchCarouselData();
        setImgCarousel(bannersArray);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Tắt trạng thái loading Skeleton
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="carousel_img">
        <Carousel autoplay>
          {loading ? (
            // Hiển thị loader khi đang tải dữ liệu
            <FullPageSkeleton />
          ) : (
            imgCarousel.map((item) => (
              <CardCarousel item={item} key={item.id} />
            ))
          )}
        </Carousel>
      </div>
    </>
  );
};
