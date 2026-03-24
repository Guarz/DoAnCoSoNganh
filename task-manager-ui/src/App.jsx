import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Pages USER
import Login from "./pages/Login";
import HomePage from "./pages/User/HomePage";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";
import UserProductDetail from "./pages/User/ProductDetail";
import ProductList from "./pages/User/ProductList";
import Checkout from "./pages/User/Checkout";

// Pages ADMIN
import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import ProductDetail from "./pages/Admin/ProductDetail";
import AdminOrders from "./pages/Admin/AdminOrders";
import CategoryManagement from "./pages/Admin/CategoryManagement";

function App() {

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // ✅ CHECK ADMIN
  const isAdmin = user?.role === "admin";

  return (
    <Router>

      <Routes>

        {/* ================= USER ================= */}
        <Route element={<UserLayout />}>

          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<UserProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" replace />}
          />

        </Route>

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/home"
          element={
            isAdmin ? <AdminHome /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/products"
          element={
            isAdmin ? <ProductManagement /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/product/:id"
          element={
            isAdmin ? <ProductDetail /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/orders"
          element={
            isAdmin ? <AdminOrders /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/categories"
          element={
            isAdmin ? <CategoryManagement /> : <Navigate to="/login" replace />
          }
        />

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <h2 style={{ padding: 50, textAlign: "center" }}>
              404 - Không tìm thấy trang
            </h2>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;