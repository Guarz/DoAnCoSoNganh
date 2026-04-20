import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CountUp from "react-countup";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "../../style/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_user: 0,
    total_revenue: 0,
  });
  const [chartData, setChartData] = useState([]);

  const loadDashboard = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard");
      setStats({
        total_products: res.data.totalProducts || 0,
        total_categories: res.data.totalCategories || 0,
        total_orders: res.data.totalOrders || 0,
        total_user: res.data.totalUser || 0,
        total_revenue: res.data.totalRevenue || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadChart = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/revenue-chart"
      );
      setChartData(
        res.data.map((item) => ({
          name: "T" + item.month,
          month: item.month,
          revenue: Number(item.revenue),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await loadDashboard();
      await loadChart();
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) return;
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  const handleBarClick = (data) => {
    navigate(`/admin/revenue?month=${data.month}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-info">
          <h2 className="dashboard-title">
            <i className="bi bi-speedometer2 title-icon"></i> HỆ THỐNG QUẢN TRỊ
          </h2>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> <span>Đăng xuất</span>
        </button>
      </header>

      <div className="dashboard-grid">
        <StatBox
          iconClass="bi bi-box-seam"
          label="Sản phẩm"
          value={stats.total_products}
          color="#4318FF"
          onClick={() => navigate("/admin/products")}
        />

        <StatBox
          iconClass="bi bi-tags"
          label="Danh mục"
          value={stats.total_categories}
          color="#6AD2FF"
          onClick={() => navigate("/admin/categories")}
        />

        <StatBox
          iconClass="bi bi-cart-check"
          label="Đơn hàng"
          value={stats.total_orders}
          color="#FF4081"
          onClick={() => navigate("/admin/orders")}
        />

        <StatBox
          iconClass="bi bi-people"
          label="Người dùng"
          value={stats.total_user}
          color="#1B2559"
          onClick={() => navigate("/admin/user")}
        />

        <StatBox
          iconClass="bi bi-cash-stack"
          label="Doanh thu"
          value={stats.total_revenue}
          color="#00C853"
          onClick={() => navigate("/admin/revenue")}
        />
      </div>

      <div className="chart-box">
        <h3 className="chart-title">Thống kê doanh thu theo tháng</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />

              {/* ✅ FIX: chỉ giữ 1 YAxis */}
              <YAxis
                tickFormatter={(v) => v.toLocaleString("vi-VN")}
                width={100}
              />

              <Tooltip
                formatter={(v) =>
                  new Intl.NumberFormat("vi-VN").format(v) + " đ"
                }
              />

              <Bar
                dataKey="revenue"
                fill="#4318FF"   // 🔥 GIỮ NGUYÊN MÀU
                radius={[6, 6, 0, 0]}
                barSize={45}
                onClick={(data) => handleBarClick(data)}
                className="bar-hover"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ===== STAT BOX ===== */
function StatBox({ iconClass, label, value, onClick, color }) {
  return (
    <div className="stat-card" onClick={onClick}>
      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: color + "15", // 🔥 giữ màu
          color: color,
        }}
      >
        <i className={iconClass}></i>
      </div>

      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <h3 className="stat-value">
          <CountUp end={value} duration={1.5} separator="," />
        </h3>
      </div>
    </div>
  );
}

export default AdminDashboard;