import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/adminLogin.css";

function AdminLogin({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
    =========================
    CHECK ADMIN LOGIN
    =========================
    */

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);

      if (user && user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Parse user error:", error);
      localStorage.removeItem("user");
    }
  }, [navigate]);

  /*
    =========================
    HANDLE LOGIN
    =========================
    */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ Email và mật khẩu");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin-login", {
        email: email,
        password: password,
      });

      if (res.data.success) {
        const adminData = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: "admin",
        };

        // lưu local
        localStorage.setItem("user", JSON.stringify(adminData));

        // cập nhật state App.jsx
        setUser(adminData);

        navigate("/admin/dashboard", { replace: true });

        return;
      }

      alert(res.data.message || "Sai tài khoản hoặc mật khẩu");
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message || "Không thể kết nối server";

      alert(message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* LEFT */}

        <div className="admin-login-left">
          <div className="brand-content">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
              alt="shop"
              className="brand-icon"
            />

            <h1>SHOP QUẦN ÁO A</h1>

            <p>Hệ thống quản trị cửa hàng</p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="admin-login-right">
          <div className="form-header">
            <h2>Admin Login</h2>

            <p>Đăng nhập để quản lý hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="admin-form">
            {/* EMAIL */}

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <label>Mật khẩu</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-submit"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập hệ thống"}
            </button>
          </form>

          <div className="form-footer">
            <p>© 2026 Shop Quần Áo A</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
