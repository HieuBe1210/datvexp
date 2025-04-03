import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Seats } from "./Seats/Seats";
import { Timeout } from "./Timeout/Timeout";
import { Ticket_Detail } from "./Ticket_Detail/Ticket_Detail";
import { Price } from "./Timeout/Price";
import { toast } from "react-toastify";

export const CardSeats = ({ cinema, movie_id, cinema_id, showtime_id, date, time }) => {
  const [selectedSeatPrice, setSelectedSeatPrice] = useState(() => {
    return Number(localStorage.getItem("selectedSeatPrice")) || 0; // Lấy giá vé từ localStorage
  });
  const [selectSeatName, setSelectSeatName] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedSeatNames")) || []; // Lấy tên ghế từ localStorage
  });
  // const { movie_id } = useParams();
  const navigate = useNavigate();

  // Tải trạng thái chỗ đã lưu trước đó từ localStorage (nếu tồn tại)
  useEffect(() => {
    const savedSeatNames = JSON.parse(localStorage.getItem("selectedSeatNames")) || [];
    const savedSeatPrice = JSON.parse(localStorage.getItem("selectedSeatPrice")) || 0;

    setSelectSeatName(savedSeatNames);
    setSelectedSeatPrice(savedSeatPrice);
  }, []);

  // Lưu chỗ ngồi đã chọn và giá vào localStorage
  useEffect(() => {
    localStorage.setItem("selectedSeatNames", JSON.stringify(selectSeatName));
    localStorage.setItem("selectedSeatPrice", JSON.stringify(selectedSeatPrice));
  }, [selectSeatName, selectedSeatPrice]);

  const handlePayment = () => {
    if (selectSeatName.length === 0) {
      toast.warning("Vui lòng chọn ghế để tiếp tục");
      return;
    }
    navigate(`/payment/${movie_id}`, {
      state: {
        selectSeatName: selectSeatName,
        selectedSeatPrice: selectedSeatPrice,
        cinema: cinema,
        date: date,
        time: time,
        movie_id,
        cinema_id,
        showtime_id,
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("timerCount", 600);
  }, []);

  return (
    <>
      <div className="card_seat ">
        <div className="content_tab">
          <div className="col1">
            <img
              src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809663/ic-screen_qsvlrn.png"
              alt="màn chiếu"
            />

            <div className="row_seat">
              <div className="seat">
                <Seats
                  setSelectedSeatPrice={setSelectedSeatPrice}
                  setSelectSeatName={setSelectSeatName}
                  cinema_id={cinema_id} // Truyền thêm cinema_id
                  showtime_id={showtime_id} // Truyền thêm showtime_id
                />
              </div>
            </div>
            <div className="status_seat">
              <div className="status-seat__item">
                <img
                  src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809663/seat-unselect-normal_hygw6w.png"
                  alt="Ghế trống"
                />
                <p className="status-seat__lable">Ghế trống</p>
              </div>
              <div className="status-seat__item">
                <img
                  src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809662/seat-select-normal_nfev6o.png"
                  alt="Ghế đang chọn"
                />
                <p className="status-seat__lable">Ghế đang chọn</p>
              </div>

              <div className="status-seat__item">
                <img
                  src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809662/seat-process-normal_lzfigz.png"
                  alt="Ghế Ghế đang giữ"
                />
                <p className="status-seat__lable">Ghế đang giữ</p>
              </div>

              <div className="status-seat__item">
                <img
                  src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809662/seat-buy-normal_ryk3xl.png"
                  alt="Ghế ghế đã bán"
                />
                <p className="status-seat__lable">Ghế đã bán</p>
              </div>
            </div>
            <div className="row_price">
              <div className="timeout-wrapper timeout-wrapper-booking-seat">
                <p className="title_time_out">Thời gian đặt vé còn lại:</p>
                <div className="time_out">
                  <Timeout />
                </div>
              </div>
              <div className="price">
                <div className="title_price">
                  <p>Giá vé</p>
                  <div className="total_price">
                    <Price price={selectedSeatPrice} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col2">
            <div className="detail_movie">
              <Ticket_Detail seat_name={selectSeatName} />
              <button onClick={handlePayment}>Tiếp tục</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
