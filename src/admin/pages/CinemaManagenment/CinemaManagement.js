import { useState, useEffect, useCallback } from "react";
import {
  fetchCinemas,
  addCinema,
  deleteCinema,
  updateCinema,
} from "../../../services/service/serviceCinemas.js";
import { validateTheaterForm, isValidForm } from "../../utils/validation.js";
import { toast } from "react-toastify";

const useCinemaManagement = () => {
  const [cinemas, setCinemas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [sortCriterion, setSortCriterion] = useState("name");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Thêm state cho dialog xác nhận xóa
  const [editOpen, setEditOpen] = useState(false); // State cho dialog chỉnh sửa
  const [cinemaToDelete, setCinemaToDelete] = useState(null);
  const [newCinema, setNewCinema] = useState({
    name: "",
    city: "",
    location: "",
    is_protected: false,
    latitude: "",
    longitude: "",
    logo: "",
    phone_number: "",
    email: "",
    website: "",
    opening_hours: "",
    capacity: "",
    description: "",
    status: "active",
  });
  const [editCinema, setEditCinema] = useState(null); // State cho rạp đang chỉnh sửa
  const [errors, setErrors] = useState({
    name: "",
    city: "",
    location: "",
    latitude: "",
    longitude: "",
    logo: "",
    phone_number: "",
    email: "",
    website: "",
    opening_hours: "",
    capacity: "",
    description: "",
    status: "",
  });

  // LOAD DANH SÁCH RẠP
  const loadCinemas = async (page = 1) => {
    try {
      const cinemasData = await fetchCinemas();
      const sortMapping = {
        name: "cinema_name",
        city: "city",
        location: "location",
      };

      const filteredCinemas = cinemasData
        .filter((cinema) => {
          const matchName =
            cinema.cinema_name &&
            cinema.cinema_name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchCity =
            cinema.city && cinema.city.toLowerCase().includes(searchQuery.toLowerCase());
          const matchLocation =
            cinema.location && cinema.location.toLowerCase().includes(searchQuery.toLowerCase());
          return matchName || matchCity || matchLocation;
        })
        .sort((a, b) => {
          if (!sortCriterion) {
            return b.cinema_id - a.cinema_id;
          }
          const fieldA = a[sortMapping[sortCriterion]] || "";
          const fieldB = b[sortMapping[sortCriterion]] || "";
          return fieldA.localeCompare(fieldB);
        });

      const itemsPerPage = 7;
      const total = Math.ceil(filteredCinemas.length / itemsPerPage);
      setTotalPages(total);

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCinemas(filteredCinemas.slice(startIndex, endIndex));
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
      setCinemas([]);
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    loadCinemas(currentPage);
  }, [currentPage, searchQuery, sortCriterion]);

  // HANDLE MỞ MODAL THÊM RẠP MỚI
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCinema({
      name: "",
      city: "",
      location: "",
      is_protected: false,
      latitude: "",
      longitude: "",
      logo: "",
      phone_number: "",
      email: "",
      website: "",
      opening_hours: "",
      capacity: "",
      description: "",
      status: "active",
    });
    setErrors({
      name: "",
      city: "",
      location: "",
      latitude: "",
      longitude: "",
      logo: "",
      phone_number: "",
      email: "",
      website: "",
      opening_hours: "",
      capacity: "",
      description: "",
      status: "",
    });
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editOpen) {
      setEditCinema((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCinema((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // HANDLE THÊM RẠP
  const handleAddCinema = async () => {
    const validationErrors = validateTheaterForm(newCinema);
    setErrors(validationErrors);

    if (isValidForm(validationErrors)) {
      try {
        const newCinemaData = {
          name: newCinema.name,
          city: newCinema.city,
          location: newCinema.location,
          is_protected: newCinema.is_protected || false,
          latitude: parseFloat(newCinema.latitude), // Chuyển thành số
          longitude: parseFloat(newCinema.longitude), // Chuyển thành số
          logo: newCinema.logo,
          phone_number: newCinema.phone_number || "",
          email: newCinema.email || "",
          website: newCinema.website || "",
          opening_hours: newCinema.opening_hours,
          capacity: parseInt(newCinema.capacity) || 0, // Chuyển thành số
          description: newCinema.description,
          status: newCinema.status,
        };

        await addCinema(newCinemaData);
        toast.success("Thêm rạp mới thành công!");
        handleClose();
        setCurrentPage(1);
        loadCinemas(1);
      } catch (error) {
        console.error("Lỗi khi thêm rạp mới:", error);
        toast.error("Lỗi khi thêm rạp mới!");
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  // HÀM MỞ DIALOG XÁC NHẬN XÓA
  const handleOpenConfirmDelete = (cinemaKey, isProtected) => {
    if (isProtected) {
      toast.error("Bạn không thể xoá dữ liệu do Team phát triển xây dựng!");
      return;
    }
    setCinemaToDelete(cinemaKey);
    setConfirmDeleteOpen(true);
  };

  // HÀM ĐÓNG DIALOG XÁC NHẬN XÓA
  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setCinemaToDelete(null);
  };

  // HANDLE XOÁ RẠP
  const handleDeleteCinema = async () => {
    if (!cinemaToDelete) return;

    try {
      await deleteCinema(cinemaToDelete);
      toast.success("Xóa rạp thành công!");
      handleCloseConfirmDelete();
      loadCinemas(currentPage); // Tải lại danh sách rạp
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa rạp!");
    }
  };

  // MỞ DIALOG CHỈNH SỬA
  const handleOpenEdit = (cinema) => {
    if (cinema.is_protected) {
      toast.error("Bạn không thể chỉnh sửa dữ liệu do Team phát triển xây dựng!");
      return;
    }
    setEditCinema({
      id: cinema.id,
      name: cinema.cinema_name,
      city: cinema.city,
      location: cinema.location,
      latitude: cinema.latitude,
      longitude: cinema.longitude,
      logo: cinema.logo,
      phone_number: cinema.phone_number,
      email: cinema.email,
      website: cinema.website,
      opening_hours: cinema.opening_hours,
      capacity: cinema.capacity,
      description: cinema.description,
      status: cinema.status,
    });
    setEditOpen(true);
  };

  // ĐÓNG DIALOG CHỈNH SỬA
  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditCinema(null);
    setErrors({
      name: "",
      city: "",
      location: "",
      latitude: "",
      longitude: "",
      logo: "",
      phone_number: "",
      email: "",
      website: "",
      opening_hours: "",
      capacity: "",
      description: "",
      status: "",
    });
  };

  // HANDLE CHỈNH SỬA RẠP
  const handleUpdateCinema = async () => {
    const validationErrors = validateTheaterForm(editCinema);
    setErrors(validationErrors);

    if (isValidForm(validationErrors)) {
      try {
        const updatedCinemaData = {
          name: editCinema.name,
          city: editCinema.city,
          location: editCinema.location,
          latitude: parseFloat(editCinema.latitude),
          longitude: parseFloat(editCinema.longitude),
          logo: editCinema.logo,
          phone_number: editCinema.phone_number || "",
          email: editCinema.email || "",
          website: editCinema.website || "",
          opening_hours: editCinema.opening_hours,
          capacity: parseInt(editCinema.capacity) || 0,
          description: editCinema.description,
          status: editCinema.status,
        };

        await updateCinema(editCinema.id, updatedCinemaData);
        toast.success("Cập nhật rạp thành công!");
        handleCloseEdit();
        loadCinemas(currentPage);
      } catch (error) {
        console.error("Lỗi khi cập nhật rạp:", error);
        toast.error(error.message || "Lỗi khi cập nhật rạp!");
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin!");
    }
  };
  return {
    cinemas,
    currentPage,
    totalPages,
    searchQuery,
    open,
    sortCriterion,
    newCinema,
    errors,
    confirmDeleteOpen,
    setSortCriterion,
    handleSearch,
    handleOpen,
    handleClose,
    handleChangePage,
    handleChange,
    handleAddCinema,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDeleteCinema,
    editOpen,
    editCinema,
    handleOpenEdit,
    handleCloseEdit,
    handleUpdateCinema,
  };
};

export default useCinemaManagement;
