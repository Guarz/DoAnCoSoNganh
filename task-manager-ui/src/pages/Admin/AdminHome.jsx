import { Link } from "react-router-dom";

function AdminHome() {
  return (
    <div style={container}>

      <h1 style={title}>👋 Chào mừng Admin</h1>
      <p style={subtitle}>Hệ thống quản lý cửa hàng quần áo</p>

      {/* CARD THỐNG KÊ */}
      <div style={cardContainer}>

        <div style={card}>
          <h3>📦 Sản phẩm</h3>
          <p style={number}>12</p>
          <Link to="/admin/products" style={link}>
            Quản lý
          </Link>
        </div>

        <div style={card}>
          <h3>🧾 Đơn hàng</h3>
          <p style={number}>5</p>
          <Link to="/admin/orders" style={link}>
            Quản lý
          </Link>
        </div>

        <div style={card}>
          <h3>📊 Dashboard</h3>
          <p>Xem thống kê</p>
          <Link to="/admin" style={link}>
            Mở
          </Link>
        </div>

      </div>

      {/* TRUY CẬP NHANH */}
      <div style={{ marginTop: 40 }}>
        <h2>⚡ Truy cập nhanh</h2>

        <div style={{ display: "flex", gap: 20, marginTop: 15 }}>

          <Link to="/admin/products" style={btn}>
            ➕ Thêm sản phẩm
          </Link>

          <Link to="/admin/orders" style={btn}>
            📦 Quản lý đơn hàng
          </Link>

        </div>
      </div>

    </div>
  );
}

export default AdminHome;



/* ================= STYLE ================= */

const container = {
  maxWidth: 1100,
  margin: "40px auto",
  padding: 20
};

const title = {
  fontSize: 36,
  fontWeight: "bold"
};

const subtitle = {
  color: "#666",
  marginBottom: 30
};

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20
};

const card = {
  background: "#fff",
  padding: 25,
  borderRadius: 15,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  textAlign: "center",
  transition: "0.3s"
};

const number = {
  fontSize: 28,
  fontWeight: "bold",
  margin: "10px 0"
};

const link = {
  color: "#d63384",
  textDecoration: "none",
  fontWeight: "bold"
};

const btn = {
  background: "linear-gradient(135deg,#ff4d8d,#d63384)",
  color: "white",
  padding: "12px 20px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: "bold"
};