const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageCommentsToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // Thêm file ảnh vào formData
  formData.append("upload_preset", UPLOAD_PRESET); // Thêm upload_preset
  formData.append("folder", "VTI_Cinemas/Comments"); // (Tùy chọn) Thêm folder để quản lý

  // console.log("File được truyền vào Cloudinary:", file); // Log kiểm tra file
  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.secure_url) {
      // console.log("URL ảnh:", data.secure_url);
      return data.secure_url; // Trả về URL của ảnh đã tải lên
    } else {
      throw new Error("Không tải được ảnh lên Cloudinary");
    }
  } catch (error) {
    console.error("Lỗi khi tải ảnh:", error);
    return null;
  }
};
