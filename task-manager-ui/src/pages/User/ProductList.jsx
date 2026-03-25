import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/products')
            .then(res => {
                // Kiểm tra nhiều trường hợp dữ liệu để không bị trống
                let data = [];
                if (Array.isArray(res.data)) data = res.data;
                else if (res.data.success) data = res.data.data;
                else if (res.data.products) data = res.data.products;

                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi gọi API:", err);
                setLoading(false);
            });
    }, []);

    // Hàm chuẩn hóa dữ liệu: Đảm bảo dù API trả về tên cột gì thì React vẫn hiểu
    const filteredProducts = products
        .map(item => ({
            id: item.id || item.IdSP,
            name: item.name || item.TenSP,
            price: item.price || (item.chi_tiet ? item.chi_tiet.Gia : (item.Gia || 0)),
            category: item.category || (item.loai ? item.loai.TenLoai : (item.TenLoai || "Chưa phân loại")),
            image: item.image || (item.anh ? item.anh.HinhAnh : item.HinhAnh)
        }))
        .filter(item => selectedCategory === "Tất cả" || item.category === selectedCategory);

    if (loading) return <div className="text-center mt-5" style={{color: '#d81b60'}}>Đang tải sản phẩm...</div>;

    return (
        <div className="container-fluid p-0 pb-5">
            {/* --- THANH DANH MỤC --- */}
            <div className="container mb-5">
                <ul className="nav nav-pills justify-content-center category-pills">
                    {/* Bạn nên lấy danh sách danh mục động từ products thay vì fix cứng */}
                    {["Tất cả", "Áo thun", "Sơ mi", "Quần jean", "Váy"].map((cat) => (
                        <li className="nav-item" key={cat}>
                            <button 
                                className={`nav-link ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- LƯỚI SẢN PHẨM --- */}
            <div className="container">
                <div className="row g-4"> 
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => {
                            // Xử lý ảnh base64 hoặc URL
                            const imageSrc = item.image 
                                ? (item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`)
                                : 'https://via.placeholder.com/300x400?text=No+Image';

                            return (
                                <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="card h-100 border-0 product-card shadow-sm">
                                        <Link to={`/product/${item.id}`} className="text-decoration-none">
                                            <img src={imageSrc} className="card-img-top product-img" alt={item.name} />
                                        </Link>
                                        <div className="card-body text-center">
                                            <span className="text-muted small text-uppercase">{item.category}</span>
                                            <h5 className="card-title fw-bold text-dark">{item.name}</h5>
                                            <p className="fw-bold fs-5" style={{color: '#d81b60'}}>
                                                {Number(item.price).toLocaleString('vi-VN')} đ
                                                <Link to={`/product/${item.id}`} className="btn btn-view-detail w-100 rounded-pill py-2 fw-bold">
                                                    XEM CHI TIẾT
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center w-100 mt-5">Không tìm thấy sản phẩm nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;