import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchUsersFromFirebase } from "../../../../services/authService.js";
import "./UserStats.scss";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const UserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    users: 0,
    active: 0,
    pending: 0,
    locked: 0,
    newUsersLast7Days: 0,
    loggedInLast24h: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const userList = await fetchUsersFromFirebase();
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      const statsData = {
        totalUsers: userList.length,
        admins: userList.filter((user) => user.role === "admin").length,
        users: userList.filter((user) => user.role === "user").length,
        active: userList.filter((user) => user.status === "active").length,
        pending: userList.filter((user) => user.status === "pending").length,
        locked: userList.filter((user) => user.status === "locked").length,
        newUsersLast7Days: userList.filter(
          (user) => new Date(user.created_date).getTime() >= sevenDaysAgo
        ).length,
        loggedInLast24h: userList.filter(
          (user) => user.lastLoginAt && new Date(user.lastLoginAt).getTime() >= oneDayAgo
        ).length,
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Dữ liệu và cấu hình cho biểu đồ trạng thái
  const statusData = {
    labels: ["Hoạt động", "Chưa xác thực", "Khóa"],
    datasets: [
      {
        data: [stats.active, stats.pending, stats.locked],
        backgroundColor: ["#52c41a", "#faad14", "#ff4d4f"],
        hoverBackgroundColor: ["#73d13d", "#ffc107", "#ff7875"],
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} (${((context.raw / stats.totalUsers) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  // Dữ liệu và cấu hình cho biểu đồ vai trò
  const roleData = {
    labels: ["Admin", "User"],
    datasets: [
      {
        data: [stats.admins, stats.users],
        backgroundColor: ["#1890ff", "#13c2c2"],
        hoverBackgroundColor: ["#40a9ff", "#36cfc9"],
      },
    ],
  };
  const roleOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} (${((context.raw / stats.totalUsers) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="user-stats">
      <Row gutter={[16, 16]}>
        {/* Thống kê cơ bản */}
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="Tổng người dùng" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="Admin" value={stats.admins} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="User" value={stats.users} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="Hoạt động" value={stats.active} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="Chưa xác thực" value={stats.pending} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic title="Khóa" value={stats.locked} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic
              title={<span className="responsive-stat-title">User mới (7 ngày)</span>}
              value={stats.newUsersLast7Days}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card loading={loading}>
            <Statistic
              title={<span className="responsive-stat-title">Đăng nhập (24h)</span>}
              value={stats.loggedInLast24h}
            />
          </Card>
        </Col>

        {/* Biểu đồ  */}
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card title="Tỷ lệ trạng thái" loading={loading}>
            <div className="chart-container">
              <Pie data={statusData} options={statusOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card title="Tỷ lệ vai trò" loading={loading}>
            <div className="chart-container">
              <Pie data={roleData} options={roleOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserStats;
