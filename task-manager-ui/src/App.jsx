import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Layout
import UserLayout from "./layouts/UserLayout";

// USER AUTH
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ADMIN AUTH
import AdminLogin from "./pages/Admin/AdminLogin";

// USER PAGES
import HomePage from "./pages/User/HomePage";
import CartPage from "./pages/User/CartPage";
import UserOrders from "./pages/User/UserOrders";
import UserProductDetail from "./pages/User/ProductDetail";
import ProductList from "./pages/User/ProductList";
import Checkout from "./pages/User/Checkout";
import Profile from "./pages/User/Profile";

// ADMIN PAGES
import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import ProductDetail from "./pages/Admin/ProductDetail";
import AdminOrders from "./pages/Admin/AdminOrders";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import UserManagement from "./pages/Admin/UserManagement";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  ========================
  LOAD USER FROM LOCAL
  ========================
  */

  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);

  }, []);

  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: 50 }}>Loading...</h3>;
  }

  const isAdmin = user?.role === "admin";

  return (

    <Router>

      <Routes>

        {/* ================= USER ================= */}

        <Route element={<UserLayout user={user} setUser={setUser} />}>

          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<UserProductDetail />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" />}
          />

        </Route>


        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin/login"
          element={
            isAdmin
              ? <Navigate to="/admin/dashboard" />
              : <AdminLogin setUser={setUser} />
          }
        />


        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin/dashboard"
          element={
            isAdmin
              ? <AdminDashboard />
              : <Navigate to="/admin/login" />
          }
        />


        {/* ================= ADMIN HOME ================= */}

        <Route
          path="/admin/home"
          element={
            isAdmin
              ? <AdminHome />
              : <Navigate to="/admin/login" />
          }
        />


        {/* ================= PRODUCT MANAGEMENT ================= */}

        <Route
          path="/admin/products"
          element={
            isAdmin
              ? <ProductManagement />
              : <Navigate to="/admin/login" />
          }
        />

        <Route
          path="/admin/product/:id"
          element={
            isAdmin
              ? <ProductDetail />
              : <Navigate to="/admin/login" />
          }
        />


        {/* ================= ORDERS ================= */}

        <Route
          path="/admin/orders"
          element={
            isAdmin
              ? <AdminOrders />
              : <Navigate to="/admin/login" />
          }
        />


        {/* ================= CATEGORIES ================= */}

        <Route
          path="/admin/categories"
          element={
            isAdmin
              ? <CategoryManagement />
              : <Navigate to="/admin/login" />
          }
        />


        {/* ================= USERS ================= */}

        <Route
          path="/admin/users"
          element={
            isAdmin
              ? <UserManagement />
              : <Navigate to="/admin/login" />
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