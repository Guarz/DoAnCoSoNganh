import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [activeMenu, setActiveMenu] = useState('products')

  // Lấy dữ liệu sản phẩm từ Laravel Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/get-products')
        setProducts(res.data)
      } catch (err) {
        console.error("Lỗi kết nối API:", err)
      }
    }
    fetchProducts()
  }, [])

  return (
    // Container chính với width: 100% để tràn màn hình
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

      {/* 1. SIDEBAR (THANH MENU TRÁI) */}
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', flexShrink: 0 }}>
        <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 'bold' }}>🛡️ ADMIN PANEL</h2>
        </div>
        <nav style={{ padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => setActiveMenu('dashboard')} style={navStyle(activeMenu === 'dashboard')}>📊 Bảng điều khiển</li>
            <li onClick={() => setActiveMenu('products')} style={navStyle(activeMenu === 'products')}>📦 Quản lý sản phẩm</li>
            <li onClick={() => setActiveMenu('categories')} style={navStyle(activeMenu === 'categories')}>📁 Danh mục sản phẩm</li>
            <li onClick={() => setActiveMenu('orders')} style={navStyle(activeMenu === 'orders')}>🛒 Quản lý đơn hàng</li>
          </ul>
        </nav>
      </div>

      {/* 2. NỘI DUNG CHÍNH (BÊN PHẢI) */}
      {/* flex: 1 giúp phần này chiếm trọn không gian còn lại, xóa bỏ mảng đen */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Thanh Header trên cùng */}
        <header style={{ padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>Quản lý kho hàng</h2>
          <div style={{ color: '#27ae60', fontWeight: 'bold' }}>● Database: webbanhang</div>
        </header>

        {/* Khu vực hiển thị bảng dữ liệu */}
        <main style={{ padding: '40px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #edf2f7' }}>
                  <th style={{ padding: '20px' }}>ID</th>
                  <th style={{ padding: '20px' }}>Tên sản phẩm</th>
                  <th style={{ padding: '20px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(p => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '20px', color: '#718096' }}>#{p.product_id}</td>
                    <td style={{ padding: '20px', fontWeight: '600', color: '#2d3748' }}>{p.product_name}</td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <button style={{ backgroundColor: 'white', color: '#e53e3e', border: '1px solid #e53e3e', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                        Xóa bỏ
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

// CSS Helper cho các mục Menu
const navStyle = (isActive) => ({
  padding: '15px 20px',
  marginBottom: '8px',
  cursor: 'pointer',
  borderRadius: '10px',
  transition: '0.3s',
  backgroundColor: isActive ? '#3498db' : 'transparent',
  color: isActive ? 'white' : '#a0aec0',
  fontWeight: isActive ? 'bold' : 'normal'
})

export default App