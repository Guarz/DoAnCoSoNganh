import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import "../../style/CartPage.css"; 

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Dùng toán tử ?. và || {} để tránh lỗi khi chưa đăng nhập
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Nếu chưa đăng nhập, đá ra trang login
    if (!user || !token) {
      navigate("/login");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/user/cart/${user.IdUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data.success) {
        setCart(res.data.items);
        localStorage.setItem("cart", JSON.stringify(res.data.items));
      }
    })
    .catch(err => console.error("Lỗi lấy giỏ hàng:", err));
  }, []);

  const handleUpdateQty = async (idSP, newQty) => {
    if (newQty < 1) return;

    const updatedCart = cart.map((item) =>
      item.IdSP === idSP ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);

    try {
      await axios.post("http://127.0.0.1:8000/api/cart/update", {
        IdUser: user.IdUser,
        IdSP: idSP,
        SoLuong: newQty,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const removeItem = async (idSP) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/cart/remove", {
          IdUser: user.IdUser,
          IdSP: idSP
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const updatedCart = cart.filter((item) => item.IdSP !== idSP);
          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          setSelectedIds(prev => prev.filter(id => id !== idSP));
          // alert("Xóa thành công!"); // Có thể tắt alert để trải nghiệm mượt hơn
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
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

  const selectedTotal = cart
    .filter((item) => selectedIds.includes(item.IdSP))
    .reduce((sum, item) => sum + (Number(item.Gia) * item.quantity), 0);

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }
    // Chuyển sang trang thanh toán kèm theo danh sách ID đã chọn
    navigate("/checkout", { state: { selectedIds, total: selectedTotal } });
  };

  if (!cart) return <div className="text-center mt-5">Đang tải...</div>;

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

        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <p>Giỏ hàng của bạn còn trống.</p>
            <Link to="/products" className="btn-shop-now">MUA SẮM NGAY</Link>
          </div>
        ) : (
          <>
            <div className="cart-product-block">
              {cart.map((item) => (
                <div key={item.IdSP} className="cart-product-row">
                  <div style={{ width: "45%", display: "flex", alignItems: "center" }}>
                    <input 
                      type="checkbox" 
                      className="cart-checkbox"
                      checked={selectedIds.includes(item.IdSP)}
                      onChange={() => toggleSelect(item.IdSP)}
                    />
                    <img src={item.HinhAnh} alt="" className="cart-item-img" />
                    <span className="cart-item-name">{item.TenSP}</span>
                  </div>
                  <div style={{ width: "15%", textAlign: "center" }}>
                    {Number(item.Gia).toLocaleString()}₫
                  </div>
                  <div style={{ width: "15%", display: "flex", justifyContent: "center" }}>
                    <div className="cart-qty-wrapper">
                      <button className="cart-qty-btn" onClick={() => handleUpdateQty(item.IdSP, item.quantity - 1)}>-</button>
                      <input 
                        type="text" 
                        className="cart-qty-input"
                        value={item.quantity} 
                        readOnly
                      />
                      <button className="cart-qty-btn" onClick={() => handleUpdateQty(item.IdSP, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ width: "15%", textAlign: "center", color: "#d81b60", fontWeight: "bold" }}>
                    {(Number(item.Gia) * item.quantity).toLocaleString()}₫
                  </div>
                  <div style={{ width: "10%", textAlign: "center" }}>
                    <button onClick={() => removeItem(item.IdSP)} className="cart-action-delete">Xóa</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-bar">
               <div style={{display: 'flex', alignItems: 'center'}}>
                 <input 
                    type="checkbox" 
                    className="cart-checkbox"
                    checked={cart.length > 0 && selectedIds.length === cart.length} 
                    onChange={toggleSelectAll} 
                 />
                 <span style={{marginLeft: 10}}>Chọn tất cả ({cart.length})</span>
               </div>
               <div className="cart-total-display">
                 <div style={{marginRight: 20}}>
                    Tổng thanh toán ({selectedIds.length} sản phẩm): 
                    <span className="cart-total-price">
                        {selectedTotal.toLocaleString()}₫
                    </span>
                 </div>
                 <button onClick={handleCheckout} className="btn-checkout-main">MUA HÀNG</button>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;