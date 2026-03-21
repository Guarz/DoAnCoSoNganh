import { useEffect, useState } from "react";

export default function AdminHome() {

    const [data, setData] = useState({
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_users: 0
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const res = await fetch("http://127.0.0.1:8000/api/admin/dashboard");

                const result = await res.json();

                setData(result);

                setLoading(false);

            } catch (err) {

                console.log(err);

                setError("Không thể tải dữ liệu");

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);



    if (loading) {

        return <h2 style={{ padding: 30 }}>Đang tải dữ liệu...</h2>;

    }

    if (error) {

        return <h2 style={{ padding: 30 }}>{error}</h2>;

    }


    return (

        <div style={container}>

            <h1 style={title}>Trang chủ Admin</h1>

            <div style={cardContainer}>

                <div style={card}>
                    <h2>{data.total_products}</h2>
                    <p>Sản phẩm</p>
                </div>

                <div style={card}>
                    <h2>{data.total_categories}</h2>
                    <p>Danh mục</p>
                </div>

                <div style={card}>
                    <h2>{data.total_orders}</h2>
                    <p>Đơn hàng</p>
                </div>

                <div style={card}>
                    <h2>{data.total_users}</h2>
                    <p>Người dùng</p>
                </div>

            </div>

        </div>

    );

}


/* ================= STYLE ================= */

const container = {
    padding: 30
};

const title = {
    marginBottom: 30,
    color: "#d63384"
};

const cardContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20
};

const card = {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontSize: 18
};