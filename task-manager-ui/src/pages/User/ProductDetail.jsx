import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const UserProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCart } = useOutletContext();
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/user/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi API chi tiết:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.IdSP === product.IdSP);
    const qtyToAdd = Number(quantity) || 1;

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += qtyToAdd;
    } else {
      cart.push({
        IdSP: product.IdSP,
        TenSP: product.TenSP,
        Gia: product.Gia,
        HinhAnh: product.HinhAnh,
        TenLoai: product.TenLoai,
        quantity: qtyToAdd,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  if (loading) return <div className="text-center mt-5 text-pink">Đang tải chi tiết...</div>;
  if (!product) return <div className="text-center mt-5">Sản phẩm không tồn tại.</div>;

  const imageSrc = product.HinhAnh
    ? product.HinhAnh.startsWith("data:image")
      ? product.HinhAnh
      : `data:image/jpeg;base64,${product.HinhAnh}`
    : "https://via.placeholder.com/500";

  return (
    <div className="container mt-5 pb-5 position-relative">
      {/* THÔNG BÁO POP-UP (Khớp với class .cart-popup trong CSS) */}
      {showPopup && (
        <div className="cart-popup shadow">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>
            Đã thêm <i>{product.TenSP}</i> vào giỏ hàng.
          </div>
        </div>
      )}

      {/* NÚT QUAY LẠI (Khớp với class .btn-back-custom) */}
      <Link to="/products" className="btn btn-back-custom mb-4 px-4 shadow-sm">
        <i className="bi bi-arrow-left me-2"></i> Tiếp tục mua sắm
      </Link>

      <div className="row g-5">
        <div className="col-md-6">
          <div className="detail-img-wrapper shadow-sm">
            <img src={imageSrc} className="img-fluid rounded-4" alt={product.TenSP} />
          </div>
        </div>

        <div className="col-md-6">
          {/* NHÃN DANH MỤC */}
          <span className="badge-category-tag">{product.TenLoai}</span>
          
          {/* TÊN SẢN PHẨM */}
          <h1 className="product-detail-name mt-2 mb-3">{product.TenSP}</h1>
          
          {/* GIÁ TIỀN */}
          <h3 className="product-price-detail mb-4">
            {Number(product.Gia).toLocaleString("vi-VN")} đ
          </h3>

          <div className="mb-4">
            <h5 className="fw-bold">Mô tả sản phẩm:</h5>
            <p className="text-muted description-text">
              {product.MoTa || "Sản phẩm chất lượng cao từ cửa hàng."}
            </p>
          </div>

          <div className="d-flex align-items-center mb-4 gap-3">
            <span className="fw-bold text-muted">Số lượng:</span>
            <div className="quantity-control-wrapper">
              <button className="btn-qty" type="button" onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
                <i className="bi bi-dash-lg"></i>
              </button>
              <input type="number" className="input-qty" value={quantity} readOnly />
              <button className="btn-qty" type="button" onClick={() => setQuantity((q) => q + 1)}>
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>

          {/* NÚT THÊM GIỎ HÀNG (Khớp với class .btn-add-main) */}
          <button onClick={handleAddToCart} className="btn btn-add-main w-100 py-3">
            <i className="bi bi-cart-plus me-2"></i> THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProductDetail;