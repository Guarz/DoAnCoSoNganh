import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function UserLayout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Khởi tạo và lưu Giỏ hàng
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        navigate("/login");
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <nav style={navStyle}>
                <div style={navInnerStyle}>
                    <Link to="/" style={logoStyle}> SHOP QUẦN ÁO A</Link>

                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        <Link to="/" style={linkStyle}>Trang chủ</Link>
                        
                        <Link to="/cart" style={linkStyle}>
                            Giỏ hàng {totalItems > 0 && <span style={badgeStyle}>{totalItems}</span>}
                        </Link>

                        {user ? (
                            <>
                                <Link to="/user/orders" style={linkStyle}>Đơn hàng</Link>
                                <span>Chào, <strong>{user.name}</strong></span>
                                <button onClick={logout} style={btnLogoutStyle}>Thoát</button>
                            </>
                        ) : (
                            <button onClick={() => navigate("/login")} style={btnLoginStyle}>
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main style={contentStyle}>
                <Outlet context={{ cart, setCart }} />
            </main>
        </div>
    );
}

// === STYLE ===
const navStyle = { 
    background: '#fff', 
    padding: '15px 20px', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
};
const navInnerStyle = { 
    maxWidth: 1200, 
    margin: '0 auto', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
};
const logoStyle = { fontSize: 24, fontWeight: 'bold', color: '#d63384', textDecoration: 'none' };
const linkStyle = { textDecoration: 'none', fontWeight: 'bold', color: '#333' };
const btnLoginStyle = { background: '#d63384', color: '#fff', padding: '8px 15px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 'bold' };
const btnLogoutStyle = { border: '1px solid #dc3545', color: '#dc3545', background: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' };
const badgeStyle = { background: "#ffc107", color: "#000", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", marginLeft: "4px" };
const contentStyle = { maxWidth: 1200, margin: '30px auto', padding: '0 20px' };

export default UserLayout;