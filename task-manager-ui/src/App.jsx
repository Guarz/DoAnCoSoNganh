import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  // Tự động tải dữ liệu khi mở trang
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Gọi API lấy sản phẩm và danh mục từ database webbanhang
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/get-products'),
        axios.get('http://127.0.0.1:8000/api/get-categories')
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error("Lỗi kết nối database:", err)
    } finally {
      setLoading(false)
    }
  }

  // Giao diện cho từng Menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div>
            <h2>📊 Bảng điều khiển thống kê</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={cardStyle('#3498db')}><h3>{products.length}</h3><p>Sản phẩm</p></div>
              <div style={cardStyle('#27ae60')}><h3>{categories.length}</h3><p>Danh mục</p></div>
              <div style={cardStyle('#e67e22')}><h3>12</h3><p>Đơn hàng mới</p></div>
            </div>
          </div>
        )
      case 'products':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>📦 Quản lý kho hàng</h2>
              <button style={btnStyle('#27ae60')}>+ Thêm sản phẩm</button>
            </div>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={tdStyle}>ID</th>
                  <th style={tdStyle}>Tên sản phẩm</th>
                  <th style={tdStyle}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{p.product_id}</td>
                    <td style={tdStyle}><b>{p.product_name}</b></td>
                    <td style={tdStyle}><button style={btnStyle('#e74c3c')}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'categories':
        return (
          <div>
            <h2>📁 Danh mục sản phẩm</h2>
            <table style={tableStyle}>
              <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={tdStyle}>ID</th><th style={tdStyle}>Tên danh mục</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.category_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{c.category_id}</td>
                    <td style={tdStyle}>{c.category_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><h3>Chức năng đang được cập nhật...</h3></div>
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* SIDEBAR BÊN TRÁI */}
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', flexShrink: 0 }}>
        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ margin: 0 }}>🛡️ ADMIN</h2>
        </div>
        <nav style={{ padding: '15px' }}>
          <li onClick={() => setActiveMenu('dashboard')} style={navItem(activeMenu === 'dashboard')}>📊 Dashboard</li>
          <li onClick={() => setActiveMenu('products')} style={navItem(activeMenu === 'products')}>📦 Sản phẩm</li>
          <li onClick={() => setActiveMenu('categories')} style={navItem(activeMenu === 'categories')}>📁 Danh mục</li>
          <li onClick={() => setActiveMenu('orders')} style={navItem(activeMenu === 'orders')}>🛒 Đơn hàng</li>
          <li onClick={() => setActiveMenu('users')} style={navItem(activeMenu === 'users')}>👥 Tài khoản</li>
        </nav>
      </div>

      {/* NỘI DUNG BÊN PHẢI (FULL WIDTH) */}
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>● Online: Database webbanhang</span>
        </header>
        <main style={{ padding: '40px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

// CÁC STYLE PHỤ TRỢ
const navItem = (isActive) => ({
  padding: '15px 20px', cursor: 'pointer', borderRadius: '8px', listStyle: 'none',
  backgroundColor: isActive ? '#3498db' : 'transparent', color: isActive ? 'white' : '#bdc3c7',
  marginBottom: '5px', transition: '0.3s'
})

const cardStyle = (color) => ({
  flex: 1, padding: '20px', backgroundColor: color, color: 'white', borderRadius: '10px', textAlign: 'center'
})

const btnStyle = (color) => ({
  padding: '8px 16px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
})

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' }
const tdStyle = { padding: '15px', borderBottom: '1px solid #eee', textAlign: 'left' }

export default App