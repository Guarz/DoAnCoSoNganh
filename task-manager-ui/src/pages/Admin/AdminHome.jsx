import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Cài đặt bằng lệnh: npm install recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminHome() {
  // 1. State lưu trữ số liệu thống kê
  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_users: 0
  });

  // 2. Dữ liệu mẫu cho biểu đồ (Bạn có thể fetch từ API sau)
  const chartData = [
    { name: 'T1', value: 40 },
    { name: 'T2', value: 65 },
    { name: 'T3', value: 30 },
    { name: 'T4', value: 85 },
    { name: 'T5', value: 55 },
    { name: 'T6', value: 70 },
  ];

  // 3. Gọi API lấy dữ liệu thực tế từ Laravel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Thêm timestamp để ép trình duyệt tải dữ liệu mới nhất, giúp số 1 nhảy lên số 3 ngay lập tức
        const res = await fetch(`http://127.0.0.1:8000/api/admin/dashboard?t=${Date.now()}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Lỗi kết nối API Dashboard:", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>📊 HỆ THỐNG QUẢN TRỊ</h1>
        <p style={{ color: "#666" }}>Chào mừng bạn quay trở lại hệ thống quản lý</p>
      </header>

      {/* 4 Ô THỐNG KÊ (Khớp với image_60f31f.png) */}
      <div style={statsGridStyle}>
        <div style={cardStyle}>
          <div style={iconBoxStyle}>📦</div>
          <div>
            <p style={numberStyle}>{stats.total_products}</p>
            <p style={labelStyle}>Sản phẩm</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}>📂</div>
          <div>
            <p style={numberStyle}>{stats.total_categories}</p>
            <p style={labelStyle}>Danh mục</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}>📄</div>
          <div>
            <p style={numberStyle}>{stats.total_orders}</p>
            <p style={labelStyle}>Đơn hàng</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}>👤</div>
          <div>
            <p style={numberStyle}>{stats.total_users}</p>
            <p style={labelStyle}>Người dùng</p>
          </div>
        </div>
      </div>

    
      <div style={chartContainerStyle}>
        <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>📈 Biểu đồ tăng trưởng đơn hàng</h3>

        {/* Bắt buộc bọc trong div có height để ResponsiveContainer hoạt động */}
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
              <Tooltip cursor={{ fill: '#f5f5f5' }} />
              <Bar dataKey="value" fill="#ff4d8d" radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRUY CẬP NHANH */}
      <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
        <Link to="/admin/products" style={btnStyle}>Quản lý sản phẩm</Link>
        <Link to="/admin/categories" style={btnStyle}>Quản lý danh mục</Link>
        <Link to="/" style={btnOutlineStyle}>Quay lại cửa hàng</Link>
      </div>
    </div>
  );
}

export default AdminHome;

/* ================= STYLE CHUẨN GIAO DIỆN ================= */
const containerStyle = { padding: "30px", backgroundColor: "#f8faff", minHeight: "100vh", fontFamily: "sans-serif" };
const headerStyle = { marginBottom: "30px" };
const statsGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" };

const cardStyle = {
  backgroundColor: "#fff", padding: "20px", borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px"
};

const iconBoxStyle = { fontSize: "30px", backgroundColor: "#f0f2f5", padding: "12px", borderRadius: "12px" };
const numberStyle = { fontSize: "28px", fontWeight: "bold", color: "#ff4d8d", margin: 0 };
const labelStyle = { color: "#888", fontSize: "14px", margin: 0 };

const chartContainerStyle = {
  marginTop: "30px", backgroundColor: "#fff", padding: "25px",
  borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
};

const btnStyle = {
  padding: "12px 25px", backgroundColor: "#ff4d8d", color: "#fff",
  textDecoration: "none", borderRadius: "10px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(255, 77, 141, 0.3)"
};

const btnOutlineStyle = {
  padding: "12px 25px", border: "2px solid #ff4d8d", color: "#ff4d8d",
  textDecoration: "none", borderRadius: "10px", fontWeight: "bold"
};