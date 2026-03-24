import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Nhận user và setUser từ App.jsx
const UserLayout = ({ user, setUser }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* TRUYỀN user VÀO ĐÂY: Để Header luôn nhận dữ liệu mới nhất */}
      <Header user={user} setUser={setUser} cartCount={cart.length} />
      
      <main className="flex-grow-1">
        {/* Truyền cả giỏ hàng và user xuống các trang con nếu cần */}
        <Outlet context={{ cart, setCart, user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;