import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Pages USER
import Login from "./pages/Login";
import HomePage from "./pages/User/HomePage";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";

// Pages ADMIN
import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import ProductDetail from "./pages/Admin/ProductDetail";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  return (
    <Router>

      <Routes>

        {/* ================= USER LAYOUT ================= */}
        <Route element={<UserLayout />}>

          <Route path="/" element={<HomePage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/user/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" />}
          />

        </Route>


        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />


        {/* ================= ADMIN ================= */}

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


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<h2 style={{ padding: 30 }}>404 - Không tìm thấy trang</h2>}
        />

      </Routes>

    </Router>
  );
}

export default App;