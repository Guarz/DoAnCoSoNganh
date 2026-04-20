import React from "react";
import { Link } from "react-router-dom";
import "../style/ProductCard.css";

const ProductCard = ({ item }) => {
  const imageSrc = item.HinhAnh
    ? item.HinhAnh.startsWith("data:image")
      ? item.HinhAnh
      : `data:image/jpeg;base64,${item.HinhAnh}`
    : "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 product-card-wrapper">
      <div className="modern-product-card shadow-sm">
        <div className="pd-img-container">
          <Link to={`/product/${item.IdSP}`}>
            <img src={imageSrc} className="pd-main-img" alt={item.TenSP} />
            <div className="pd-img-overlay"></div>
          </Link>
        </div>

        <div className="pd-details-body">
          <span className="pd-category-label">{item.TenLoai}</span>
          <Link to={`/product/${item.IdSP}`} className="text-decoration-none">
            <h5 className="pd-name-title">{item.TenSP}</h5>
          </Link>

          <div className="pd-price-section">
            <p className="pd-current-price m-0">
              {Number(item.Gia).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        <div className="pd-action-footer">
          <Link
            to={`/product/${item.IdSP}`}
            className="btn-view-detail text-decoration-none"
          >
            XEM CHI TIẾT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
