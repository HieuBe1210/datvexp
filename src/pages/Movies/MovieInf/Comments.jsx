import React, { useState, useEffect, useRef } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  get,
} from "firebase/database";
import { fetchMoviesByIdFromFirebase } from "../../../services/firebase/firebaseMovie.js";
import { checkUserPurchase } from "../../../services/service/serviceMovie.js";
import comment_icon from "../../../assets/icon/comment_icon.svg";
import liked_icon from "../../../assets/icon/liked_icon.svg";
import unlike_icon from "../../../assets/icon/unlike_icon.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icon 3 chấm
import EditIcon from "@mui/icons-material/Edit"; // Icon sửa
import DeleteIcon from "@mui/icons-material/Delete"; // Icon xóa
import TagSelector from "./TagSelector";
import useAutosizeTextarea from "../../../utils/utilsFunction";
import LazyImage from "../../../components/LazyImage.jsx";
import RenderRatingStars from "./RatingStars.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faX } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { LoadingScreen } from "../../../components/Loading/LoadingScreen.jsx";
import LoadingIcon from "../../../components/LoadingIcon.jsx";
import { CSSTransition } from "react-transition-group";
import { DeleteConfirmModal } from "./DeleteConfirmModal.jsx";
import {
  handleAddSubcomment,
  handleUpdateSubComment,
  handleLikeComment,
  handleDeleteSubcomment,
  handleDeleteComment,
  handleAddComment,
  handleEditComment,
} from "./CommentHandle.js";

const Comments = ({ movieId }) => {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isEditingSubComment, setIsEditingSubComment] = useState(false);

  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái hệ thống đang xử lý
  const [hasRated, setHasRated] = useState(false); // Trạng thái đã gửi đánh giá
  const [rating, setRating] = useState(0); // Lưu điểm đánh giá
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]); // Lưu danh sách bình luận của phim hiện tại
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới
  const [canComment, setCanComment] = useState(false); // Trạng thái kiểm tra quyền bình luận
  const [selectedTags, setSelectedTags] = useState([]); // Danh sách thẻ cảm xúc
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng
  const textareaRef = useRef(null);
  const actionsRef = useRef(null); // Tham chiếu đến phần mở rộng
  const containerRef = useRef(null); // Tham chiếu đến toàn bộ "cục" này

  // Trạng thái chỉnh sửa Comment
  const [editingCommentId, setEditingCommentId] = useState(null); // ID comment đang chỉnh sửa
  const [editCommentContent, setEditCommentContent] = useState(""); // Nội dung chỉnh sửa
  const [editCommentImage, setEditCommentImage] = useState(null); // Ảnh chỉnh sửa
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Trạng thái chỉnh sửa SubComment
  const [visibleSubcomments, setVisibleSubcomments] = useState({}); // Trạng thái lưu subcomments của từng comment
  const subcommentsRefs = useRef({}); // Sử dụng đối tượng ref thay vì một ref chung
  const [editingSubcommentId, setEditingSubcommentId] = useState({
    commentId: null,
    subcommentId: null,
  });
  const [subAnchorEl, setSubAnchorEl] = useState(null); // Quản lý menu 3 chấm cho subcomment
  const [selectedSubcomment, setSelectedSubcomment] = useState({
    commentId: null,
    subcommentId: null,
  });

  const handleSubMenuOpen = (event, commentId, subcommentId) => {
    setSubAnchorEl(event.currentTarget);
    setSelectedSubcomment({ commentId, subcommentId });
  };

  const handleSubMenuClose = () => {
    setSubAnchorEl(null);
    setSelectedSubcomment({ commentId: null, subcommentId: null });
  };

  // Chỉ lưu ID subcomment đang chỉnh sửa
  const [editText, setEditText] = useState(""); // Lưu nội dung chỉnh sửa
  const toggleSubcomments = (commentId) => {
    setVisibleSubcomments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Đảo ngược trạng thái
    }));
  };
  const [newSubcomment, setNewSubcomment] = useState("");
  // Xử lý khi click vào textarea
  const handleTextareaClick = () => {
    setIsExpanded(true); // Hiện các phần mở rộng khi click vào textarea
  };

  // Xử lý khi click bên ngoài để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) // Nếu click ra ngoài container
      ) {
        // Kiểm tra nếu event.target có thuộc về bất kỳ subcomments nào không
        const isClickOnSubcomments = Object.values(
          subcommentsRefs.current
        ).some((subRef) => subRef && subRef.contains(event.target));

        if (!isClickOnSubcomments) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sử dụng hook để tự động thay đổi chiều cao textarea từ utilsFunction
  const editCommentTextareaRef = useRef(null); // Ref cho chỉnh sửa Comment
  const editSubcommentTextareaRef = useRef(null); // Ref cho chỉnh sửa Subcomment

  useAutosizeTextarea(editCommentTextareaRef, editCommentContent);
  useAutosizeTextarea(editSubcommentTextareaRef, editText);

  const editTextareaRef = useRef(null);
  const newSubcommentareaRef = useRef(null);
  useAutosizeTextarea(textareaRef, newComment);
  useAutosizeTextarea(editTextareaRef, editText);
  useAutosizeTextarea(newSubcommentareaRef, newSubcomment);
  // Định dạng ngày tháng
  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Chuyển timestamp thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}  ${hours}:${minutes}`;
  };

  // XOÁ SUBCOMMENT
  // Trạng thái hiển thị Modal xác nhận xoá dùng chung Comment and SubComment
  const [deleteType, setDeleteType] = useState(""); // "comment" hoặc "subcomment"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedSubcommentId, setSelectedSubcommentId] = useState(null);
  const showDeleteModal = (commentId, subcommentId = null) => {
    setSelectedCommentId(commentId);
    setSelectedSubcommentId(subcommentId);
    setDeleteType(subcommentId ? "subcomment" : "comment");
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCommentId) {
      console.error("LỖI: `selectedCommentId` bị null trước khi xóa!");
      return;
    }
    if (deleteType === "comment") {
      handleDeleteComment(selectedCommentId, movieId);
    } else if (deleteType === "subcomment") {
      handleDeleteSubcomment(selectedCommentId, selectedSubcommentId);
    }
    setIsDeleteModalOpen(false);
  };

  // LƯU ẢNH VÀO CLOUDINARY
  const [image, setImage] = useState(null); // Lưu trữ file ảnh Comment
  const [previewImage, setPreviewImage] = useState(null); // Lưu URL tạm thời để hiển thị ảnh
  // Hiển thị Review khi Chọn và sửa ảnh
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file); // Tạo URL xem trước ảnh
      setEditCommentImage(file); // Lưu file ảnh vào state
      setPreviewImage(previewURL); // Cập nhật ảnh hiển thị
      setImage(file); // Set ảnh trước để khi bấm gửi sẽ được lưu vào Firebase
      console.log("Ảnh mới được chọn:", file);
      console.log("URL xem trước:", previewURL);
    }
  };

  // Hàm xử lý khi người dùng xóa ảnh
  const handleRemoveImage = () => {
    setImage(null); // Xóa file ảnh khỏi state
    setPreviewImage(null); // Xóa URL xem trước
    setEditCommentImage(null); // Xóa ảnh trước khỏi state
  };
  // Reset các state liên quan đến bình luận khi movieId hoặc movieName thay đổi
  useEffect(() => {
    setNewComment(""); // Reset nội dung bình luận
    setSelectedTags([]); // Reset các tag được chọn
    setImage(null); // Reset ảnh
    setPreviewImage(null); // Reset preview ảnh
    setRating(0); // Reset điểm đánh giá
    setHasRated(false); // Reset trạng thái đã đánh giá
  }, [movieId]);

  // KIỂM TRA XEM NGƯỜI DÙNG ĐÃ BÌNH LUẬN HAY CHƯA
  useEffect(() => {
    const checkHasRated = async () => {
      if (!userInfo?.email || !movieId) return;
      const db = getDatabase();
      const commentsRef = ref(db, "Comments");
      const commentsQuery = query(
        commentsRef,
        orderByChild("email_movieId"),
        equalTo(`${userInfo.email}_${movieId}`)
      );

      try {
        const snapshot = await get(commentsQuery);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Kiểm tra từng bình luận để chắc chắn đúng email và movieId
          const hasRatedAccurately = Object.values(data).some(
            (comment) =>
              comment.email === userInfo.email &&
              comment.movieId === String(movieId)
          );

          if (hasRatedAccurately) {
            setHasRated(true); // Đánh dấu trạng thái đã gửi
            setCanComment(false); // Vô hiệu hóa bình luận nếu đã gửi
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đánh giá:", error);
      }
    };

    checkHasRated();
  }, [userInfo, movieId]);

  // KIỂM TRA QUYỀN BÌNH LUẬN (ĐÃ MUA VÉ HAY CHƯA)
  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, "Orders");
    if (!userInfo?.email) {
      setCanComment(false);
      return;
    }
    const ordersQuery = query(
      ordersRef,
      orderByChild("app_user"),
      equalTo(userInfo.email) // Tìm các đơn hàng của người dùng dựa trên email
    );
    const unsubscribe = onValue(ordersQuery, (snapshot) => {
      let hasOrder = false;
      snapshot.forEach((order) => {
        const data = order.val();
        if (
          data.movieDetails?.movie_id === movieId &&
          data.status === "success"
        ) {
          hasOrder = true;
        }
      });
      setCanComment(hasOrder);
    });
    return () => unsubscribe();
  }, [userInfo, movieId]);

  // LẤY DỮ LIỆU PHIM BẰNG MOVIEID
  const [movieData, setMovieData] = useState(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoadingMovie(true);
      try {
        const movie = await fetchMoviesByIdFromFirebase(movieId);
        if (movie) {
          setMovieData(movie);
        } else {
          console.warn(`Không tìm thấy phim với movieId: ${movieId}`);
          setMovieData(null);
        }
        // console.log("movieData", movie);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      } finally {
        setIsLoadingMovie(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  // LẤY DANH SÁCH BÌNH LUẬN CỦA BỘ PHIM HIỆN TẠI
  useEffect(() => {
    setIsLoadingComments(true); // Bật trạng thái loading trước khi bắt đầu
    if (!movieId) {
      setIsLoadingComments(false); // Tắt trạng thái nếu không có movieId
      return;
    }
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("movieId"),
      equalTo(String(movieId)) // Đảm bảo movieId là chuỗi
    );
    const unsubscribe = onValue(
      commentsQuery,
      async (snapshot) => {
        if (!snapshot.exists()) {
          setComments([]); // Nếu không có bình luận, đặt danh sách bình luận rỗng
        } else {
          // Xử lý dữ liệu bình luận từ snapshot
          const data = snapshot.val();
          const fetchedComments = Object.entries(data)
            .map(([id, value]) => ({
              id,
              ...value,
              timestamp: new Date(value.timestamp).getTime(),
            }))
            .sort((a, b) => b.timestamp - a.timestamp); // Sắp xếp giảm dần theo thời gian

          // Tạo danh sách email của người bình luận & người trả lời (subcomment)
          const uniqueEmails = new Set();
          fetchedComments.forEach((comment) => {
            uniqueEmails.add(comment.email); // Email của người comment chính
            if (comment.subcomments) {
              Object.values(comment.subcomments).forEach((sub) =>
                uniqueEmails.add(sub.email)
              );
            }
          });

          // Kiểm tra trạng thái mua vé của tất cả người dùng trong danh sách trên
          const purchaseStatuses = {};
          for (let email of uniqueEmails) {
            purchaseStatuses[email] = await checkUserPurchase(email, movieId);
          }

          // Cập nhật trạng thái "Đã xem phim" cho từng bình luận & subcomment
          const updatedComments = fetchedComments.map((comment) => ({
            ...comment,
            purchased: purchaseStatuses[comment.email] || false, // Kiểm tra trạng thái bình luận chính
            subcomments: comment.subcomments
              ? Object.entries(comment.subcomments).reduce(
                  (acc, [subId, sub]) => {
                    acc[subId] = {
                      ...sub,
                      purchased: purchaseStatuses[sub.email] || false, // Kiểm tra trạng thái subcomment
                    };
                    return acc;
                  },
                  {}
                )
              : null,
          }));
          setComments(updatedComments);
        }
        setIsLoadingComments(false); // Tắt trạng thái loading sau khi xử lý xong
      },
      (error) => {
        console.error("Lỗi khi tải bình luận:", error);
        setIsLoadingComments(false); // Tắt trạng thái loading khi xảy ra lỗi
      }
    );
    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, [movieId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxCharacters = 300; // Giới hạn số ký tự
  const minCharacters = 10; // Giới hạn ký tự tối thiểu
  return (
    <div className="comment-wrapper">
      {/* Nếu người dùng đã gửi đánh giá */}
      {hasRated && <p className="info">Bạn đã gửi đánh giá cho phim này!</p>}
      {/* Nếu người dùng không có quyền bình luận */}
      {!canComment && !hasRated && (
        <p className="info">Bạn cần mua vé để gửi đánh giá phim!</p>
      )}
      <div className="comments-section" ref={containerRef}>
        {/* Chỉ hiển thị phần đánh giá và bình luận nếu có quyền và chưa gửi */}
        {canComment && !hasRated && (
          <>
            {/* Giao diện đánh giá sao */}
            <div className="rating-section">
              <p className="title">Đánh giá và bình luận phim</p>
              <RenderRatingStars
                rating={rating} // Truyền điểm đánh giá
                onRatingSelect={(selectedRating) => setRating(selectedRating)}
                disabled={isLoading || hasRated} // Vô hiệu hóa nếu loading hoặc đã gửi đánh giá
              />
            </div>
            {/* Hiển thị TagSelector ngay dưới đánh giá sao */}

            {/* Giao diện nhập bình luận */}
            <textarea
              ref={textareaRef}
              style={{
                overflow: "hidden",
                resize: "none",
              }}
              placeholder={`Hãy chia sẻ cảm xúc của bạn... (tối thiểu ${minCharacters} ký tự)`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={maxCharacters}
              onClick={handleTextareaClick}
            ></textarea>
            <CSSTransition
              in={isExpanded} // Kiểm soát hiển thị theo trạng thái mở rộng
              timeout={500} // Thời gian hiệu ứng
              classNames="comments-expand"
              unmountOnExit
            >
              <div className="comments-actions-wrapper">
                <div className="comment-actions" ref={actionsRef}>
                  {/* Nút tải ảnh */}
                  <div className="image-upload-section">
                    <label htmlFor="file-upload" className="custom-upload-btn">
                      Tải ảnh lên
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      style={{ display: "none" }}
                    />
                    {previewImage && (
                      <div className="image-preview">
                        <LazyImage src={previewImage} alt="Preview" />
                        <button
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <TagSelector
                      onSelectTags={(tags) => setSelectedTags(tags)}
                      selectedTags={selectedTags}
                    />
                    {/* Nút gửi bình luận */}
                    <button
                      className="send-comment-btn"
                      onClick={() => {
                        if (canComment) {
                          // setIsSubmitting(true);
                          handleAddComment({
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
                            setIsSubmitting, // Truyền vào đúng state này
                          });
                        }
                      }}
                      disabled={isSubmitting || hasRated || !canComment}
                    >
                      {isSubmitting ? (
                        <LoadingIcon size="1.2rem" color="white" />
                      ) : (
                        "Gửi"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </>
        )}
        <div className="movie-rating">
          {isLoadingMovie ? (
            <LoadingScreen message="Đang tải đánh giá phim..." />
          ) : (
            movieData && (
              <div>
                <FontAwesomeIcon icon={solidStar} className="star" />
                <span className="core">{movieData.rating || 0}/10</span> ·{" "}
                <span>{movieData.totalReviews || 0} lượt đánh giá</span>
              </div>
            )
          )}
        </div>
        <p className="title">Bình luận từ người xem</p>
        <div className="comments-list">
          {isLoadingComments ? (
            <LoadingScreen message="Đang tải bình luận..." />
          ) : comments.length === 0 ? (
            <p className="paragraph">Chưa có bình luận nào!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header-wrapper">
                  <div className="comment-header">
                    <LazyImage
                      src={comment.avatar}
                      alt={comment.username}
                      width="40px"
                      height="40px"
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <p className="username">{comment.username}</p>
                      <p className="timestamp">
                        {formatDate(comment.timestamp)}
                      </p>
                    </div>
                    {/* Hiển thị dòng "Đã mua vé" nếu user đã mua */}
                    {comment.purchased && (
                      <span className="verified-badge">Đã xem phim</span>
                    )}
                  </div>
                  {userInfo?.email === comment.email && (
                    <div>
                      {/* Nút mở menu */}
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, comment.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      {/* Dropdown Menu */}
                      <Menu
                        anchorEl={anchorEl}
                        open={
                          Boolean(anchorEl) && selectedCommentId === comment.id
                        }
                        onClose={handleMenuClose}
                        className="comment-dropdown"
                      >
                        {/* SỬA COMMENT */}
                        <MenuItem
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditCommentContent(comment.content);
                            setEditCommentImage(comment.image);
                            handleMenuClose();
                          }}
                          className="comment-dropdown-item edit"
                        >
                          <EditIcon className="menu-icon edit-icon" />
                          Sửa
                        </MenuItem>

                        {/* XOÁ COMMENT */}
                        <MenuItem
                          onClick={() => {
                            showDeleteModal(comment.id); // Chỉ truyền `comment.id`, không cần `subcommentId`
                            handleMenuClose();
                          }}
                          className="comment-dropdown-item delete"
                        >
                          <DeleteIcon className="menu-icon delete-icon" />
                          Xóa
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                </div>

                <span className="user-rating">
                  <FontAwesomeIcon icon={solidStar} /> {comment.rating || 0}/10
                </span>
                {/* Hiển thị danh sách tag đã chọn */}
                {comment.tags && comment.tags.length > 0 && (
                  <div className="comment-tags ">
                    {comment.tags.map((tag, index) => (
                      <span key={index} className="tag-item ">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Nếu comment đang được chỉnh sửa, chỉ hiển thị form chỉnh sửa */}
                {editingCommentId === comment.id ? (
                  <div className="edit-comment-wrapper">
                    <div className="edit-actions">
                      <textarea
                        ref={editCommentTextareaRef} // Ref cho textarea Comment
                        className="edit-comment-textarea"
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        style={{ overflow: "hidden", resize: "none" }}
                      />
                      {/* Nút Lưu và Hủy */}
                      <div className="btn-actions-wrapper">
                        <button
                          className="btn-actions btn-accept"
                          onClick={async () => {
                            setIsEditingComment(true);
                            await handleEditComment(
                              editingCommentId,
                              editCommentContent,
                              editCommentImage, // Ảnh mới từ state
                              editCommentImage === null, // Nếu ảnh null thì removeImage = true
                              setIsEditingComment, // Truyền state riêng cho chỉnh sửa comment
                              setComments
                            );
                            setEditingCommentId(null);
                          }}
                        >
                          {isEditingComment ? (
                            <LoadingIcon size="1.2rem" color="white" />
                          ) : (
                            "Lưu"
                          )}
                        </button>

                        <button
                          className="btn-actions btn-cancel"
                          onClick={() => {
                            setEditingCommentId(null);
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>

                    {/* Hiển thị ảnh nếu có */}
                    {(previewImage || editCommentImage) && (
                      <div className="image-preview">
                        <LazyImage
                          src={previewImage || editCommentImage}
                          alt="Preview"
                          className="comment-image"
                        />
                        <button
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(null)}
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    )}

                    {/* Chọn ảnh mới */}
                    <div className="image-upload-section">
                      <label htmlFor="file-upload" className="edit-upload-btn">
                        Chọn ảnh
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                ) : (
                  // Nếu không trong trạng thái chỉnh sửa, hiển thị nội dung bình luận
                  <div className="image-preview">
                    <p className="content-comment">{comment.content}</p>
                    {comment.image && (
                      <LazyImage
                        src={comment.image}
                        alt="Ảnh bình luận"
                        className="comment-image"
                      />
                    )}
                  </div>
                )}

                <div className="actions">
                  <span className="comment-count">
                    <img
                      src={comment_icon}
                      alt=""
                      className="actions_icon comment-icon"
                    />
                    {/* Nút ẩn/hiện bình luận */}
                    <span
                      onClick={() => toggleSubcomments(comment.id)}
                      className="toggle-button"
                    >
                      {visibleSubcomments[comment.id]
                        ? "Ẩn bình luận"
                        : `${comment.commentsCount} Bình luận`}
                    </span>
                  </span>

                  <span
                    className={`like-button ${
                      comment.likedUsers?.includes(userInfo?.email)
                        ? "liked"
                        : ""
                    } ${!userInfo ? "disabled" : ""}`}
                    onClick={() => handleLikeComment(comment.id)}
                    style={{
                      cursor: userInfo ? "pointer" : "not-allowed",
                    }}
                  >
                    <img
                      src={
                        comment.likedUsers?.includes(userInfo?.email)
                          ? liked_icon
                          : unlike_icon
                      }
                      alt="Like icon"
                      // className="actions_icon"
                    />
                    {comment.likes} like
                  </span>
                </div>
                <CSSTransition
                  in={!!visibleSubcomments[comment.id]} // Chỉ mở khi trạng thái của comment.id là true
                  timeout={1000}
                  classNames="subcomments"
                  unmountOnExit
                >
                  {/* Hiển thị danh sách subcomments */}
                  <div
                    ref={(el) => {
                      subcommentsRefs.current[comment.id] = el;
                    }} // Gán ref cho từng bình luận
                    className="subcomments-container"
                  >
                    <div
                      className={`subcomments ${
                        visibleSubcomments[comment.id] ? "visible" : ""
                      }`}
                    >
                      {comment.subcomments &&
                        Object.entries(comment.subcomments).map(
                          ([subcommentId, sub]) => (
                            <div key={subcommentId} className="subcomment">
                              <div className="comment-header">
                                <div>
                                  <LazyImage
                                    src={sub.avatar}
                                    alt={sub.username}
                                    width="40px"
                                    height="40px"
                                    className="user-avatar"
                                  />
                                </div>
                                <div>
                                  <div className="user-info">
                                    <p className="username">{sub.username}</p>
                                    <p className="timestamp">
                                      {formatDate(sub.timestamp)}
                                    </p>
                                  </div>
                                </div>
                                {/* Hiển thị "Đã xem phim" nếu subcomment của người đã mua vé */}
                                {sub.purchased && (
                                  <span className="verified-badge">
                                    Đã xem phim
                                  </span>
                                )}
                              </div>
                              <div className="content-subcomment">
                                {sub.subcontent}
                              </div>
                              {/* Kiểm tra xem comment này có đang được chỉnh sửa không */}
                              {editingSubcommentId.commentId === comment.id &&
                              editingSubcommentId.subcommentId ===
                                subcommentId ? (
                                <div className="edit-subComment-wrapper">
                                  <textarea
                                    ref={editSubcommentTextareaRef} // Ref cho textarea Subcomment
                                    className="edit-subComment"
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    style={{
                                      overflow: "hidden",
                                      resize: "none",
                                    }}
                                  />
                                  <button
                                    className="btn-actions btn-accept"
                                    onClick={() => {
                                      setIsEditingSubComment(true);
                                      handleUpdateSubComment(
                                        comment.id,
                                        subcommentId,
                                        editText,
                                        setIsEditingSubComment // Truyền state riêng cho chỉnh sửa subcomment
                                      );
                                      setEditingSubcommentId({
                                        commentId: null,
                                        subcommentId: null,
                                      }); // Đóng chế độ chỉnh sửa
                                      setEditText(""); // Xóa nội dung chỉnh sửa
                                    }}
                                  >
                                    {isEditingComment ? (
                                      <LoadingIcon
                                        size="1.5rem"
                                        color="white"
                                      />
                                    ) : (
                                      "Lưu"
                                    )}
                                  </button>
                                  <button
                                    className="btn-actions btn-cancel"
                                    onClick={() => {
                                      setEditingSubcommentId({
                                        commentId: null,
                                        subcommentId: null,
                                      }); // Hủy chỉnh sửa
                                      setEditText(""); // Reset nội dung
                                    }}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                userInfo?.email === sub.email && (
                                  <div className="subcomment-actions">
                                    {/* Nút mở menu 3 chấm */}
                                    <IconButton
                                      onClick={(event) =>
                                        handleSubMenuOpen(
                                          event,
                                          comment.id,
                                          subcommentId
                                        )
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>

                                    {/* Dropdown Menu */}
                                    <Menu
                                      anchorEl={subAnchorEl}
                                      open={
                                        Boolean(subAnchorEl) &&
                                        selectedSubcomment.commentId ===
                                          comment.id &&
                                        selectedSubcomment.subcommentId ===
                                          subcommentId
                                      }
                                      onClose={handleSubMenuClose}
                                      className="subcomment-dropdown"
                                    >
                                      {/* Sửa Subcomment */}
                                      <MenuItem
                                        onClick={() => {
                                          setEditingSubcommentId({
                                            commentId: comment.id,
                                            subcommentId: subcommentId,
                                          });
                                          setEditText(sub.subcontent);
                                          handleSubMenuClose();
                                        }}
                                        className="subcomment-dropdown-item edit"
                                      >
                                        <EditIcon className="menu-icon edit-icon" />
                                        Sửa
                                      </MenuItem>

                                      {/* Xóa Subcomment */}
                                      <MenuItem
                                        onClick={() => {
                                          console.log(
                                            "Nhấn nút xóa - CommentID:",
                                            comment.id,
                                            "SubcommentID:",
                                            subcommentId
                                          );
                                          showDeleteModal(
                                            comment.id,
                                            subcommentId
                                          ); // Truyền cả `comment.id` và `subcommentId`
                                          handleSubMenuClose();
                                        }}
                                        className="subcomment-dropdown-item delete"
                                      >
                                        <DeleteIcon className="menu-icon delete-icon" />
                                        Xóa
                                      </MenuItem>
                                    </Menu>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        )}

                      {/* Input để thêm subcomment */}
                      <div className="subComment-wrapper">
                        <textarea
                          className="subComment-input"
                          type="text"
                          ref={newSubcommentareaRef}
                          value={newSubcomment}
                          onChange={(e) => setNewSubcomment(e.target.value)}
                          placeholder="Phản hồi..."
                          style={{
                            overflow: "hidden",
                            resize: "none",
                          }}
                        />
                        <button
                          className="subComment-btn"
                          onClick={() => {
                            handleAddSubcomment(comment.id, newSubcomment);
                            setNewSubcomment(""); // Reset input
                          }}
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              </div>
            ))
          )}
        </div>
        {/* MODAL XÁC NHẬN XOÁ COMMENT VÀ SUBCOMMENT */}
        {isDeleteModalOpen && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete} // Đảm bảo được truyền vào đúng cách
            deleteType={deleteType}
          />
        )}
      </div>
    </div>
  );
};

export default Comments;
