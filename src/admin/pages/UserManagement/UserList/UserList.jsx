import React, { useState, useEffect } from "react";
import { Table, Dropdown, Button, Modal, Radio } from "antd";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import "./UserList.scss";
import {
  fetchUsersFromFirebase,
  lockUserFromFirebase,
  deleteUserFromFirebase,
  unlockUserFromFirebase,
} from "../../../../services/authService.js";
import { exportToExcel, exportToPDF } from "./exportUtils.js";
import { toast } from "react-toastify";

const UserList = () => {
  const [allUsers, setAllUsers] = useState([]); // Dữ liệu gốc từ Firebase
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu đã lọc
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách người dùng từ Firebase (chỉ gọi 1 lần khi mount)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userList = await fetchUsersFromFirebase();
      setAllUsers(userList);
      setFilteredUsers(userList);
      setTotal(userList.length);
    } catch (error) {
      // Toast đã được xử lý trong authService
    } finally {
      setLoading(false);
    }
  };

  // Gọi API một lần khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Áp dụng bộ lọc và tìm kiếm mỗi khi filters hoặc searchTerm thay đổi
  useEffect(() => {
    let filtered = [...allUsers];

    // Áp dụng bộ lọc từ filters
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter((user) =>
        Object.keys(filters).every((key) => user[key] === filters[key])
      );
    }

    // Áp dụng tìm kiếm từ searchTerm
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
    setTotal(filtered.length);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  }, [filters, searchTerm, allUsers]);

  // Hàm tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Hàm lọc
  const handleFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Hàm xóa bộ lọc
  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Hàm khóa tài khoản
  const lockUserHandler = async (userId) => {
    try {
      await lockUserFromFirebase(userId);
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      // Toast đã được xử lý trong authService
    }
  };

  // Hàm mở khóa tài khoản
  const unlockUserHandler = async (userId) => {
    try {
      await unlockUserFromFirebase(userId);
      fetchUsers(); // Làm mới danh sách
    } catch (error) {
      // Toast đã được xử lý trong authService
    }
  };

  // Hàm xóa tài khoản
  const deleteUserHandler = async (userId) => {
    try {
      await deleteUserFromFirebase(userId);
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      // Toast đã được xử lý trong authService
    }
  };
  // Hàm xuất báo cáo
  const handleExport = () => {
    try {
      if (exportFormat === "excel") {
        exportToExcel(filteredUsers, "danh_sach_nguoi_dung");
      } else {
        exportToPDF(filteredUsers, "danh_sach_nguoi_dung");
      }
      setIsExportModalVisible(false);
    } catch (error) {
      toast.error("Xuất báo cáo thất bại");
      console.error("Export error:", error);
    }
  };

  const roles = [...new Set(allUsers.map((user) => user.role))];
  const statuses = [...new Set(allUsers.map((user) => user.status))];

  const columns = [
    { title: "UDI", dataIndex: "id", key: "id" },
    {
      title: "Tên",
      dataIndex: "fullname",
      key: "fullname",
      render: (_, record) => record.fullname || record.displayName, // Dữ liệu fullname hoặc displayName
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span className={`role-tag role-${role}`}>{role === "admin" ? "Admin" : "User"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-tag status-${status}`}>
          {status === "active"
            ? "Active"
            : status === "pending"
              ? "Pending"
              : status === "locked"
                ? "Lock"
                : "canceled"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => {
              setSelectedUser(record);
              setIsModalVisible(true);
            }}>
            Xem
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="user-list">
      <div className="toolbar">
        <Dropdown
          menu={{
            items: roles.map((role) => ({
              key: role,
              label: role === "admin" ? "Admin" : "User",
              onClick: () => handleFilter("role", role),
            })),
          }}>
          <Button>Vai trò</Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: statuses.map((status) => ({
              key: status,
              label:
                status === "active" ? "Hoạt động" : status === "pending" ? "Chưa xác thực" : "Khóa",
              onClick: () => handleFilter("status", status),
            })),
          }}>
          <Button>Trạng thái</Button>
        </Dropdown>
        <Button onClick={() => setIsExportModalVisible(true)}>Xuất báo cáo</Button>
        {Object.keys(filters).length > 0 || searchTerm ? (
          <Button onClick={handleClearFilters} className="delete-filter-btn">
            Xóa bộ lọc
          </Button>
        ) : null}
        <div className="user-list-search">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Tìm theo tên, email, số điện thoại"
            value={searchTerm}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{
          pageSize: 15,
          current: currentPage,
          total: total,
          onChange: (page) => setCurrentPage(page),
        }}
        loading={loading}
      />

      <Modal
        title="Chi tiết tài khoản"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          selectedUser?.status === "locked" ? (
            <Button
              key="unlock"
              type="primary"
              onClick={() => {
                unlockUserHandler(selectedUser?.id);
                setIsModalVisible(false);
              }}>
              Mở khóa
            </Button>
          ) : (
            <Button
              key="lock"
              danger
              onClick={() => lockUserHandler(selectedUser?.id)}
              disabled={selectedUser?.status === "locked"}>
              Khóa tài khoản
            </Button>
          ),
          <Button
            key="delete"
            danger
            onClick={() => deleteUserHandler(selectedUser?.id)}
            disabled={true} // Vô hiệu hóa nút xóa theo yêu cầu
          >
            Xóa tài khoản
          </Button>,
        ]}>
        {selectedUser && (
          <div>
            <p>
              <strong>Tên:</strong> {selectedUser.fullname || selectedUser.displayName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedUser.phone || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Vai trò:</strong> {selectedUser.role === "admin" ? "Admin" : "User"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedUser.status === "active"
                ? "Hoạt động"
                : selectedUser.status === "pending"
                  ? "Chưa xác thực"
                  : "Khóa"}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedUser.created_date}
            </p>
            <p>
              <strong>Lần đăng nhập cuối:</strong> {selectedUser.lastLoginAt || "Chưa xác định"}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal xuất báo cáo */}
      <Modal
        title="Xuất báo cáo"
        open={isExportModalVisible}
        onOk={handleExport}
        onCancel={() => setIsExportModalVisible(false)}
        okText="Xuất"
        cancelText="Hủy"
        okButtonProps={{ disabled: filteredUsers.length === 0 }}>
        <p style={{ marginBottom: 16 }}>Chọn định dạng xuất báo cáo:</p>
        <Radio.Group
          onChange={(e) => setExportFormat(e.target.value)}
          value={exportFormat}
          style={{ display: "flex", gap: 16 }}>
          <Radio value="excel">Excel (.xlsx)</Radio>
          <Radio value="pdf">PDF (.pdf)</Radio>
        </Radio.Group>
        {filteredUsers.length === 0 && (
          <p style={{ color: "#ff4d4f", marginTop: 8 }}>Không có dữ liệu để xuất</p>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
