import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import CartItemCard from "../../components/CartItemCard"; 
import "../../style/CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Thêm state để kiểm tra đăng nhập chắc chắn
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Đọc token và user ngay tại đây để đảm bảo tính thời điểm
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const userData = userStr ? JSON.parse(userStr) : null;

    console.log("Token hiện tại:", token);
    console.log("User Data hiện tại:", userData);
    
    if (!userData || !userData.id) {
      setIsLogged(false);
      setLoading(false);
      return;
    }

    setIsLogged(true);
    
    axios
      .get(`http://127.0.0.1:8000/api/cart/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.products || [];
          setCart(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi giỏ hàng:", err);
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [setCart, navigate]);

  const handleUpdateQty = async (idSP, newQty) => {
    if (newQty < 1) return;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedCart = cart.map((item) =>
      item.IdSP === idSP ? { ...item, SoLuong: newQty } : item
    );
    setCart(updatedCart);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/update",
        { IdUser: user.id, IdSP: idSP, SoLuong: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const removeItem = async (idSP) => {
    if (window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const updatedCart = cart.filter((item) => item.IdSP !== idSP);
      setCart(updatedCart);
      setSelectedIds((prev) => prev.filter((id) => id !== idSP));

      try {
        await axios.post(
          "http://127.0.0.1:8000/api/cart/remove",
          { IdUser: user.id, IdSP: idSP },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
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
    .reduce((sum, item) => sum + Number(item.Gia) * Number(item.SoLuong), 0);

  // 1. CHỜ TẢI DỮ LIỆU
  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-danger"></div>
      </div>
    );

  // 2. NẾU CHƯA ĐĂNG NHẬP (Dựa vào state isLogged thay vì biến const ngoài)
  if (!isLogged) {
    return (
      <div className="container mt-5">
        <div className="text-center bg-white p-5 shadow-sm rounded-4 border-dashed">
          <i className="bi bi-person-lock display-1 text-muted opacity-25"></i>
          <h4 className="mt-3 fw-bold">Vui lòng đăng nhập</h4>
          <p className="text-muted">Bạn cần đăng nhập để xem và quản lý giỏ hàng của mình.</p>
          <Link to="/login" className="btn btn-primary rounded-pill px-5 mt-2">
            ĐĂNG NHẬP NGAY
          </Link>
        </div>
      </div>
    );
  }

  // 3. NẾU ĐÃ ĐĂNG NHẬP
  return (
    <div className="container mt-4 mb-5">
      <h3 className="fw-bold mb-4 px-2 px-md-0">Giỏ hàng của bạn</h3>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-5 shadow-sm rounded-4 border-dashed">
          <i className="bi bi-cart-x display-1 text-muted opacity-25"></i>
          <h4 className="mt-3 fw-bold">Giỏ hàng đang trống</h4>
          <p className="text-muted">Hãy chọn thêm sản phẩm vào giỏ nhé!</p>
          <Link to="/products" className="btn btn-danger rounded-pill px-5">
            MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <>
          {/* Header chỉ hiện trên Desktop */}
          <div className="row px-3 py-2 bg-white shadow-sm rounded-3 mb-3 d-none d-lg-flex align-items-center border mx-1">
            <div className="col-lg-5 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={cart.length > 0 && selectedIds.length === cart.length}
                onChange={toggleSelectAll}
              />
              <span className="fw-bold">Sản phẩm</span>
            </div>
            <div className="col-lg-2 text-center fw-bold">Đơn giá</div>
            <div className="col-lg-2 text-center fw-bold">Số lượng</div>
            <div className="col-lg-2 text-center fw-bold">Số tiền</div>
            <div className="col-lg-1 text-end fw-bold">Xóa</div>
          </div>

          <div className="cart-list px-2 px-md-0">
            {cart.map((item) => (
              <CartItemCard
                key={item.IdSP}
                item={item}
                isSelected={selectedIds.includes(item.IdSP)}
                onToggle={toggleSelect}
                onUpdateQty={handleUpdateQty}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Thanh tổng tiền */}
          <div className="sticky-bottom bg-white shadow p-3 mt-4 rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-center border mx-1 mx-md-0">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={cart.length > 0 && selectedIds.length === cart.length}
                onChange={toggleSelectAll}
              />
              <span className="fw-semibold">Chọn tất cả ({cart.length})</span>
            </div>
            <div className="d-flex align-items-center">
              <div className="text-end me-4">
                <span className="text-muted small d-block">
                  Tổng thanh toán ({selectedIds.length} món):
                </span>
                <span className="fs-4 fw-bold text-danger">
                  {selectedTotal.toLocaleString()}₫
                </span>
              </div>
              <button
                onClick={() => {
                  const itemsToPay = cart.filter((item) =>
                    selectedIds.includes(item.IdSP)
                  );
                  if (itemsToPay.length === 0)
                    return alert("Vui lòng chọn sản phẩm!");
                  localStorage.setItem(
                    "checkout_items",
                    JSON.stringify(itemsToPay)
                  );
                  navigate("/checkout");
                }}
                className="btn btn-danger btn-lg px-5 rounded-pill fw-bold shadow"
              >
                MUA HÀNG
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;