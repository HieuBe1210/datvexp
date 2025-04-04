import "./ContactPage.modul.scss";
import React, { useState, useEffect } from "react";
import {
  services,
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
//import { Link } from "react-router-dom";
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
             MUA VÉ NHÓM <br /> THUÊ RẠP TỔ CHỨC SỰ
            KIỆN 
          </h1>
          <p>
            Bạn có nhu cầu quảng cáo trên màn hình cực lớn tại rạp, tiếp cận
            đông đảo khách xem phim tại rạp.
          </p>
          <p>
            Bạn cần thưởng thức các bộ phim bom tấn riêng tư cùng gia đình, bạn
            bè, đồng nghiệp.
          </p>
          <p>Hãy liên hệ ngay với VTI Cinema để được hỗ trợ ngay.</p>
          <p>
            <strong>Email:</strong> vticinema@gmail.com <br />
            <strong>Hotline:</strong> 1900 6868
          </p>
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
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
