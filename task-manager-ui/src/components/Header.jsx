import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Header.css"; 

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm custom-navbar">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold logo-text" to="/">
          SHOP QUẦN ÁO A
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold nav-link-custom" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold nav-link-custom"
                to="/products"
              >
                Sản Phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold nav-link-custom" to="/cart">
                Giỏ hàng
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold nav-link-custom"
                    to="/orders"
                  >
                    Lịch sử
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold nav-link-custom"
                    to="/profile"
                  >
                    Thông tin
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-muted small">
                  Chào,{" "}
                  <b className="user-welcome-text">{user.name || user.email}</b>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm fw-bold px-3 rounded-pill btn-logout-custom"
                >
                  Thoát
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-sm fw-bold px-4 rounded-pill btn-login-pink"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline-secondary btn-sm fw-bold px-4 rounded-pill"
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
