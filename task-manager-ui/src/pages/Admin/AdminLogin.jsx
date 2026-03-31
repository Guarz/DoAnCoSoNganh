import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/adminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    /*
    =========================
    KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
    =========================
    */
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Kiểm tra nếu role là admin thì điều hướng ngay
                if (user && user.role === "admin") {
                    navigate("/admin/dashboard", { replace: true });
                }
            } catch (error) {
                console.error("Lỗi dữ liệu đăng nhập cũ:", error);
                localStorage.removeItem("user");
            }
        }
    }, []); // ĐỂ MẢNG RỖNG: Chỉ chạy 1 lần duy nhất khi load trang để tránh loop

    /*
    =========================
    XỬ LÝ ĐĂNG NHẬP
    =========================
    */
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Vui lòng điền đầy đủ Email và Mật khẩu!");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/admin-login",
                {
                    email: email,
                    password: password
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (res.data.success) {
                const adminData = {
                    id: res.data.user.id,
                    name: res.data.user.name,
                    email: res.data.user.email,
                    role: "admin",
                    token: res.data.token || null
                };

                // Lưu vào localStorage
                localStorage.setItem("user", JSON.stringify(adminData));

                // Điều hướng ngay lập tức
                navigate("/admin/dashboard", { replace: true });
            } else {
                alert(res.data.message || "Tài khoản hoặc mật khẩu không chính xác!");
            }

        } catch (error) {
            console.error("Lỗi kết nối Login:", error);
            const errorMsg = error.response?.data?.message || "Máy chủ không phản hồi, vui lòng thử lại sau!";
            alert(errorMsg);
        } finally {
            // Chỉ tắt loading nếu KHÔNG chuyển trang (để tránh lỗi update state trên component đã unmount)
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">

                {/* PHẦN BÊN TRÁI - BRANDING */}
                <div className="admin-login-left">
                    <div className="brand-content">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                            alt="Shop Icon"
                            className="brand-icon"
                        />
                        <h1>SHOP QUẦN ÁO A</h1>
                        <p>Hệ thống quản lý nội bộ chuyên nghiệp</p>
                    </div>
                </div>

                {/* PHẦN BÊN PHẢI - FORM */}
                <div className="admin-login-right">
                    <div className="form-header">
                        <h2>Admin Login</h2>
                        <p>Đăng nhập để quản lý cửa hàng của bạn</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-form">

                        {/* EMAIL */}
                        <div className="input-group">
                            <label>Email Admin</label>
                            <input
                                type="email"
                                placeholder="Nhập email quản trị..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        {/* MẬT KHẨU */}
                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        {/* NÚT ĐĂNG NHẬP */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-admin-submit ${loading ? "loading" : ""}`}
                        >
                            {loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                        </button>

                    </form>

                    <div className="form-footer">
                        <p>© 2026 Shop Quần Áo A - IT Department</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminLogin;