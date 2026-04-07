import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm custom-navbar sticky-top bg-white">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold logo-text" to="/">
          SHOP QUẦN ÁO A
        </Link>

        {/* Nút bấm Menu cho Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Menu bên trái - Rút gọn */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold nav-link-custom" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold nav-link-custom" to="/products">
                Sản Phẩm
              </Link>
            </li>
          </ul>

          {/* Cụm icon và nút bên phải */}
          <div className="d-flex align-items-center gap-4">
            {/* Luôn hiện Giỏ hàng */}
            <Link to="/cart" className="nav-icon-link position-relative text-dark">
              <i className="bi bi-cart3 fs-4"></i>
            </Link>

            {user ? (
              <>
                {/* Icon Lịch sử đơn hàng */}
                <Link to="/orders" className="nav-icon-link text-dark" title="Lịch sử đơn hàng">
                  <i className="bi bi-receipt fs-4"></i>
                </Link>

                {/* Thông tin User & Logout */}
                <div className="d-flex align-items-center gap-2 border-start ps-3">
                  <Link to="/profile" className="text-decoration-none d-flex align-items-center gap-2 text-dark">
                    <i className="bi bi-person-circle fs-4 text-pink"></i>
                    <span className="fw-semibold d-none d-md-inline small">
                      {user.name || "User"}
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-danger p-0 ms-2"
                    title="Đăng xuất"
                  >
                    <i className="bi bi-box-arrow-right fs-4"></i>
                  </button>
                </div>
              </>
            ) : (
              /* Nút Đăng nhập bằng Icon User khi chưa có tài khoản */
              <Link to="/login" className="btn-login-icon text-dark" title="Đăng nhập">
                <div className="d-flex align-items-center gap-2 border px-3 py-1 rounded-pill hover-shadow">
                  <i className="bi bi-person fs-4"></i>
                  <span className="fw-bold small">Đăng nhập</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;