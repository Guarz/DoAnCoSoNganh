import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Pages
import Login from "./pages/Login";
import HomePage from "./pages/User/HomePage";
import CartPage from "./pages/CartPage";
import UserOrders from "./pages/User/UserOrders";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  return (
    <Router>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/orders" 
            element={user ? <UserOrders /> : <Navigate to="/login" replace />} 
          />
        </Route>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="*" element={<h2 style={{ padding: 50, textAlign: 'center' }}>404 - Không tìm thấy trang</h2>} />
      </Routes>
    </Router>
  );
}

export default App;