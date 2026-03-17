import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/api/admin/dashboard")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Không tải được dữ liệu dashboard");
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div style={{ padding: 30 }}>
                <h3>Đang tải dashboard...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 30, color: "red" }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ padding: 30 }}>

            <h2 style={{ marginBottom: 20 }}>📊 ADMIN DASHBOARD</h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                gap: 20
            }}>

                <StatBox
                    title="Tổng sản phẩm"
                    value={data.total_products}
                    onClick={() => navigate("/admin/products")}
                />

                <StatBox
                    title="Danh mục"
                    value={data.total_categories}
                    onClick={() => navigate("/admin/categories")}
                />

                <StatBox
                    title="Đơn hàng"
                    value={data.total_orders}
                    onClick={() => navigate("/admin/orders")}
                />

                <StatBox
                    title="Người dùng"
                    value={data.total_users}
                    onClick={() => navigate("/admin/users")}
                />

            </div>

        </div>
    );
}

function StatBox({ title, value, onClick }) {

    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                padding: 25,
                borderRadius: 10,
                textAlign: "center",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >

            <h3 style={{ marginBottom: 10 }}>{title}</h3>

            <p
                style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#e91e63"
                }}
            >
                {value}
            </p>

        </div>
    );
}

export default AdminDashboard;