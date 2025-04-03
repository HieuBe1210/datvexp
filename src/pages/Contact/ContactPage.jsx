import "./ContactPage.modul.scss";
import React, { useState, useEffect } from "react";
import {
  services,
  serviceDetails,
  validateField,
  getCurrentDate,
} from "./ServiceContact";
import { toast } from "react-toastify";
import { saveContactInfoToData } from "../../services/service/serviceCinemas.js";
import {
  fetchRegionsOfCinemas,
  fetchCinemasByRegion,
} from "../../services/service/serviceCinemas.js";
import { normalizeString } from "../../utils/validation.js";
import { Link } from "react-router-dom";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    region: "",
    cinema: "",
    details: "",
    date: getCurrentDate(), // Gửi kèm ngày đã được định dạng
    status: "Chưa xử lý",
  });
  const [selectedService, setSelectedService] = useState(0); // Theo dõi dịch vụ được chọn
  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]); // Danh sách khu vực
  const [cinemaList, setCinemaList] = useState([]); // Danh sách rạp theo khu vực
  const [detailsLength, setDetailsLength] = useState(0);
  const maxLength = 300; // Giới hạn ký tự tối đa

  useEffect(() => {
    const loadRegions = async () => {
      const allRegions = await fetchRegionsOfCinemas(); // Lấy danh sách khu vực từ Firebase
      setRegions(allRegions);
    };
    loadRegions();
  }, []);
  const handleRegionChange = async (e) => {
    const selectedRegion = normalizeString(e.target.value); // Chuẩn hóa region
    // Lấy danh sách rạp từ Firebase
    const cinemas = await fetchCinemasByRegion(selectedRegion);
    // Cập nhật state
    setCinemaList(cinemas); // Cập nhật danh sách rạp
    setFormData((prevFormData) => ({
      ...prevFormData,
      region: selectedRegion,
      cinema: "", // Reset rạp khi đổi khu vực
    }));
  };
  // Cập nhật khi nhấn vào dịch vụ bên trái
  const handleServiceClick = (index) => {
    setSelectedService(index);
    setFormData({ ...formData, service: services[index] });
  };
  const handleServiceChange = (event) => {
    const index = services.indexOf(event.target.value);
    if (index !== -1) {
      setSelectedService(index);
      setFormData({ ...formData, service: event.target.value });
    }
  };
  // Xử lý kiểm tra lỗi khi rời khỏi trường nhập liệu
  const handleBlur = (field) => {
    const error = validateField(field, formData[field]); // Kiểm tra lỗi dựa trên trường và giá trị
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái chờ khi submit

  // Kiểm tra toàn bộ form trước khi submit
  const handleValidation = () => {
    const validationErrors = {};
    // Kiểm tra từng trường
    Object.keys(formData).forEach((field) => {
      validationErrors[field] = validateField(field, formData[field]);
    });
    setErrors(validationErrors);
    // Trả về true nếu có lỗi
    return Object.values(validationErrors).some((error) => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setDetailsLength(value.length); // Cập nhật độ dài chuỗi
  };
  //  Hiển thị trạng thái loading
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Bắt đầu trạng thái loading
    // Kiểm tra lỗi trong form
    if (handleValidation() || handleBlur()) {
      setIsSubmitting(false);
      return;
    } // Hiển thị trạng thái chờ
    try {
      await saveContactInfoToData(formData); // Lưu dữ liệu lên Firebase
      // Hiển thị thông báo thành công
      toast.success("Gửi thông tin thành công!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        region: "",
        cinema: "",
        details: "",
        date: getCurrentDate(), // Gửi kèm ngày đã được định dạng
        status: "Chưa xử lý",
      });
      // console.log(formData.date);
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
    } finally {
      setIsSubmitting(false); // Cập nhật trạng thái gửi
    }
  };

  return (
    <div className="contact-page content">
      {/* Banner & Intro Section */}
      <div className="sidebar-banner">
        <Link to="tel:19001999">
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733633927/adverts_obings.jpg"
            alt="Liên hệ quảng cáo"
          />
        </Link>
      </div>
      <div className="intro-section">
        <div className="left-banner">
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733544889/contact_1_z9gr0y.jpg"
            alt="Banner quảng cáo"
          />
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733544889/contact_2_chb5fd.jpg"
            alt="Banner quảng cáo"
          />
        </div>
        <div className="intro-text">
          <h1 className="title">
            LIÊN HỆ QUẢNG CÁO TẠI RẠP / MUA VÉ NHÓM <br /> THUÊ RẠP TỔ CHỨC SỰ
            KIỆN / MUA PHIẾU QUÀ TẶNG
          </h1>
          <p>
            Bạn có nhu cầu quảng cáo trên màn hình cực lớn tại rạp, tiếp cận
            đông đảo khách xem phim tại rạp.
          </p>
          <p>
            Bạn cần tăng cường nhận diện thương hiệu, tạo ra doanh thu lợi nhuận
            cho công ty.
          </p>
          <p>
            Bạn cần thưởng thức các bộ phim bom tấn riêng tư cùng gia đình, bạn
            bè, đồng nghiệp.
          </p>
          <p>
            Bạn cần một địa điểm tổ chức sự kiện, họp báo ra mắt dự án, tổ chức
            fan offline, đào tạo tập trung Bạn đang tìm kiếm quà tặng gửi tới
            người thân yêu.
          </p>
          <p>Hãy liên hệ ngay với VTI Cinema để được hỗ trợ ngay.</p>
          <p>
            <strong>Email:</strong> vticinema@gmail.com <br />
            <strong>Hotline:</strong> 1900 1999
          </p>
        </div>
      </div>

      <div className="my-cinema">
        <h2 className="title">DỊCH VỤ CỦA CHÚNG TÔI</h2>
        <div className="my-services">
          {/* Services Section */}
          <div className="s-left services-section">
            <div className="line">
              {services.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${selectedService === index ? "active" : ""}`}
                ></span>
              ))}
            </div>
            <div className="services-list">
              <ul>
                {services.map((service, index) => (
                  <li
                    key={index}
                    className={`service-item bg-${index + 1} ${
                      selectedService === index ? "selected" : ""
                    }`}
                    onClick={() => handleServiceClick(index)}
                  >
                    <a href="#!" className="services">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Contact Form Section */}
          <div className="s-right contact-form-section">
            <div className={`service-info service-${selectedService}`}>
              <h3 className="service-info-title">
                {services[selectedService]}
              </h3>
              <div className="service-info-details">
                {serviceDetails[selectedService]
                  .split("\n")
                  .map((line, index) => (
                    <p key={index}>{line.trim()}</p>
                  ))}
              </div>
            </div>
            <h2 className="sub-title">LẬP KẾ HOẠCH CÙNG VTI CINEMA NGAY</h2>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-rows">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và Tên"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && (
                    <p className="error-message">{errors.name}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && (
                    <p className="error-message">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="form-rows">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <select
                    name="service"
                    value={formData.service}
                    onBlur={() => handleBlur("service")}
                    className={errors.service ? "input-error" : ""}
                    onChange={handleServiceChange}
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="error-message">{errors.service}</p>
                  )}
                </div>
              </div>
              <div className="form-rows">
                <div className="form-group">
                  <select
                    name="region"
                    value={formData.region}
                    onBlur={() => handleBlur("region")}
                    className={errors.region ? "input-error" : ""}
                    onChange={handleRegionChange}
                  >
                    <option value="">Chọn khu vực</option>
                    {regions.map((region, index) => (
                      <option key={index} value={normalizeString(region)}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="error-message">{errors.region}</p>
                  )}
                </div>
                <div className="form-group">
                  <select
                    name="cinema"
                    value={formData.cinema}
                    onBlur={() => handleBlur("cinema")}
                    className={errors.cinema ? "input-error" : ""}
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        cinema: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn rạp</option>
                    {cinemaList.map((cinema) => (
                      <option key={cinema.cinema_id} value={cinema.cinema_name}>
                        {cinema.cinema_name} - {cinema.location}
                      </option>
                    ))}
                  </select>
                  {errors.cinema && (
                    <p className="error-message">{errors.cinema}</p>
                  )}
                </div>
              </div>
              <p className="details-length">
                {maxLength - detailsLength}/{maxLength}
              </p>
              <div className="form-group">
                <textarea
                  name="details"
                  placeholder="Thông tin chi tiết"
                  value={formData.details}
                  maxLength={maxLength}
                  onBlur={() => handleBlur("details")}
                  className={errors.details ? "input-error" : ""}
                  onChange={handleChange}
                ></textarea>
                {errors.details && (
                  <p className="error-message">{errors.details}</p>
                )}
              </div>
              <button type="submit" className="submit-button">
                {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="ad-promotion">
        <a href="#!">
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733544890/contact_hksyaj.jpg"
            alt="Banner quảng cáo"
          />
        </a>

        <a href="#!">
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1733630230/contact_3_gz3ekb.jpg"
            alt="Banner quảng cáo"
          />
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
