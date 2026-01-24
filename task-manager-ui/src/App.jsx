import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [activeMenu, setActiveMenu] = useState('products')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/get-products')
      setProducts(res.data)
    } catch (err) {
      console.error("Lỗi:", err)
    }
  }

  return (
    // Thêm style width: '100vw' để đảm bảo tràn hết chiều ngang trình duyệt
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
      
      {/* --- SIDEBAR: Cố định độ rộng --- */}
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', flexShrink: 0 }}>
        <div style={{ padding: '25px', textAlign: 'center', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>🛡️ ADMIN PANEL</h2>
        </div>
        <nav style={{ padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => setActiveMenu('dashboard')} style={menuStyle(activeMenu === 'dashboard')}>📊 Bảng điều khiển</li>
            <li onClick={() => setActiveMenu('products')} style={menuStyle(activeMenu === 'products')}>📦 Quản lý sản phẩm</li>
            <li onClick={() => setActiveMenu('categories')} style={menuStyle(activeMenu === 'categories')}>📁 Danh mục sản phẩm</li>
            <li onClick={() => setActiveMenu('orders')} style={menuStyle(activeMenu === 'orders')}>🛒 Quản lý đơn hàng</li>
          </ul>
        </nav>
      </div>

      {/* --- MAIN CONTENT: Sử dụng flex: 1 để chiếm nốt phần còn lại của màn hình --- */}
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>Quản lý kho hàng</h1>
          <span style={{ color: '#27ae60', fontSize: '14px' }}>● Kết nối database: webbanhang</span>
        </header>

        <main style={{ padding: '40px', flex: 1 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>Tên sản phẩm</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', color: '#666' }}>#{p.product_id}</td>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{p.product_name}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

// Hàm bổ trợ style cho menu
const menuStyle = (isActive) => ({
  padding: '15px 20px',
  cursor: 'pointer',
  borderRadius: '8px',
  marginBottom: '10px',
  transition: '0.3s',
  backgroundColor: isActive ? '#3498db' : 'transparent',
  color: isActive ? 'white' : '#bdc3c7',
  fontWeight: isActive ? 'bold' : 'normal'
})

export default App