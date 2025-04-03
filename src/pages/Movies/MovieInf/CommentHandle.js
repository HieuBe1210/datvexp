import { getDatabase, ref, get, update } from "firebase/database";
import { toast } from "react-toastify";
import {
  getSubcomments,
  pushSubcomment,
  updateSubcomment,
  deleteSubcomment,
  updateCommentCount,
  deleteComment,
  addComment,
  updateMovieRating,
  updateComment,
  checkUserHasCommented,
} from "../../../services/service/serviceMovie.js";
import { fetchMoviesByIdFromFirebase } from "../../../services/firebase/firebaseMovie.js";
import { uploadImageComments } from "../../../services/service/serviceUploadImage.js";

// LẤY THÔNG TIN NGƯỜI DÙNG TỪ localStorage
const userInfo = JSON.parse(localStorage.getItem("user"));

// HÀM XỬ LÝ THÊM SUBCOMMENT
export const handleAddSubcomment = async (commentId, newSubcomment) => {
  const MAX_SUBCOMMENTS_PER_USER = 3; // Số lần phản hồi tối đa
  const TIME_LIMIT = 60 * 1000; // 60 giây

  if (!newSubcomment || !newSubcomment.trim()) return;

  const newSubcommentData = {
    email: userInfo?.email,
    username: userInfo?.fullname || userInfo?.displayName,
    avatar: userInfo?.avatar || userInfo?.photoURL,
    subcontent: newSubcomment.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    // 1️. Lấy danh sách subcomments
    const subcomments = await getSubcomments(commentId);
    if (subcomments) {
      // 2️. Kiểm tra số lần phản hồi của tài khoản
      const userSubcomments = subcomments.filter(
        (sub) => sub.email === userInfo?.email
      );
      if (userSubcomments.length >= MAX_SUBCOMMENTS_PER_USER) {
        toast.warning("Bạn chỉ được phản hồi tối đa 3 bình luận!");
        return;
      }

      // 3️. Kiểm tra thời gian giữa các lần phản hồi
      if (userSubcomments.length > 0) {
        const lastSubcommentTime = new Date(
          userSubcomments[userSubcomments.length - 1].timestamp
        ).getTime();
        const now = new Date().getTime();

        if (now - lastSubcommentTime < TIME_LIMIT) {
          toast.warning("Mỗi bình luận phải cách nhau 1 phút!");
          return;
        }
      }
    }

    // 4️. Thêm subcomment mới
    const success = await pushSubcomment(commentId, newSubcommentData);
    if (!success) {
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại!");
      return;
    }

    // 5️. Cập nhật commentsCount
    const updateSuccess = await updateCommentCount(commentId, 1);
    if (!updateSuccess) {
      console.error("Không thể cập nhật số lượng bình luận!");
    } else {
      toast.success("Đã gửi phản hồi!");
    }
  } catch (error) {
    console.error("Lỗi trong handleAddSubcomment:", error);
    toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
  }
};

//HÀM XỬ LÝ CHỈNH SỬA SUBCOMMENT
export const handleUpdateSubComment = async (
  commentId,
  subcommentId,
  newText,
  setIsEditingSubComment
) => {
  if (!commentId || !subcommentId) {
    toast.error("Lỗi: Thiếu ID bình luận hoặc phản hồi!");
    return;
  }

  if (!newText || typeof newText !== "string") {
    toast.warning("Nội dung phản hồi không hợp lệ!");
    return;
  }

  const trimmedText = newText.trim();
  if (!trimmedText) {
    toast.warning("Nội dung phản hồi không được để trống!");
    return;
  }
  setIsEditingSubComment(true);
  try {
    // console.log(" Gọi API cập nhật subcomment...");
    const isUpdated = await updateSubcomment(
      commentId,
      subcommentId,
      trimmedText
    );

    if (isUpdated) {
      toast.success("Cập nhật thành công!");
    } else {
      toast.error("Lỗi khi cập nhật. Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật subcomment:", error);
    toast.error("Không thể cập nhật phản hồi!");
  } finally {
    setIsEditingSubComment(false);
  }
};

// HÀM XỬ LÝ LƯỢT THÍCH
export const handleLikeComment = async (commentId) => {
  if (!userInfo) {
    toast.warning("Vui lòng đăng nhập!");
    return;
  }
  const db = getDatabase();
  const commentRef = ref(db, `Comments/${commentId}`);
  try {
    // Lấy dữ liệu bình luận hiện tại
    const snapshot = await get(commentRef);
    if (!snapshot.exists()) return;
    const commentData = snapshot.val();
    let likedUsers = commentData.likedUsers || []; // Mảng chứa danh sách email đã thích
    const userEmail = userInfo.email;
    if (likedUsers.includes(userEmail)) {
      // Nếu đã thích => Bỏ thích
      likedUsers = likedUsers.filter((email) => email !== userEmail);
      await update(commentRef, {
        likes: Math.max(0, (commentData.likes || 0) - 1),
        likedUsers,
      });
    } else {
      // Nếu chưa thích => Thêm vào danh sách thích
      likedUsers.push(userEmail);
      await update(commentRef, {
        likes: (commentData.likes || 0) + 1,
        likedUsers,
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật lượt thích:", error);
  }
};

// HÀM XÓA COMMENT
export const handleDeleteComment = async (commentId, movieId) => {
  if (!commentId || !movieId) {
    console.error("Lỗi: `commentId` hoặc `movieId` bị thiếu!");
    return;
  }

  try {
    console.log("Xóa bình luận - ID:", commentId, "Movie ID:", movieId);

    // Lấy rating từ Firebase trước khi xóa
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);
    const snapshot = await get(commentRef);

    if (!snapshot.exists()) {
      console.error("Lỗi: Không tìm thấy bình luận trong Firebase!");
      return;
    }

    const commentData = snapshot.val();
    const ratingToRemove = commentData.rating || 0; // Lấy rating từ bình luận

    // Xóa bình luận khỏi Firebase
    await deleteComment(commentId);

    // Cập nhật tổng điểm đánh giá của phim
    const updateSuccess = await updateMovieRating(
      movieId,
      ratingToRemove,
      false
    );
    if (!updateSuccess) {
      console.warn(
        "Không thể cập nhật số lượng bình luận sau khi xóa bình luận!"
      );
    }

    toast.success("Đã xóa bình luận!");
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    toast.error("Không thể xóa bình luận.");
  }
};

// HÀM XOÁ SUBCOMMENT
export const handleDeleteSubcomment = async (commentId, subcommentId) => {
  if (!commentId || !subcommentId) return;

  try {
    // Gọi API xoá subcomment
    const isDeleted = await deleteSubcomment(commentId, subcommentId);
    if (!isDeleted) {
      toast.error("Lỗi khi xoá phản hồi. Vui lòng thử lại!");
      return;
    }

    // Cập nhật số lượng subcomments
    await updateCommentCount(commentId, -1);

    toast.success("Đã xoá phản hồi!");
  } catch (error) {
    toast.error("Lỗi khi xoá phản hồi. Vui lòng thử lại!");
    console.error("Lỗi khi xoá subcomment:", error);
  }
};

// HÀM ADD COMMENT
export const handleAddComment = async ({
  movieId,
  userInfo,
  newComment,
  rating,
  selectedTags,
  image,
  setNewComment,
  setRating,
  setSelectedTags,
  setImage,
  setPreviewImage,
  setIsSubmitting,
}) => {
  const minCharacters = 10; // Giới hạn ký tự tối thiểu
  if (rating === 0) {
    toast.warning("Vui lòng chọn số sao đánh giá!");
    console.log("Vui lòng chọn số sao đánh giá!");
    return;
  }
  if (newComment.length < minCharacters) {
    toast.warning(`Nội dung tối thiểu ${minCharacters} ký tự`);
    return;
  }
  if (!newComment.trim()) {
    toast.warning("Vui lòng nhập nội dung bình luận!");
    return;
  }
  if (selectedTags.length === 0) {
    toast.warning("Vui lòng chọn cảm xúc của bạn!");
    return;
  }

  setIsSubmitting(true);
  let imageUrl = null;
  if (image) {
    try {
      imageUrl = await uploadImageComments(image);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      toast.warning("Không thể tải ảnh lên. Vui lòng thử lại!");
      setIsSubmitting(false);
      return;
    }
  }
  const commentData = {
    email: userInfo?.email,
    email_movieId: `${userInfo?.email}_${movieId}`, // Dùng để kiểm tra bình luận duy nhất
    username: userInfo?.fullname || userInfo?.displayName,
    avatar: userInfo?.avatar || userInfo?.photoURL,
    content: newComment,
    tags: selectedTags,
    image: imageUrl || null,
    timestamp: Date.now(),
    movieId: String(movieId),
    likes: 0,
    commentsCount: 0,
    rating: rating * 2,
  };

  try {
    const newCommentId = await addComment(commentData);
    if (!newCommentId) {
      toast.error("Không thể gửi bình luận!");
      setIsSubmitting(false);
      return;
    }
    console.log("Kiểm tra movieId trước khi cập nhật rating:", movieId);
    const updated = await updateMovieRating(movieId, commentData.rating, true);
    if (!updated) {
      toast.warning("Không thể cập nhật số lượng bình luận và điểm phim!");
    }
    setNewComment("");
    setRating(0);
    setSelectedTags([]);
    setImage(null);
    setPreviewImage(null);
    toast.success("Bình luận thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    toast.error("Không thể gửi bình luận. Vui lòng thử lại!");
  } finally {
    setIsSubmitting(false);
  }
};

// HÀM CHỈNH SỬA COMMENT
export const handleEditComment = async (
  commentId,
  updatedContent,
  newImage, // Ảnh mới có thể là file hoặc URL
  removeImage, // Nếu true, sẽ xóa ảnh cũ
  setIsEditingComment
) => {
  if (!commentId || !updatedContent) {
    console.error("Lỗi: Thiếu dữ liệu để chỉnh sửa bình luận!");
    return;
  }
  setIsEditingComment(true);
  try {
    console.log("Chỉnh sửa bình luận - ID:", commentId);

    let updatedData = { content: updatedContent };

    // Nếu người dùng muốn xóa ảnh, đặt image = null
    if (removeImage) {
      updatedData.image = null;
    }

    // Nếu có ảnh mới, kiểm tra xem là file mới hay chỉ giữ nguyên ảnh cũ
    if (newImage && typeof newImage !== "string") {
      try {
        // console.log("Đang tải ảnh lên Cloudinary...");
        const uploadedImageUrl = await uploadImageComments(newImage);
        // console.log("Ảnh mới đã tải lên:", uploadedImageUrl);
        updatedData.image = uploadedImageUrl; // Lưu ảnh mới vào dữ liệu
        // console.log("Ảnh mới đã tải lên Cloudinary:", uploadedImageUrl);
      } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
        return;
      }
    }
    // Cập nhật bình luận trong Firebase
    const success = await updateComment(commentId, updatedData);
    if (!success) {
      toast.error("Lỗi khi cập nhật bình luận!");
      return;
    }
    toast.success("Bình luận đã được chỉnh sửa!");
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa bình luận:", error);
    toast.error("Không thể chỉnh sửa bình luận.");
  } finally {
    setIsEditingComment(false);
  }
};
