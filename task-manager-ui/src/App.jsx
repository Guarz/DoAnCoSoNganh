import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import { useState } from "react";

import Login from "./pages/Login";

import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import ProductDetail from "./pages/Admin/ProductDetail";
import AdminOrders from "./pages/Admin/AdminOrders";

import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";
import HomePage from "./pages/User/HomePage";

function App() {

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>

      <div style={{ minHeight: "100vh", background: "#fff0f5" }}>

        {/* NAVBAR */}
        <nav style={navStyle}>
          <div style={navInnerStyle}>

            <Link to="/" style={logoStyle}>
              SHOP QUẦN ÁO A
            </Link>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>

              {/* ADMIN MENU */}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin/home" style={linkStyle}>
                    Trang chủ
                  </Link>

                  <Link to="/admin" style={linkStyle}>
                    Dashboard
                  </Link>

                  <Link to="/admin/products" style={linkStyle}>
                    Sản phẩm
                  </Link>

                  <Link to="/admin/orders" style={linkStyle}>
                    Đơn hàng
                  </Link>
                </>
              )}

              {/* USER MENU */}
              {user?.role !== "admin" && (
                <>
                  <Link to="/user/home" style={linkStyle}>
                    Trang chủ
                  </Link>

                  <Link to="/cart" style={linkStyle}>
                    Giỏ hàng
                  </Link>
                </>
              )}

              {user ? (
                <>
                  {user.role !== "admin" && (
                    <Link to="/user/orders" style={linkStyle}>
                      Lịch sử mua hàng
                    </Link>
                  )}

                  <span>{user.name}</span>

                  <button onClick={logout} style={btnLogoutStyle}>
                    Thoát
                  </button>
                </>
              ) : (
                <Link to="/login" style={btnLoginStyle}>
                  Đăng nhập
                </Link>
              )}

            </div>
          </div>
        </nav>

        {/* ROUTER */}
        <Routes>

          {/* USER */}
          <Route path="/" element={<HomePage />} />
          <Route path="/user/home" element={<HomePage />} />

          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/user/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" />}
          />

          <Route path="/user" element={<Navigate to="/" replace />} />

          {/* ADMIN */}

          <Route
            path="/admin/home"
            element={
              user?.role === "admin"
                ? <AdminHome />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin"
            element={
              user?.role === "admin"
                ? <AdminDashboard />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/products"
            element={
              user?.role === "admin"
                ? <ProductManagement />
                : <Navigate to="/login" />
            }
          />

          {/* CHI TIẾT SẢN PHẨM */}
          <Route
            path="/admin/product/:id"
            element={
              user?.role === "admin"
                ? <ProductDetail />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/orders"
            element={
              user?.role === "admin"
                ? <AdminOrders />
                : <Navigate to="/login" />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<h2 style={{ padding: 30 }}>404 - Không tìm thấy trang</h2>}
          />

        </Routes>

      </div>

    </Router>
  );
}

export default App;


/* ================= STYLE ================= */

const navStyle = {
  background: "#fff",
  padding: 15,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const navInnerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
};

const logoStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: "#d63384",
  textDecoration: "none",
};

const linkStyle = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "#333",
};

const btnLoginStyle = {
  background: "#d63384",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: 20,
  textDecoration: "none",
};

const btnLogoutStyle = {
  border: "1px solid #dc3545",
  color: "#dc3545",
  background: "none",
  padding: "6px 10px",
  cursor: "pointer"
};