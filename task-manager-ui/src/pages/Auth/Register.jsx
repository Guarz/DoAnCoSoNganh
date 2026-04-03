import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../style/Login.css";

const Register = () => {
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        ten: ten,
        email: email,
        password: password,
      });

      if (response.data.status === "success") {
        alert("Đăng ký thành công! Mời bạn đăng nhập.");
        navigate("/login");
      }
    } catch (err) {
      // Laravel trả về lỗi 422 nếu email đã tồn tại
      setError(
        err.response?.data?.message || "Email đã tồn tại hoặc lỗi hệ thống"
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow-lg border-0">
        <div className="login-right p-5">
          <h2 className="login-title text-center" style={{ color: "#d63384" }}>
            Đăng Ký
          </h2>
          <p className="text-center text-muted mb-4">
            Tạo tài khoản để mua sắm ngay
          </p>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-bold small">Họ và tên</label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Nhập tên của bạn"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">Email</label>
              <input
                type="email"
                className="form-control custom-input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small">Mật khẩu</label>
                <input
                  type="password"
                  padding="10px"
                  className="form-control custom-input"
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold small">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  padding="10px"
                  className="form-control custom-input"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-login-submit w-100">
              TẠO TÀI KHOẢN
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="small">Đã có tài khoản? </span>
            <Link
              to="/login"
              className="fw-bold"
              style={{ color: "#d63384", textDecoration: "none" }}
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
