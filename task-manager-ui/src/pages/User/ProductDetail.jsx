import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const UserProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setCart } = useOutletContext();
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/user/products/${id}`)
            .then(res => {
                setProduct(res.data.data || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi API chi tiết:", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        const qtyToAdd = Number(quantity) || 1;

        if (existingItemIndex !== -1) {
            
            cart[existingItemIndex].quantity = qtyToAdd; 
            
            console.log("Đã cập nhật số lượng mới là:", qtyToAdd);
        } else {
            
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: qtyToAdd
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setCart(cart);

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    if (loading) return <div className="text-center mt-5 text-pink">Đang tải chi tiết...</div>;
    if (!product) return <div className="text-center mt-5">Sản phẩm không tồn tại.</div>;

    const imageSrc = product.image?.startsWith('data:image') 
        ? product.image 
        : `data:image/jpeg;base64,${product.image}`;

    return (
        <div className="container mt-5 pb-5 relative">
            
            {/* COMPONENT POP-UP THÔNG BÁO */}
            {showPopup && (
                <div 
                    className="alert alert-success shadow-lg d-flex align-items-center" 
                    role="alert"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        minWidth: '300px',
                        animation: 'fadeIn 0.5s'
                    }}
                >
                    <i className="bi bi-check-circle-fill me-2 fs-4"></i>
                    <div>
                        <strong>Thành công!</strong> <br/>
                        Đã thêm <i>{product.name}</i> vào giỏ hàng.
                    </div>
                </div>
            )}

            <Link to="/products" className="btn btn-outline-danger mb-4 rounded-pill">
                ← Quay lại danh sách
            </Link>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <img 
                        src={imageSrc} 
                        className="img-fluid rounded shadow-sm" 
                        alt={product.name}
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/500' }}
                    />
                </div>
                <div className="col-md-6">
                    <h6 className="text-pink text-uppercase">{product.category}</h6>
                    <h1 className="fw-bold mb-3">{product.name}</h1>
                    <h3 className="text-danger fw-bold mb-4">
                        {product.price ? product.price.toLocaleString('vi-VN') : '0'} đ
                    </h3>
                    <div className="mb-4">
                        <h5 className="fw-bold">Mô tả sản phẩm:</h5>
                        <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                            {product.description || "Đang cập nhật nội dung..."}
                        </p>
                        
                    </div>
                     <div className="d-flex align-items-center mb-4">
        <span className="me-3 fw-bold text-muted">Số lượng:</span>
        <div className="input-group" style={{ width: '140px' }}>
            <button 
        className="btn btn-outline-secondary fw-bold" 
        type="button"
        onClick={() => setQuantity(prev => (Number(prev) > 1 ? Number(prev) - 1 : 1))}
    >
        -
    </button>

    <input 
        type="text" 
        className="form-control text-center fw-bold" 
        value={quantity} 
        readOnly 
    />

    <button 
        className="btn btn-outline-secondary fw-bold" 
        type="button" 
    
        onClick={() => setQuantity(prev => Number(prev) + 1)}
    >
        +
    </button>
        </div>
    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="btn btn-danger btn-lg w-100 rounded-pill py-3 fw-bold"
                    >
                        THÊM VÀO GIỎ HÀNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProductDetail;