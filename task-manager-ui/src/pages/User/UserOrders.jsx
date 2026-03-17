import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const themeColor = "#d63384"; 

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, []);

    const fetchOrders = async () => {
        try {
            // Gọi API lấy đơn hàng (Bạn cần đảm bảo Route này đã tồn tại trong api.php)
            const response = await axios.get(`http://127.0.0.1:8000/api/orders/${user.id}`);
            setOrders(response.data); 
            setLoading(false);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
            <h2 style={{ marginBottom: 20 }}>📦 Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.IdDH} style={styles.orderCard}>
                        {/* Header: Mã đơn hàng & Trạng thái */}
                        <div style={styles.orderHeader}>
                            <span style={{ fontWeight: 'bold' }}>Mã đơn: #{order.IdDH}</span>
                            <span style={{ color: themeColor }}>{order.TrangThai || 'Chờ xác nhận'}</span>
                        </div>

                        {/* Danh sách sản phẩm - Dựa trên cấu trúc ChiTietGioHang/SanPham */}
                        {order.details && order.details.map((item, idx) => (
                            <div key={idx} style={styles.productRow}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    {/* Lấy ảnh từ Quan hệ AnhSP */}
                                    <img 
                                        src={item.san_pham?.anh_s_p?.[0]?.HinhAnh || 'https://via.placeholder.com/80'} 
                                        alt="Product" 
                                        style={styles.productImg} 
                                    />
                                    <div style={{ marginLeft: 15 }}>
                                        {/* Tên sản phẩm từ Model SanPham */}
                                        <div style={{ fontWeight: '500' }}>{item.san_pham?.TenSP}</div>
                                        <div style={{ color: '#888', fontSize: 13 }}>Số lượng: x{item.SoLuong}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    {Number(item.GiaBan).toLocaleString()}₫
                                </div>
                            </div>
                        ))}

                        {/* Tổng tiền đơn hàng */}
                        <div style={styles.orderFooter}>
                            <div>
                                <span style={{ color: '#888' }}>Tổng số tiền: </span>
                                <span style={{ fontSize: 20, color: themeColor, fontWeight: 'bold' }}>
                                    {Number(order.TongTien).toLocaleString()}₫
                                </span>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <button style={{ ...styles.btnPrimary, backgroundColor: themeColor }}>Mua lại</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// Styles 
const styles = {
    orderCard: { background: '#fff', marginBottom: 15, padding: 20, borderRadius: 2, boxShadow: '0 1px 1px rgba(0,0,0,0.05)' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f1f1' },
    productRow: { display: 'flex', padding: '15px 0', borderBottom: '1px solid #f1f1f1', alignItems: 'center' },
    productImg: { width: 70, height: 70, objectFit: 'cover', border: '1px solid #eee' },
    orderFooter: { textAlign: 'right', paddingTop: 15 },
    btnPrimary: { padding: '8px 25px', color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer' },
    emptyBox: { textAlign: 'center', background: '#fff', padding: '40px', borderRadius: 2 }
};

export default UserOrders;