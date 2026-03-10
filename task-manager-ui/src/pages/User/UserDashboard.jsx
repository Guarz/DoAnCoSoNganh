import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const UserDashboard = () => {
    const [products, setProducts] = useState([]);
    const { setCart } = useOutletContext(); // Nhận hàm setCart từ Layout

    useEffect(() => {
        // Lấy sản phẩm từ Backend
        axios.get('http://127.0.0.1:8000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        alert(`Đã thêm ${product.name} vào giỏ!`);
    };

    return (
        <div>
            <h2 style={{ marginBottom: "20px" }}>Sản phẩm mới nhất</h2>
            
            <div style={gridStyle}>
                {products.length > 0 ? products.map((item) => (
                    <div key={item.id} style={cardStyle}>
                        <div style={imgStyle}>👕</div>
                        <div style={{ padding: "15px" }}>
                            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>{item.name}</h3>
                            <p style={priceStyle}>{Number(item.price).toLocaleString()} VNĐ</p>
                            <button onClick={() => addToCart(item)} style={btnStyle}>
                                + Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                )) : <p>Đang tải sản phẩm hoặc chưa có sản phẩm nào...</p>}
            </div>
        </div>
    );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const cardStyle = { background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' };
const imgStyle = { fontSize: '60px', background: '#f8f9fa', padding: '20px 0' };
const priceStyle = { color: "#d63384", fontWeight: "bold", marginBottom: "15px" };
const btnStyle = { width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default UserDashboard;