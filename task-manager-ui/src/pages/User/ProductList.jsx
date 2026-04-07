import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import '../../style/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState("all");

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/products')
            .then(res => {
                if (res.data.success) {
                    setProducts(res.data.products);
                    setDbCategories(res.data.categories);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi gọi API:", err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(item => 
        selectedId === "all" || item.IdLoai == selectedId
    );

    if (loading) return <div className="text-center mt-5" style={{color: '#d81b60'}}>Đang tải sản phẩm...</div>;

    return (
        <div className="container-fluid p-0 pb-5">
            <div className="container mb-5">
                <ul className="nav nav-pills justify-content-center category-pills">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${selectedId === "all" ? 'active' : ''}`}
                            onClick={() => setSelectedId("all")}
                        >
                            Tất cả
                        </button>
                    </li>
                    
                    {dbCategories.map((cat) => (
                        <li className="nav-item" key={cat.IdLoai}>
                            <button 
                                className={`nav-link ${selectedId == cat.IdLoai ? 'active' : ''}`}
                                onClick={() => setSelectedId(cat.IdLoai)}
                            >
                                {cat.TenLoai}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="container">
                <div className="row g-4"> 
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <ProductCard key={item.IdSP} item={item} />
                        ))
                    ) : (
                        <div className="text-center w-100 mt-5">Không có sản phẩm nào trong mục này.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;