import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/orders");
      const data = await res.json();
      // Đảm bảo data là mảng
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi fetch đơn hàng:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= UPDATE STATUS =================
  const changeStatus = async (id, status) => {
    try {
      // status ở đây sẽ là 1, 2, hoặc 3 khớp với cột IdTT trong DB
      await fetch(`http://localhost:8000/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: parseInt(status) })
      });
      fetchOrders(); // Load lại danh sách sau khi cập nhật thành công
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  // ================= DELETE =================
  const deleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    try {
      await fetch(`http://localhost:8000/api/admin/orders/${id}`, {
        method: "DELETE"
      });
      fetchOrders();
    } catch (err) {
      console.error("Lỗi xóa đơn hàng:", err);
    }
  };

  const formatMoney = (money) =>
    Number(money || 0).toLocaleString() + " đ";

  // ================= UI =================
  return (
    <div className="page">
      {/* Nút quay lại Dashboard */}
      <button className="backBtn" onClick={() => navigate("/admin/dashboard")}>
        <i className="bi bi-arrow-left"></i> Quay lại Dashboard
      </button>

      <h1 className="title">
        <i className="bi bi-box-seam"></i> Quản lý đơn hàng
      </h1>

      <div className="card">
        <h2 className="subTitle">
          <i className="bi bi-list-ul"></i> Danh sách đơn hàng
        </h2>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#a3aed0" }}></i>
            <p>Hiện chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th style={{ width: "120px", textAlign: "center" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td className="product-cell">{order.products}</td>
                  <td className="money">{formatMoney(order.total)}</td>
                  <td>
                    {/* Select box đã khớp với database IdTT: 1, 2, 3 */}
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => changeStatus(order.id, e.target.value)}
                    >
                      <option value={1}>Chờ xác nhận</option>
                      <option value={2}>Đang giao hàng</option>
                      <option value={3}>Đã giao hàng</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon deleteBtn"
                        title="Xóa đơn hàng"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;