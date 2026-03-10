import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@gmail.com' && password === '123') {
            const adminData = { name: 'Admin', role: 'admin' };
            localStorage.setItem('user', JSON.stringify(adminData));
            setUser(adminData);
            navigate('/admin');
        } 
        else if (email === 'user@gmail.com' && password === '123') {
            const userData = { name: 'User', role: 'user', email: 'user@gmail.com' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/user')
        }    
            else  {
            alert("Sai tài khoản! Thử: admin@gmail.com / 123");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <form onSubmit={handleLogin} style={cardStyle}>
                <h2 style={{ textAlign: 'center', color: '#000' }}>ĐĂNG NHẬP SHOP A</h2>
                <input style={inputStyle} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                <input style={inputStyle} type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} required />
                <button type="submit" style={btnStyle}>VÀO HỆ THỐNG</button>
            </form>
        </div>
    );
}

const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#d63384', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default Login;