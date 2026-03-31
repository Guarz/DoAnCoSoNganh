import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import "../../style/dashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });

    /*
    ==========================
    LOAD DASHBOARD DATA
    ==========================
    */

    const loadDashboard = async () => {

        try {

            const res = await axios.get(
                "http://127.0.0.1:8000/api/admin/dashboard"
            );

            setData({
                total_products: res.data.totalProducts || 0,
                total_categories: res.data.totalCategories || 0,
                total_orders: res.data.totalOrders || 0,
                total_users: res.data.totalUsers || 0
            });

        } catch (error) {

            console.error("Dashboard API error:", error);

        } finally {

            setLoading(false);

        }

    };


    /*
    ==========================
    CHECK LOGIN
    ==========================
    */

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {

            window.location.href = "/admin/login";
            return;

        }

        let user;

        try {

            user = JSON.parse(storedUser);

        } catch (error) {

            localStorage.removeItem("user");
            window.location.href = "/admin/login";
            return;

        }

        if (!user || user.role !== "admin") {

            localStorage.removeItem("user");
            window.location.href = "/admin/login";
            return;

        }

        loadDashboard();

    }, []);


    /*
    ==========================
    LOGOUT
    ==========================
    */

    const handleLogout = () => {

        if (!window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            return;
        }

        // xoá session
        localStorage.removeItem("user");

        // reload app để tránh loop React Router
        window.location.href = "/admin/login";

    };


    /*
    ==========================
    DEMO CHART DATA
    ==========================
    */

    const chartData = [
        { name: "T1", orders: 40 },
        { name: "T2", orders: 65 },
        { name: "T3", orders: 30 },
        { name: "T4", orders: 90 },
        { name: "T5", orders: 55 },
        { name: "T6", orders: 70 }
    ];


    if (loading) {

        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <h3 style={{ marginTop: 20 }}>
                    Đang tải dữ liệu...
                </h3>
            </div>
        );

    }


    return (

        <div className="admin-dashboard">

            {/* HEADER */}

            <header className="dashboard-header">

                <div>

                    <h2 className="dashboard-title">
                        📊 HỆ THỐNG QUẢN TRỊ
                    </h2>

                    <p className="dashboard-subtitle">
                        Chào mừng Quản trị viên quay trở lại
                    </p>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>

            </header>


            {/* STATISTICS */}

            <div className="dashboard-grid">

                <StatBox
                    icon="📦"
                    label="Sản phẩm"
                    value={data.total_products}
                    color="#4318FF"
                    onClick={() => navigate("/admin/products")}
                />

                <StatBox
                    icon="📂"
                    label="Danh mục"
                    value={data.total_categories}
                    color="#6AD2FF"
                    onClick={() => navigate("/admin/categories")}
                />

                <StatBox
                    icon="🧾"
                    label="Đơn hàng"
                    value={data.total_orders}
                    color="#FF4081"
                    onClick={() => navigate("/admin/orders")}
                />

                <StatBox
                    icon="👤"
                    label="Người dùng"
                    value={data.total_users}
                    color="#422AFB"
                    onClick={() => navigate("/admin/users")}
                />

            </div>


            {/* CHART */}

            <div className="chart-box">

                <h3 className="chart-title">
                    📈 Biểu đồ tăng trưởng đơn hàng
                </h3>

                <div style={{ width: "100%", height: 350 }}>

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={chartData}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="orders"
                                fill="#ff4081"
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

}


/*
==========================
STAT BOX
==========================
*/

function StatBox({ icon, label, value, onClick, color }) {

    return (

        <div
            className="stat-box"
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}
        >

            <div
                className="stat-icon"
                style={{
                    backgroundColor: `${color}20`,
                    color: color
                }}
            >
                {icon}
            </div>

            <div className="stat-info">

                <span className="stat-label">
                    {label}
                </span>

                <span className="stat-value">
                    {Number(value).toLocaleString()}
                </span>

            </div>

        </div>

    );

}

export default AdminDashboard;