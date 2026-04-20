import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = ({ user, setUser }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} setUser={setUser} cartCount={cart.length} />

      <main className="flex-grow-1">
        <Outlet context={{ cart, setCart, user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
