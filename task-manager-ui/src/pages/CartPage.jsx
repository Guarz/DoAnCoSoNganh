import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useOutletContext } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const context = useOutletContext();
  const cart = context?.cart || [];
  const setCart = context?.setCart || (() => {});

  const themeColor = "#d81b60";

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length && cart.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.IdSP || item.id));
    }
  };

  const selectedTotal = cart
    .filter((item) => selectedIds.includes(item.IdSP || item.id))
    .reduce(
      (sum, item) =>
        sum +
        (item.GiaKM || item.GiaBan || item.price || 0) * (item.quantity || 1),
      0
    );

  const user = (() => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  })();

  const updateQty = async (id, delta) => {
    const itemToUpdate = cart.find((item) => (item.IdSP || item.id) === id);
    if (!itemToUpdate) return;
    const currentQty = Number(itemToUpdate.quantity) || 1;
    const newQty = currentQty + Number(delta);
    const finalQty = newQty > 0 ? newQty : 1;
    const newCart = cart.map((item) =>
      (item.IdSP || item.id) === id ? { ...item, quantity: finalQty } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    try {
      await axios.post("http://127.0.0.1:8000/api/cart/update", {
        IdGH: itemToUpdate.IdGH || itemToUpdate.cart_id,
        IdSP: id,
        SoLuong: finalQty,
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleInputQty = async (id, value) => {
    if (value === "") {
      setCart(
        cart.map((item) =>
          (item.IdSP || item.id) === id ? { ...item, quantity: "" } : item
        )
      );
      return;
    }
    const newQty = Number(value);
    if (isNaN(newQty) || newQty < 1) return;
    const itemToUpdate = cart.find((item) => (item.IdSP || item.id) === id);
    if (!itemToUpdate) return;
    const newCart = cart.map((item) =>
      (item.IdSP || item.id) === id ? { ...item, quantity: newQty } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    try {
      await axios.post("http://127.0.0.1:8000/api/cart/update", {
        IdGH: itemToUpdate.IdGH || itemToUpdate.cart_id,
        IdSP: id,
        SoLuong: newQty,
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const removeItem = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const itemToRemove = cart.find((item) => (item.IdSP || item.id) === id);
      setCart(cart.filter((item) => (item.IdSP || item.id) !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      if (itemToRemove && (itemToRemove.IdGH || itemToRemove.cart_id)) {
        try {
          await axios.post("http://127.0.0.1:8000/api/cart/remove", {
            IdGH: itemToRemove.IdGH || itemToRemove.cart_id,
            IdSP: id,
          });
        } catch (error) {
          console.error("Lỗi xóa:", error);
        }
      }
    }
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua hàng!");
      return;
    }
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return navigate("/login");
    }

    const checkoutItems = cart.filter((item) =>
      selectedIds.includes(item.IdSP || item.id)
    );
    localStorage.setItem("checkout_items", JSON.stringify(checkoutItems));
    localStorage.setItem("total_checkout", selectedTotal);
    navigate("/checkout");
  };

  if (!cart)
    return (
      <div className="text-center mt-5" style={{ color: themeColor }}>
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px 0",
        fontFamily: "Arial, sans-serif",
        minHeight: "80vh",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
        {/* Header Row */}
        <div style={styles.headerRow}>
          <div style={{ display: "flex", alignItems: "center", width: "45%" }}>
            <input
              type="checkbox"
              style={{ ...styles.checkbox, accentColor: themeColor }}
              checked={cart.length > 0 && selectedIds.length === cart.length}
              onChange={toggleSelectAll}
            />
            <span style={{ marginLeft: 10, color: "#888" }}>Sản Phẩm</span>
          </div>
          <div style={{ width: "15%", textAlign: "center", color: "#888" }}>
            Đơn Giá
          </div>
          <div style={{ width: "15%", textAlign: "center", color: "#888" }}>
            Số Lượng
          </div>
          <div style={{ width: "15%", textAlign: "center", color: "#888" }}>
            Số Tiền
          </div>
          <div style={{ width: "10%", textAlign: "center", color: "#888" }}>
            Thao Tác
          </div>
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              ...styles.shopBlock,
              padding: "80px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 16, color: "#555" }}>
              Giỏ hàng của bạn còn trống.
            </p>
            <Link
              to="/products"
              style={{
                color: "white",
                backgroundColor: themeColor,
                textDecoration: "none",
                fontWeight: "bold",
                padding: "10px 30px",
                borderRadius: "50px",
                marginTop: 15,
                display: "inline-block",
              }}
            >
              MUA SẮM NGAY
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.shopBlock}>
              {cart.map((item, index) => {
                const itemId = item.IdSP || item.id;
                const itemName = item.TenSP || item.name || "Tên sản phẩm";
                const itemPrice = item.GiaKM || item.GiaBan || item.price || 0;
                const itemQty = item.quantity || 1;

                const rawImg = item.HinhAnh || item.image;
                const imageSrc =
                  rawImg?.startsWith("data:image") || rawImg?.startsWith("http")
                    ? rawImg
                    : `data:image/jpeg;base64,${rawImg}`;

                return (
                  <div
                    key={itemId}
                    style={{
                      ...styles.productRow,
                      borderTop: index === 0 ? "none" : "1px solid #f5f5f5",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "45%",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ ...styles.checkbox, accentColor: themeColor }}
                        checked={selectedIds.includes(itemId)}
                        onChange={() => toggleSelect(itemId)}
                      />
                      <div style={{ display: "flex", marginLeft: 15, flex: 1 }}>
                        <img
                          src={imageSrc}
                          alt={itemName}
                          style={styles.productImg}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80";
                          }}
                        />
                        <div style={{ marginLeft: 10 }}>
                          <div style={styles.productName}>{itemName}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "15%", textAlign: "center" }}>
                      {Number(itemPrice).toLocaleString("vi-VN")}₫
                    </div>
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div style={styles.qtyWrapper}>
                        <button
                          onClick={() => updateQty(itemId, -1)}
                          style={styles.qtyBtn}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={itemQty}
                          onChange={(e) =>
                            handleInputQty(itemId, e.target.value)
                          }
                          style={styles.qtyInput}
                        />
                        <button
                          onClick={() => updateQty(itemId, 1)}
                          style={styles.qtyBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "15%",
                        textAlign: "center",
                        color: themeColor,
                        fontWeight: "bold",
                      }}
                    >
                      {(itemPrice * itemQty).toLocaleString("vi-VN")}₫
                    </div>
                    <div style={{ width: "10%", textAlign: "center" }}>
                      <span
                        onClick={() => removeItem(itemId)}
                        style={styles.actionDelete}
                      >
                        Xóa
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Bar */}
            <div style={styles.checkoutBar}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  style={{
                    ...styles.checkbox,
                    marginLeft: 20,
                    accentColor: themeColor,
                  }}
                  checked={
                    cart.length > 0 && selectedIds.length === cart.length
                  }
                  onChange={toggleSelectAll}
                />
                <span style={{ marginLeft: 10 }}>
                  Chọn tất cả ({cart.length})
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: 20, fontSize: 16 }}>
                  Tổng ({selectedIds.length} món):{" "}
                  <span
                    style={{
                      color: themeColor,
                      fontSize: 24,
                      fontWeight: "bold",
                      marginLeft: 10,
                    }}
                  >
                    {selectedTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{ ...styles.checkoutBtn, backgroundColor: themeColor }}
                >
                  Mua Hàng
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  headerRow: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "15px 20px",
    borderRadius: 3,
    boxShadow: "0 1px 1px 0 rgba(0,0,0,.05)",
    marginBottom: 15,
    fontSize: 14,
  },
  shopBlock: {
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0 1px 1px 0 rgba(0,0,0,.05)",
    marginBottom: 15,
  },
  shopHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid rgba(0,0,0,.09)",
    display: "flex",
    alignItems: "center",
    fontSize: 14,
  },
  shopIcon: { marginLeft: 10, fontSize: 16 },
  productRow: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    fontSize: 14,
    color: "#222",
  },
  checkbox: { width: 16, height: 16, cursor: "pointer" },
  productImg: {
    width: 80,
    height: 80,
    objectFit: "cover",
    border: "1px solid #e1e1e1",
    borderRadius: 2,
  },
  productName: {
    fontSize: 14,
    lineHeight: "20px",
    maxHeight: 40,
    overflow: "hidden",
  },
  qtyWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,.09)",
    borderRadius: 2,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    border: "none",
    cursor: "pointer",
  },
  qtyInput: { width: 40, height: 32, border: "none", textAlign: "center" },
  actionDelete: { cursor: "pointer", color: "#333", fontWeight: "bold" },
  checkoutBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "12px 0",
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  },
  checkoutBtn: {
    color: "#fff",
    border: "none",
    padding: "13px 36px",
    marginRight: 20,
    fontSize: 16,
    borderRadius: 2,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default CartPage;
