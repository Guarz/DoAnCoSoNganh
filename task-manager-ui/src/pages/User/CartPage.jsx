import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import "../../style/CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  // Lấy cart và setCart từ Context.
  // Đảm bảo trong Layout.jsx bạn khởi tạo: const [cart, setCart] = useState([]);
  const { cart, setCart } = useOutletContext();
  const [selectedIds, setSelectedIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.IdUser) {
      // SỬA TẠI ĐÂY: Bỏ /user, chỉ để /api/cart/
      axios
        .get(`http://127.0.0.1:8000/api/cart/${user.IdUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            // Controller trả về key 'products', hãy dùng đúng tên này
            const data = res.data.products || [];
            console.log("Dữ liệu từ DB:", data);
            setCart(data);
            localStorage.setItem("cart", JSON.stringify(data));
          }
        })
        .catch((err) => {
          console.error("Lỗi giỏ hàng:", err);
          // Nếu lỗi 401 hoặc 404 không mong muốn, kiểm tra lại URL
          if (err.response?.status === 401) navigate("/login");
        });
    }
  }, [navigate, token]); 
  const handleGoToCheckout = () => {
  const itemsToPay = cart.filter((item) => selectedIds.includes(item.IdSP));
  if (itemsToPay.length === 0) {
    alert("Vui lòng tích chọn sản phẩm bạn muốn mua!");
    return;
  }
  localStorage.setItem("checkout_items", JSON.stringify(itemsToPay));
  navigate("/checkout");
};
  const handleUpdateQty = async (idSP, newQty) => {
    if (newQty < 1) return;

    // Cập nhật UI nhanh (Optimistic UI)
    const updatedCart = cart.map((item) =>
      item.IdSP === idSP ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/update",
        {
          IdUser: user.IdUser,
          IdSP: idSP,
          SoLuong: newQty,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Lỗi cập nhật DB:", error);
      // Nếu lỗi DB thì nên reload lại data chuẩn từ server (tùy chọn)
    }
  };

  const removeItem = async (idSP) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      const updatedCart = cart.filter((item) => item.IdSP !== idSP);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setSelectedIds((prev) => prev.filter((id) => id !== idSP));
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/cart/remove",
          {
            IdUser: user.IdUser,
            IdSP: idSP,
          },
          { 
            headers: { Authorization: `Bearer ${token}` } 
          }
        );

        if (res.data.success) {
          alert("Đã xóa sản phẩm thành công!");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Sản phẩm chưa có trong DB, dọn dẹp UI thành công.");
        } else {
          console.error("Lỗi server khi xóa sản phẩm:", error);
        }
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length && cart.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.IdSP));
    }
  };

  const toggleSelect = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

  const selectedTotal = (cart || [])
  .filter((item) => selectedIds.includes(item.IdSP))
  .reduce((sum, item) => {
    const price = Number(item.Gia || 0);
    const qty = Number(item.quantity || item.SoLuong || 0);
    return sum + (price * qty);
  }, 0);

  // Nếu chưa có token thì không render gì cả (để useEffect navigate đi)
  if (!token) return null;

  return (
    <div className="cart-page-container">
      <div className="cart-wrapper">
        <div className="cart-header-row">
          <div style={{ width: "45%", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              className="cart-checkbox"
              checked={cart.length > 0 && selectedIds.length === cart.length}
              onChange={toggleSelectAll}
            />
            <span style={{ marginLeft: 15 }}>Sản Phẩm</span>
          </div>
          <div style={{ width: "15%", textAlign: "center" }}>Đơn Giá</div>
          <div style={{ width: "15%", textAlign: "center" }}>Số Lượng</div>
          <div style={{ width: "15%", textAlign: "center" }}>Số Tiền</div>
          <div style={{ width: "10%", textAlign: "center" }}>Thao Tác</div>
        </div>

        {/* Kiểm tra cart.length an toàn */}
        {!cart || cart.length === 0 ? (
          <div className="cart-empty-state">
            <p>Giỏ hàng của bạn còn trống.</p>
            <Link to="/products" className="btn-shop-now">
              MUA SẮM NGAY
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-product-block">
              {cart.map((item) => (
                <div key={item.IdSP} className="cart-product-row">
                  <div
                    style={{
                      width: "45%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="cart-checkbox"
                      checked={selectedIds.includes(item.IdSP)} 
                      onChange={() => toggleSelect(item.IdSP)}
                    />
                    <img
                      src={item.HinhAnh || "https://via.placeholder.com/80"}
                      alt=""
                      className="cart-item-img"
                    />
                    <span className="cart-item-name">{item.TenSP}</span>
                  </div>
                  <div style={{ width: "15%", textAlign: "center" }}>
                    {Number(item.Gia).toLocaleString()}₫
                  </div>
                  <div
                    style={{
                      width: "15%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div className="cart-qty-wrapper">
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          handleUpdateQty(item.IdSP, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="cart-qty-input"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          handleUpdateQty(item.IdSP, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "15%",
                      textAlign: "center",
                      color: "#d81b60",
                      fontWeight: "bold",
                    }}
                  >
                    {(Number(item.Gia) * item.quantity).toLocaleString()}₫
                  </div>
                  <div style={{ width: "10%", textAlign: "center" }}>
                    <button
                      onClick={() => removeItem(item.IdSP)}
                      className="cart-action-delete"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-bar">
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  className="cart-checkbox"
                  checked={
                    cart.length > 0 && selectedIds.length === cart.length
                  }
                  onChange={toggleSelectAll}
                />
                <span style={{ marginLeft: 10 }}>
                  Chọn tất cả ({cart.length})
                </span>
              </div>
              <div className="cart-total-display">
                <div style={{ marginRight: 20 }}>
                  Tổng thanh toán ({selectedIds.length} món):
                  <span className="cart-total-price">
                    {selectedTotal.toLocaleString()}₫
                  </span>
                </div>
                <button
                  onClick={handleGoToCheckout} // Gọi hàm vừa tạo ở trên
                  className="btn-checkout-main"
                >
                  MUA HÀNG
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
