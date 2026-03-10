import axios from 'axios';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, setCart } = useOutletContext();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const handleCheckout = async () => {
        if (!user) return navigate('/login');

        try {
            await axios.post('http://127.0.0.1:8000/api/orders', {
                user_email: user.email,
                total_price: totalAmount,
                items: cart
            });
            alert(" Đặt hàng thành công!");
            setCart([]); 
            navigate('/user-orders'); 
        } catch (error) {
            alert("Lỗi khi đặt hàng!");
            console.error(error);
        }
    };

    return (
        <div style={{ background: "#fff", padding: 30, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: 10 }}>Giỏ hàng</h2>
            
            {cart.length === 0 ? (
                <p style={{ marginTop: 20 }}>Giỏ hàng trống. <Link to="/">Mua sắm ngay</Link></p>
            ) : (
                <>
                    <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                <th style={thStyle}>Tên SP</th>
                                <th style={thStyle}>Giá</th>
                                <th style={{...thStyle, textAlign:"center"}}>Số lượng</th>
                                <th style={thStyle}>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={tdStyle}><strong>{item.name}</strong></td>
                                    <td style={tdStyle}>{Number(item.price).toLocaleString()} đ</td>
                                    <td style={{...tdStyle, textAlign:"center"}}>
                                        <button onClick={() => updateQty(item.id, -1)} style={qtyBtn}>-</button>
                                        <span style={{ margin: "0 10px", fontWeight: "bold" }}>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, 1)} style={qtyBtn}>+</button>
                                    </td>
                                    <td style={{...tdStyle, color: "#d63384", fontWeight: "bold"}}>
                                        {(item.price * item.quantity).toLocaleString()} đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: 30, textAlign: "right" }}>
                        <h3>Tổng thanh toán: <span style={{ color: "#d63384" }}>{totalAmount.toLocaleString()} đ</span></h3>
                        <button onClick={handleCheckout} style={btnCheckout}>ĐẶT HÀNG NGAY</button>
                    </div>
                </>
            )}
        </div>
    );
};

const thStyle = { padding: 12, borderBottom: "2px solid #ddd" };
const tdStyle = { padding: 12 };
const qtyBtn = { padding: "2px 8px", cursor: "pointer", background: "#eee", border: "none", borderRadius: 4 };
const btnCheckout = { background: "#d63384", color: "#fff", padding: "12px 24px", border: "none", borderRadius: 4, fontWeight: "bold", cursor: "pointer", marginTop: 15 };

export default CartPage;