import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { setCart } = useOutletContext();
    const [cartItems, setCartItems] = useState([]);
    
    const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', note: '' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    
    const [showQRModal, setShowQRModal] = useState(false);

    useEffect(() => {
        const selectedItems = JSON.parse(localStorage.getItem('checkout_items')) || [];
        setCartItems(selectedItems);
    }, []);

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (paymentMethod === 'BANK') {
            setShowQRModal(true);
        } else {
            completeOrder();
        }
    };

    const completeOrder = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            alert("Lỗi: Bạn chưa đăng nhập!");
            return;
        }

        const orderPayload = {
            IdUser: user.id,
            DiaChiDat: formData.address,
            TongTien: totalAmount, 
            IdPT: paymentMethod === 'COD' ? 1 : 2,
            fullName: formData.fullName,
            phone: formData.phone,
            note: formData.note || "",
            ChiTietDonHang: cartItems.map(item => ({
                IdSP: item.IdSP || item.id,
                SoLuong: item.quantity,
                Gia: item.price // Đã thêm trường Giá để gửi sang Backend
            }))
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/orders', orderPayload);
            
            if (response.data.status === 'success') {
                alert("✅ ĐẶT HÀNG THÀNH CÔNG!");
                localStorage.removeItem('cart');
                localStorage.removeItem('checkout_items');
                setCart([]);
                navigate('/orders');
            }
        } catch (error) {
            console.error("Lỗi:", error.response?.data);
            alert("Lỗi: " + (error.response?.data?.message || "Không thể thanh toán"));
        }
    };

    return (
        <div className="container mt-5 pb-5 checkout-page relative">
            <h2 className="text-center page-title mb-5">THANH TOÁN ĐƠN HÀNG</h2>

            {showQRModal && (
                <div className="qr-modal-overlay">
                    <div className="qr-modal-content text-center p-4 shadow-lg rounded">
                        <h4 className="fw-bold mb-3" style={{color: '#d81b60'}}>Quét mã QR để thanh toán</h4>
                        <p className="text-muted mb-4">
                            Vui lòng sử dụng App ngân hàng hoặc Ví điện tử để quét mã. <br/>
                            Nội dung chuyển khoản: <strong className="text-dark">{DESCRIPTION}</strong>
                        </p>
                       
                        <div className="qr-image-wrapper mb-4 p-3 border rounded d-inline-block bg-white shadow-sm">
                            <img 
                                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.jpg?amount=${totalAmount}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`} 
                                alt="QR Code Thanh Toán" 
                                className="img-fluid"
                            />
                        </div>

                        <h3 className="fw-bold text-danger mb-4">
                            Số tiền: {totalAmount.toLocaleString('vi-VN')} đ
                        </h3>

                        <div className="d-flex justify-content-center gap-3">
                            <button 
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={() => setShowQRModal(false)}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                className="btn btn-danger rounded-pill px-4 fw-bold"
                                style={{backgroundColor: '#d81b60', border: 'none'}}
                                onClick={() => {
                                    setShowQRModal(false);
                                    completeOrder(); 
                                }}
                            >
                                <i className="bi bi-check-circle-fill me-2"></i>Tôi đã thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-lg-7 mb-4">
                    <div className="checkout-card p-4 shadow-sm">
                        <h4 className="mb-4 fw-bold checkout-heading">1. Thông tin giao hàng</h4>
                        <form onSubmit={handlePlaceOrder}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Nhập họ tên người nhận" />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                                <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                <textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleInputChange} required placeholder="Nhập địa chỉ chi tiết"></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea className="form-control" name="note" rows="2" value={formData.note} onChange={handleInputChange} placeholder="Giao giờ hành chính..."></textarea>
                            </div>

                            <h4 className="mb-3 fw-bold checkout-heading">2. Phương thức thanh toán</h4>
                            <div className="payment-methods mb-4">
                                <div className="form-check mb-2 p-3 border rounded payment-option">
                                    <input className="form-check-input ms-1" type="radio" name="payment" id="cod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <label className="form-check-label ms-2 fw-bold" htmlFor="cod">
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-danger btn-lg w-100 rounded-pill py-3 fw-bold btn-place-order">
                                HOÀN TẤT ĐẶT HÀNG
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="checkout-card p-4 shadow-sm order-summary-card">
                        <h4 className="mb-4 fw-bold checkout-heading">Tóm tắt đơn hàng</h4>
                        <div className="order-items mb-3">
                            {cartItems.length > 0 ? (
                                cartItems.map((item, index) => {
                                    const imageSrc = item.image?.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`;
                                    return (
                                        <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                            <img src={imageSrc} alt={item.name} className="rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }} />
                                            <div className="ms-3 flex-grow-1">
                                                <h6 className="mb-1 fw-bold text-truncate" style={{ maxWidth: '200px' }}>{item.name}</h6>
                                                <small className="text-muted">SL: {item.quantity}</small>
                                            </div>
                                            <div className="fw-bold" style={{ color: '#d81b60' }}>
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-muted my-4">Chưa có sản phẩm nào.</p>
                            )}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span className="fw-bold fs-5">TỔNG CỘNG:</span>
                            <span className="fw-bold fs-3" style={{ color: '#d81b60' }}>{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        
                        <div className="text-center mt-4">
                            <Link to="/products" className="text-decoration-none back-to-shop">
                                ← Quay lại cửa hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;