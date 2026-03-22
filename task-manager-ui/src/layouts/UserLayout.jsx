import React from "react";
import { Outlet } from "react-router-dom"; // BẮT BUỘC PHẢI CÓ
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        {/* Đây là "cửa sổ" để HomePage, CartPage... hiện ra */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
