import {
  validateEmail,
  validatePhone,
  validateName,
} from "../../utils/validation.js";
export const services = [
  "MUA VÉ NHÓM",
  "THUÊ RẠP TỔ CHỨC SỰ KIỆN",
  "QUẢNG CÁO TẠI RẠP",
  "MUA PHIẾU QUÀ TẶNG / E-CODE",
];
export const serviceDetails = [
  // Service 0
  `Áp dụng cho đoàn từ 20 khách trở lên, áp dụng chiết khấu cao với hợp đồng dài hạn của doanh nghiệp.\n
  Hoạt động gắn kết tinh thần tập thể, giúp các thành viên xích lại gần nhau hơn.\n
  Liên hệ ngay với VTI Cinema để trải nghiệm dịch vụ: đặt chỗ như ý, ưu đãi khách đoàn, hỗ trợ sắp xếp phim và lịch chiếu phù hợp nhu cầu và lịch trình quý khách.\n
  Áp dụng ưu đãi cho các đoàn học sinh, sinh viên.\n
  Để được tư vấn vui lòng để thông tin ở phía dưới hoặc inbox fanpage VTI Cinema.\n
  Chúng tôi sẽ liên hệ nhanh nhất có thể.`,

  // Service 1
  `Không gian sang trọng, phòng chiếu riêng biệt, hình ảnh và âm thanh vượt trội, VTI Cinema cung cấp vị trí đẳng cấp để tổ chức sự kiện ra mắt sản phẩm, họp công ty, hội nghị khách hàng.\n
  Hỗ trợ sảnh rạp tổ chức đón khách, chụp hình thảm đỏ, tương tác với truyền thông tại chỗ.\n
  Có nhiều kinh nghiệm tổ chức họp báo ra mắt phim, ra mắt MV. VTI Cinema sẽ giúp bạn đưa sản phẩm tới công chúng gần hơn.\n
  Liên hệ tư vấn vui lòng để thông tin ở bên dưới hoặc inbox fanpage VTI Cinema.\n
  Chúng tôi sẽ liên hệ sớm nhất có thể.`,

  // Service 2
  `Tiếp cận tới đông đảo khách hàng xem phim tại rạp thông qua tiếp thị quảng cáo đa kênh tại rạp.\n
  VTI Cinema cung cấp giải pháp truyền thông tại chỗ, quảng cáo trực tuyến giúp thương hiệu tới gần hơn tới người xem.\n
  - Quảng cáo trên màn hình cực lớn, âm thanh sống động trong rạp trước mỗi suất chiếu phim.\n
  - Quảng cáo trên các màn hình LED lớn tại sảnh chờ của rạp, với hàng chục địa điểm trên cả nước và hàng trăm màn hình hiển thị.\n
  - Quảng cáo trên các sản phẩm in ấn, trưng bày tại rạp tiếp cận khách hàng tiềm năng.\n
  - Quảng cáo trực tiếp tới từng khách xem phim tại rạp với sms, tin nhắn dịch vụ, phát phiếu quà tặng tận tay.\n
  - Quảng cáo trên các kênh thông tin trực tuyến của rạp với hàng triệu lượt truy cập đặt vé xem phim mỗi tháng.`,

  // Service 3
  `Phiếu quà tặng dịch vụ tại rạp bao gồm: vé xem phim 2D, vé trải nghiệm các phòng chiếu đặc biệt Superplex (với màn hình lớn nhất Việt Nam), Cine Comfort (phòng chiếu có ghế duỗi chân, êm ái và rộng rãi hơn), CharVTI (phòng chiếu đẳng cấp riêng biệt, có phục vụ ăn uống miễn phí với không gian riêng tư), các combo bắp nước tại rạp.\n
  Có hai lựa chọn phiếu quà tặng giấy truyền thống và e-code điện tử tiện lợi.\n
  Hotline tư vấn: Ms Diệp 0913.003.864.\n
  Hãy sử dụng phiếu quà tặng tại VTI Cinema để:\n
  - Nâng cao chương trình Chăm Sóc Khách Hàng của Quý Đối Tác.\n
  - Nâng tầm thương hiệu của Quý Đối Tác thông qua sản phẩm và dịch vụ của chúng tôi.\n
  - Chăm sóc sức khỏe tinh thần khách hàng bằng sản phẩm giải trí tinh thần.\n
  - Giải pháp về quà tặng cho các chiến dịch quảng bá, khuyến mại của Quý Đối Tác.\n
  - Món quà sinh nhật ý nghĩa cho người thân và bạn bè.`,
];

export const validateField = (field, value) => {
  let error = "";
  switch (field) {
    case "name":
      error = validateName(value);
      break;
    case "email":
      error = validateEmail(value);
      break;
    case "phone":
      error = validatePhone(value);
      break;
    case "service":
      error =
        value && value !== "Vui lòng chọn loại dịch vụ."
          ? ""
          : "Vui lòng chọn loại dịch vụ.";
      break;
    case "region":
      error = value && value !== "Chọn khu vực" ? "" : "Vui lòng chọn khu vực.";
      break;
    case "cinema":
      error = value && value !== "Chọn rạp" ? "" : "Vui lòng chọn rạp.";
      break;
    case "details":
      if (!value) {
        error = "VTI Cinema xin nhận một ít thông tin nhé!";
      } else if (value.length < 10) {
        error = "Thông tin chi tiết phải có ít nhất 10 ký tự.";
      }

      break;
    default:
      break;
  }
  return error;
};

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(now.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`; // Định dạng: DD/MM/YYYY
};
