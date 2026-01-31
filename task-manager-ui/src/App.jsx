import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from './pages/Login';
import AdminLayout from "./layouts/AdminLayout";
import ProductManagement from './pages/Admin/ProductManagement';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminDashboard from './pages/Admin/AdminDashboard';
import HomePage from './pages/HomePage';
// ================== APP ==================
function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#fff0f5' }}>
        {/* NAVBAR */}
        <nav style={navStyle}>
          <div style={navInnerStyle}>
            <Link to="/" style={logoStyle}>SHOP QUẦN ÁO A</Link>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Link to="/" style={linkStyle}>Trang chủ</Link>

              {user?.role === 'admin' && (
                <>
                  <Link to="/admin" style={linkStyle}>Dashboard</Link>
                  <Link to="/admin/products" style={linkStyle}>Sản phẩm</Link>
                  <Link to="/admin/orders" style={linkStyle}>Đơn hàng</Link>
                </>
              )}

              {user ? (
                <>
                  <span>Chào, {user.name}</span>
                  <button onClick={logout} style={btnLogoutStyle}>Thoát</button>
                </>
              ) : (
                <Link to="/login" style={btnLoginStyle}>Đăng nhập</Link>
              )}
            </div>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/products"
            element={user?.role === 'admin' ? <ProductManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/orders"
            element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// ================== STYLE ==================
const navStyle = { background: '#fff', padding: 15, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const navInnerStyle = { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between' };
const logoStyle = { fontSize: 24, fontWeight: 'bold', color: '#d63384', textDecoration: 'none' };
const linkStyle = { textDecoration: 'none', fontWeight: 'bold', color: '#333' };
const btnLoginStyle = { background: '#d63384', color: '#fff', padding: '8px 15px', borderRadius: 20, textDecoration: 'none' };
const btnLogoutStyle = { border: '1px solid #dc3545', color: '#dc3545', background: 'none', padding: '6px 10px', cursor: 'pointer' };
const productGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: 20 };
const cardStyle = { background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const btnBuyStyle = { width: '100%', padding: 10, background: '#000', color: '#fff', border: 'none', cursor: 'pointer' };
