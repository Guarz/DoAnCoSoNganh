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
    CHECK LOGIN + LOAD DATA
    ==========================
    */

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/admin/login");
            return;
        }

        try {

            const user = JSON.parse(storedUser);

            if (!user || user.role !== "admin") {
                navigate("/admin/login");
                return;
            }

        } catch (error) {

            localStorage.removeItem("user");
            navigate("/admin/login");
            return;

        }

        /*
        ==========================
        LẤY DỮ LIỆU DASHBOARD
        ==========================
        */

        axios
            .get("http://127.0.0.1:8000/api/admin/dashboard")
            .then((res) => {

                setData({
                    total_products: res.data.totalProducts,
                    total_categories: res.data.totalCategories,
                    total_orders: res.data.totalOrders,
                    total_users: res.data.totalUsers
                });

                setLoading(false);

            })
            .catch((err) => {

                console.error("Dashboard error:", err);
                setLoading(false);

            });

    }, [navigate]);


    /*
    ==========================
    LOGOUT
    ==========================
    */

    const handleLogout = () => {

        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {

            localStorage.removeItem("user");

            navigate("/admin/login");

        }

    };


    /*
    ==========================
    CHART DATA
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
                <h3 style={{ marginTop: 20, color: "#666" }}>
                    Đang tải dữ liệu...
                </h3>
            </div>
        );

    }


    return (

        <div className="admin-dashboard">

            {/* HEADER */}

            <header className="dashboard-header">

                <div className="header-left">
                    <h2 className="dashboard-title">📊 HỆ THỐNG QUẢN TRỊ</h2>
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

                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f0f0f0"
                            />

                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                            />

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
                    {value}
                </span>

            </div>

        </div>

    );

}

export default AdminDashboard;