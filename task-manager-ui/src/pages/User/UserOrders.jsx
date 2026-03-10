
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return;
        
        // Gọi API lấy đơn hàng theo email/ID của User
        axios.get(`http://127.0.0.1:8000/api/orders/user/${user.email}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error("Lỗi tải đơn hàng:", err));
    }, [user?.email]);

    return (
        <div style={{ background: "#fff", padding: 30, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: 10, marginBottom: 20 }}>📦 Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                            <th style={thStyle}>Mã Đơn</th>
                            <th style={thStyle}>Ngày đặt</th>
                            <th style={thStyle}>Tổng tiền</th>
                            <th style={thStyle}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={tdStyle}><strong>#{order.id}</strong></td>
                                <td style={tdStyle}>{new Date(order.created_at || order.date).toLocaleDateString("vi-VN")}</td>
                                <td style={{...tdStyle, color: "#d63384", fontWeight: "bold"}}>
                                    {Number(order.total_price).toLocaleString()} đ
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: "bold",
                                        background: order.status === 'Chờ duyệt' ? '#fff3cd' : '#d4edda',
                                        color: order.status === 'Chờ duyệt' ? '#856404' : '#155724'
                                    }}>
                                        {order.status || "Chờ duyệt"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const thStyle = { padding: 12, borderBottom: "2px solid #ddd" };
const tdStyle = { padding: 12 };

export default UserOrders;