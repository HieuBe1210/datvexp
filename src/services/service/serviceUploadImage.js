const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import { uploadImageCommentsToCloudinary } from "../cloudinaryService";

// API UPLOAD ẢNH COMMENT VÀO CLOUDINARY
export const uploadImageComments = async (file) => {
  return useFirebase
    ? await uploadImageCommentsToCloudinary(file)
    : await uploadImageCommentsToBE(file);
};
