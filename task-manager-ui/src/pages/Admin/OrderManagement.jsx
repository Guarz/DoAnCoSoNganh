import { useState, useEffect } from "react";
import "../../style/order.css";
import "../../style/table.css";
function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("orders");

    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id) => {
    const updated = orders.filter((o) => o.id !== id);

    setOrders(updated);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const handleStatusChange = (id, status) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: status } : o
    );

    setOrders(updated);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const filteredOrders = orders.filter((o) =>
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="order-page">
      <h2>📦 Quản lý đơn hàng</h2>

      <div className="order-search">
        <input
          placeholder="Tìm tên khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="order-table">
        {filteredOrders.length === 0 ? (
          <p>Chưa có đơn hàng</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>{order.customer}</td>

                  <td>{order.product}</td>

                  <td>{order.total} đ</td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Chờ xử lý</option>

                      <option value="shipping">Đang giao</option>

                      <option value="done">Hoàn thành</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(order.id)}
                    >
                      Xóa
                    </button>
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

export default OrderManagement;
