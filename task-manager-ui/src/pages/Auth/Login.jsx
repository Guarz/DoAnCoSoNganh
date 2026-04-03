import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../style/Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        alert("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng!"
      );
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card shadow-lg">
        <div className="login-left d-none d-md-flex">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/300x400/ffebee/d63384?text=Fashion+Shop"
              alt="Fashion"
              className="img-fluid mb-3"
            />
            <h4 className="fw-bold" style={{ color: "#d63384" }}>
              SHOP QUẦN ÁO A
            </h4>
            <p className="text-muted">Nâng tầm phong cách của bạn</p>
          </div>
        </div>

        <div className="login-right">
          <div className="form-header">
            <h2 className="login-title">Đăng Nhập</h2>
            <p className="text-muted">Vui lòng nhập thông tin khách hàng</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small text-center shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-4">
            <div className="mb-4">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control custom-input"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Mật khẩu</label>
              <input
                type="password"
                className="form-control custom-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login-submit">
              TIẾP TỤC
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                style={{ color: "#d63384" }}
                className="fw-bold"
              >
                Tạo tài khoản mới
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
