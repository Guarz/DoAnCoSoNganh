import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const UserLayout = () => {
    const navigate = useNavigate();

    const user = (() => {
        try {
            const data = localStorage.getItem('user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    })();

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* 1. THANH MENU NẰM NGANG  */}
            <header style={headerStyle}>
                <div style={logoStyle}>SHOP QUẦN ÁO A</div>
                
                <nav style={navLinksGroup}>
                    <Link to="/user/home" style={navLink}>Trang chủ</Link>
                    <Link to="/cart" style={navLink}>Giỏ hàng</Link>
                    <Link to="/user/orders" style={navLink}>Lịch sử mua hàng</Link>
                    
                    <div style={userActions}>
                        <span style={userLabel}>Chào, {user?.name || 'User'}</span>
                        <button onClick={handleLogout} style={btnLogout}>Thoát</button>
                    </div>
                </nav>
            </header>

            <div style={{ display: 'flex', flex: 1, backgroundColor: '#fff0f5' }}>
                
                {/* 2. SIDEBAR DANH MỤC BÊN TRÁI */}
                <aside style={sidebarContainer}>
                    <div style={sidebarCard}>
                        <h3 style={sidebarTitle}>DANH MỤC</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/category/ao" style={categoryItem}> Áo </Link>
                            <Link to="/category/quan" style={categoryItem}>Quần </Link>
                        </div>
                    </div>
                </aside>
                <main style={{ flex: 1, padding: '30px' }}>
                    <Outlet /> 
                </main>

            </div>
        </div>
    );
};

/* --- STYLE  --- */
const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 50px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    zIndex: 10
};

const logoStyle = { fontSize: '22px', fontWeight: 'bold', color: '#d63384' };

const navLinksGroup = { display: 'flex', alignItems: 'center', gap: '25px' };

const navLink = { textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '15px' };

const userActions = { display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px' };

const userLabel = { fontSize: '14px', color: '#666' };

const btnLogout = {
    padding: '6px 15px', border: '1px solid #d63384', backgroundColor: 'transparent',
    color: '#d63384', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
};

const sidebarContainer = { width: '280px', padding: '30px' };

const sidebarCard = {
    backgroundColor: '#fff', borderRadius: '15px', padding: '20px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
};

const sidebarTitle = { color: '#d63384', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #fdf2f7', paddingBottom: '10px' };

const categoryItem = {
    padding: '12px 15px', textDecoration: 'none', color: '#333', 
    backgroundColor: '#fdf2f7', borderRadius: '10px', fontWeight: '500'
};

export default UserLayout;