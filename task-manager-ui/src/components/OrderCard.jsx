import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/OrderCard.css";

const OrderCard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?.IdUser;

  useEffect(() => {
    if (userId) fetchOrders();
    else setLoading(false);
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/orders/user/${userId}`
      );
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDetail = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };
  const getCorrectImageSrc = (base64String) => {
    if (!base64String)
      return "https://via.placeholder.com/300x400?text=No+Image";
    return base64String.startsWith("data:image")
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;
  };
  const getStatusStyle = (statusName) => {
    if (!statusName) {
      return {
        css: "bg-light text-primary border border-primary",
        icon: "bi-info-circle",
      };
    }
    const name = statusName.trim().toLowerCase();
    if (name.includes("chờ xác nhận")) {
      return {
        css: "bg-warning text-dark border-0",
        icon: "bi-hourglass-split",
      };
    }
    if (name.includes("đang giao hàng")) {
      return { css: "bg-primary text-white border-0", icon: "bi-truck" };
    }
    if (name.includes("đã giao hàng")) {
      return { css: "bg-success text-white border-0", icon: "bi-check-circle" };
    }
    return {
      css: "bg-light text-primary border border-primary",
      icon: "bi-info-circle",
    };
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold border-bottom pb-2">
        <i className="bi bi-box-seam me-2"></i>Đơn hàng của bạn
      </h2>

      {orders.length === 0 ? (
        /* Thêm container-fluid để đảm bảo chiều rộng 100%, row để căn giữa */
        <div className="container-fluid p-0">
          <div
            className="row justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <div className="col-12 col-md-10 col-lg-8">
              {/* Thêm mx-auto để chắc chắn căn giữa */}
              <div className="p-5 border-0 rounded-4 bg-white shadow-sm border-dashed text-center mx-auto">
                <div className="mb-4">
                  <i
                    className="bi bi-bag-x text-muted opacity-25"
                    style={{ fontSize: "5rem" }}
                  ></i>
                </div>
                <h4 className="fw-bold text-dark">Chưa có đơn hàng nào</h4>
                <p className="text-muted mb-4">
                  Có vẻ như bạn chưa thực hiện giao dịch nào. Hãy khám phá những
                  bộ sưu tập mới nhất của chúng tôi ngay nhé!
                </p>
                <a
                  href="/"
                  className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                >
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        orders.map((order) => {
          const statusInfo = getStatusStyle(order.trang_thai?.TenTrangThai);

          return (
            <div
              key={order.IdDH}
              className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden order-item-card"
            >
              {/* Header của Đơn hàng */}
              <div
                className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleToggleDetail(order.IdDH)}
              >
                <div className="d-flex flex-column">
                  <span className="fw-bold text-primary">
                    Mã đơn: #{order.IdDH}
                  </span>
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {order.NgayDat}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    className={`badge rounded-pill px-3 py-2 me-3 shadow-sm ${statusInfo.css}`}
                  >
                    <i className={`bi ${statusInfo.icon} me-1`}></i>
                    {order.trang_thai?.TenTrangThai || "Đang xử lý"}
                  </span>
                  <i
                    className={`bi bi-chevron-down transition-icon ${
                      expandedOrderId === order.IdDH ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
              </div>

              {/* Chi tiết sản phẩm - Sử dụng Bootstrap Grid */}
              <div
                className={`collapse ${
                  expandedOrderId === order.IdDH ? "show" : ""
                }`}
              >
                <div className="card-body border-top bg-light-subtle px-4">
                  {order.chi_tiet?.map((detail, index) => {
                    const sp = detail.san_pham || detail.SanPham || {};
                    const tenSP = sp.TenSP || "Sản phẩm đã bị xóa";
                    const anhBase64 = sp.HinhAnh || sp.Anh;
                    return (
                      <div
                        key={index}
                        className="row align-items-center py-3 border-bottom-dashed"
                      >
                        <div className="col-auto">
                          <img
                            src={getCorrectImageSrc(anhBase64)}
                            alt={tenSP}
                            className="rounded-3 shadow-sm object-fit-cover"
                            style={{ width: "70px", height: "70px" }}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/70x70?text=Error";
                            }}
                          />
                        </div>
                        <div className="col">
                          <h6 className="mb-0 fw-bold">
                            {sp?.TenSP || "Sản phẩm đã bị xóa"}
                          </h6>
                          <small className="text-muted">
                            Số lượng:{" "}
                            <span className="badge bg-secondary-subtle text-dark">
                              x{detail.SoLuong}
                            </span>
                          </small>
                        </div>
                        <div className="col-auto text-end">
                          <span className="fw-bold text-dark">
                            {Number(detail.TongTien).toLocaleString()} đ
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer của mỗi Card */}
              <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <span className="text-muted small">
                  <i className="bi bi-tag-fill me-1"></i>Tổng thanh toán
                </span>
                <span className="fs-5 fw-bold text-danger">
                  {Number(
                    order.chi_tiet?.reduce(
                      (sum, item) => sum + Number(item.TongTien),
                      0
                    )
                  ).toLocaleString()}{" "}
                  đ
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderCard;
