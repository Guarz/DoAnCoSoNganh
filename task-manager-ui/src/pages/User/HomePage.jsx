import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import "../../style/HomePage.css";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products").then((res) => {
      if (res.data.success) {
        setFeaturedProducts(res.data.products.slice(0, 4));
      }
    });
  }, []);

  return (
    <div className="homepage-wrapper">
      <section className="hero-section py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span className="badge bg-danger mb-2 px-3 py-2 rounded-pill">
                BST Theo Mùa 2026
              </span>
              <h1 className="display-3 fw-bold text-dark mb-3">
                Nâng Tầm <span className="text-danger">Phong Cách</span> Của Bạn
              </h1>
              <p className="lead text-muted mb-4">
                Khám phá bộ sưu tập mới nhất với chất liệu cao cấp và thiết kế
                dẫn đầu xu hướng. Sẵn sàng để trở nên tự tin hơn mỗi ngày?
              </p>
              <Link
                to="/products"
                className="btn btn-danger btn-lg px-5 rounded-pill shadow"
              >
                Mua Ngay <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
            <div className="col-md-6 mt-5 mt-md-0">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800"
                alt="Banner thời trang"
                className="img-fluid rounded-4 shadow-lg animate-up-down"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-0">Sản Phẩm Mới Nhất</h2>
            <p className="text-muted mb-0">
              Đừng bỏ lỡ những thiết kế vừa lên kệ
            </p>
          </div>
          <Link
            to="/products"
            className="text-danger fw-bold text-decoration-none"
          >
            Xem tất cả <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        <div className="row g-4">
          {featuredProducts.map((item) => (
            <ProductCard key={item.IdSP} item={item} />
          ))}
        </div>
      </section>

      <section className="container mb-5">
        <div
          className="p-5 rounded-5 text-white text-center shadow-lg position-relative overflow-hidden"
          style={{ background: "linear-gradient(45deg, #d63384, #ff4d4d)" }}
        >
          <div className="position-relative z-1">
            <h2 className="display-5 fw-bold mb-3">
              GIẢM ĐẾN 50% TẤT CẢ PHỤ KIỆN
            </h2>
            <p className="fs-5 mb-4">
              Áp dụng cho đơn hàng từ 500k. Số lượng có hạn!
            </p>
            <button className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-danger">
              Nhận Ưu Đãi
            </button>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-3">Về SHOP QUẦN ÁO A</h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: "600px" }}>
            Chúng tôi không chỉ bán quần áo, chúng tôi mang đến sự tự tin. Với
            hơn 5 năm kinh nghiệm tại Việt Nam, chất lượng luôn là ưu tiên hàng
            đầu.
          </p>
          <Link to="/about" className="btn btn-outline-dark rounded-pill px-4">
            Đọc câu chuyện của chúng tôi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
