import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      // Sau khi xóa xong, điều hướng về trang chủ hoặc trang login
      navigate("/login");
      // Load lại trang một lần để Header cập nhật lại trạng thái (hoặc dùng Context API/Redux nếu bạn nâng cấp sau này)
      window.location.reload();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/" style={{ color: "#d63384" }}>
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
              <Link className="nav-link fw-semibold" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/products">Sản Phẩm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/cart">Giỏ hàng</Link>
            </li>
            {/* Chỉ hiện Lịch sử và Thông tin nếu đã đăng nhập */}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/orders">Lịch sử</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/profile">Thông tin</Link>
                </li>
              </>
            )}
          </ul>

          {/* User Actions - KIỂM TRA ĐĂNG NHẬP Ở ĐÂY */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              // NẾU ĐÃ ĐĂNG NHẬP
              <>
                <span className="text-muted small">
                  Chào, <b style={{ color: "#d63384" }}>{user.name || user.email}</b>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm fw-bold px-3 rounded-pill"
                >
                  Thoát
                </button>
              </>
            ) : (
              // NẾU CHƯA ĐĂNG NHẬP
              <>
                <Link 
                  to="/login" 
                  className="btn btn-sm fw-bold px-4 rounded-pill"
                  style={{ backgroundColor: "#d63384", color: "white" }}
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