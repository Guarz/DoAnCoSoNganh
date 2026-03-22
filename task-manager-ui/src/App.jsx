import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import UserLayout from "./layouts/UserLayout";
// import AdminLayout from "./layouts/AdminLayout"; // Tương tự nếu bạn làm Admin

// Pages
import Login from "./pages/Login";
import HomePage from "./pages/User/HomePage";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";
// ... import các trang Admin khác

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  return (
    <Router>
      <Routes>
        {/* ROUTE CHO GIAO DIỆN NGƯỜI DÙNG (Sử dụng UserLayout) */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/user/orders" 
            element={user ? <UserOrders /> : <Navigate to="/login" />} 
          />
        </Route>

        {/* ROUTE RIÊNG CHO LOGIN (Không có Header/Footer) */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* ROUTE CHO ADMIN (Bạn có thể tạo AdminLayout tương tự) */}
        {/* <Route element={<AdminLayout user={user} />}> ... </Route> */}

        <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
      </Routes>
    </Router>
  );
}

export default App;