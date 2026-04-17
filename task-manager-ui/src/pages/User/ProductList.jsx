import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import "../../style/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("all");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
          setDbCategories(res.data.categories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi gọi API:", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (item) => selectedId === "all" || item.IdLoai == selectedId
  );

  if (loading)
    return (
      <div className="text-center mt-5" style={{ color: "#d81b60" }}>
        Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="product-list-wrapper bg-white min-vh-100 py-5">
      <div className="container mb-5">
        <div className="row">
          <div className="col-12">
            <ul className="nav nav-pills justify-content-center category-pills">
              <li className="nav-item">
                <button
                  className={`nav-link ${selectedId === "all" ? "active" : ""}`}
                  onClick={() => setSelectedId("all")}
                >
                  Tất cả
                </button>
              </li>
              {dbCategories.map((cat) => (
                <li className="nav-item" key={cat.IdLoai}>
                  <button
                    className={`nav-link ${
                      selectedId == cat.IdLoai ? "active" : ""
                    }`}
                    onClick={() => setSelectedId(cat.IdLoai)}
                  >
                    {cat.TenLoai}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <ProductCard key={item.IdSP} item={item} />
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 bg-light rounded-5 mt-2 border border-dashed">
                <div className="mb-4">
                  <i className="bi bi-search display-1 text-muted opacity-25"></i>
                </div>
                <h4 className="fw-bold text-dark">Không tìm thấy sản phẩm</h4>
                <p className="text-muted mb-4">
                  Rất tiếc, hiện tại danh mục này chưa có sản phẩm phù hợp. Vui
                  lòng chọn danh mục khác nhé!
                </p>
                <button
                  onClick={() => setSelectedId("all")}
                  className="btn btn-danger rounded-pill px-5 shadow-sm"
                >
                  Quay lại Tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
