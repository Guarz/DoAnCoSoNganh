import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={contentWrapper}>
      {/* SIDEBAR BÊN TRÁI */}
      <aside style={sidebarStyle}>
        <h3 style={sidebarTitle}>DANH MỤC</h3>
        <div style={menuList}>
          <div style={menuItem}> Áo </div>
          <div style={menuItem}> Quần </div>

        </div>
      </aside>

      {/* DANH SÁCH SẢN PHẨM BÊN PHẢI */}
      <main style={{ flex: 1 }}>
        <h2 style={sectionTitle}>SẢN PHẨM MỚI NHẤT</h2>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : products.length > 0 ? (
          <div style={productGrid}>
            {products.map((p) => (
              <div key={p.id} style={productCard}>
                <div style={imgContainer}>

                  <img
                    src={`https://loremflickr.com/320/240/fashion?lock=${p.id}`}
                    alt={p.name}
                    style={imgStyle}
                  />
                </div>
                <h4 style={pName}>{p.name}</h4>
                <p style={pPrice}>{Number(p.price).toLocaleString()}đ</p>
                <button style={btnBuy}>Mua ngay</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
            <p>Hiện chưa có sản phẩm nào.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= STYLE ================= */
const contentWrapper = { display: "flex", maxWidth: "1200px", margin: "30px auto", gap: "30px", padding: "0 20px", alignItems: "flex-start" };
const sidebarStyle = { width: "250px", background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" };
const sidebarTitle = { fontSize: "18px", color: "#d63384", marginBottom: "20px", borderBottom: "2px solid #fdf2f7", paddingBottom: "10px" };
const menuList = { display: "flex", flexDirection: "column", gap: "10px" };
const menuItem = { padding: "12px", background: "#fdf2f7", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500" };
const sectionTitle = { color: "#d63384", marginBottom: "25px", fontSize: "24px" };
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" };
const productCard = { background: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #eee" };
const imgContainer = { width: "100%", height: "160px", borderRadius: "10px", overflow: "hidden", marginBottom: "15px" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const pName = { fontSize: "16px", margin: "10px 0", height: "40px", overflow: "hidden", color: "#333" };
const pPrice = { color: "#d63384", fontWeight: "bold", fontSize: "19px" };
const btnBuy = { width: "100%", padding: "10px", background: "#333", color: "#fff", border: "none", borderRadius: "8px", marginTop: "10px", cursor: "pointer", fontWeight: "bold" };