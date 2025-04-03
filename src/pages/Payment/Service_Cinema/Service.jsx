import axios from "axios";
import { useEffect, useState } from "react";

export const Service = ({ setComboPrice, setSelectedService }) => {
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchDataService = async () => {
      try {
        const reponse = await axios.get(
          "https://vticinema-default-rtdb.firebaseio.com/MoreService.json"
        );
        const data = reponse.data;
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchDataService();
  }, []);

  return (
    <>
      {service ? (
        <Detai_Service
          service={service}
          setComboPrice={setComboPrice}
          setSelectedService={setSelectedService}
        />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export const Detai_Service = ({
  service,
  setComboPrice,
  setSelectedService,
}) => {
  const serviceEntries = Object.entries(service);
  const [quantities, setQuantities] = useState({});
  // const [selectedService, setSelectedService] = useState([]); // Lưu dịch vụ được chọn

  const handleQuantityChange = (key, serviceItem, quantity) => {
    if (quantity < 0) return;

    const newQuantities = { ...quantities, [key]: quantity };
    setQuantities(newQuantities);

    // Cập nhật danh sách dịch vụ đã chọn
    const updatedServices = serviceEntries
      .map(([k, item]) => ({
        key: k,
        ...item,
        quantity: newQuantities[k] || 0,
      }))
      .filter((item) => item.quantity > 0);

    setSelectedService(updatedServices); // Cập nhật dịch vụ đã chọn
    console.log("Updated services:", updatedServices); // Thêm log kiểm tra

    // Tính lại tổng giá dựa trên số lượng từng dịch vụ
    const totalPrice = updatedServices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setComboPrice(totalPrice); // Gửi tổng giá lên CardPayment
  };

  return (
    <>
      {serviceEntries.map(([key, serviceItem]) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr",
            alignItems: "center",
          }}
        >
          <div>
            <h2>{serviceItem.name_service}</h2>
          </div>
          <div>
            <h3>{serviceItem.describe}</h3>
          </div>
          <div className="quantity-control">
            <button
              className="quantity-btn decrease"
              onClick={() =>
                handleQuantityChange(
                  key,
                  serviceItem,
                  (quantities[key] || 0) - 1
                )
              }
              disabled={(quantities[key] || 0) <= 0}
            >
              −
            </button>
            <input
              type="number"
              className="quantity-input"
              value={quantities[key] || 0}
              min="0"
              readOnly
            />
            <button
              className="quantity-btn increase"
              onClick={() =>
                handleQuantityChange(
                  key,
                  serviceItem,
                  (quantities[key] || 0) + 1
                )
              }
            >
              +
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
