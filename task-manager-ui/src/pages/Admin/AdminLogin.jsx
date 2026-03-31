import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/adminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sử dụng useCallback để tránh tạo lại hàm mỗi lần render
    const checkAuth = useCallback(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user && user.role === "admin") {
                    // Sử dụng replace để không lưu trang login vào history
                    navigate("/admin/dashboard", { replace: true });
                }
            } catch (error) {
                console.error("Lỗi parse user từ localStorage:", error);
                localStorage.removeItem("user");
            }
        }
    }, [navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/admin-login",
                { email, password },
                { timeout: 5000 } // Thêm timeout để tránh chờ quá lâu
            );

            if (res.data.success) {
                // Đảm bảo lấy đúng user data từ res.data
                const adminData = {
                    ...(res.data.user || res.data.admin),
                    role: "admin",
                    loginAt: new Date().toISOString()
                };

                localStorage.setItem("user", JSON.stringify(adminData));
                alert("Đăng nhập hệ thống quản trị thành công!");

                // Chuyển hướng ngay lập tức
                navigate("/admin/dashboard", { replace: true });
            } else {
                alert(res.data.message || "Sai tài khoản hoặc mật khẩu");
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Không thể kết nối đến máy chủ";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-left">
                    <div className="brand-content">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                            alt="Fashion"
                            className="brand-icon"
                        />
                        <h1>SHOP QUẦN ÁO A</h1>
                        <p>Nâng tầm phong cách quản trị</p>
                    </div>
                </div>

                <div className="admin-login-right">
                    <div className="form-header">
                        <h2>Admin Login</h2>
                        <p>Vui lòng nhập thông tin hệ thống</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="input-group">
                            <label>Email Admin</label>
                            <input
                                type="email"
                                placeholder="admin@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-admin-submit"
                        >
                            {loading ? "⚡ Đang xác thực..." : "Đăng nhập hệ thống"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;