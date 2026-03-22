import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-danger" to="/">
          SHOP QUẦN ÁO A
        </Link>

        {/* Nút bấm Menu trên Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Danh sách Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/products">
                Sản Phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/cart">
                Giỏ hàng
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/orders">
                  Thông tin cá nhân
              </Link>
            </li>
          </ul>

          {/* User Actions */}
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">
              Chào, {user?.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm fw-bold"
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
