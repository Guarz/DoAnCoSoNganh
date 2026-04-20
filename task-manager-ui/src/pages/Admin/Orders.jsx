import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  const handleChangeStatus = async (id, status) => {
    await updateOrderStatus(id, { IdTT: status });
    fetchOrders();
  };

  return (
    <div>
      <h3>📦 QUẢN LÝ ĐƠN HÀNG</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.IdDH}>
              <td>{order.IdDH}</td>
              <td>{order.user?.Ten}</td>
              <td>{order.NgayDat}</td>
              <td>{order.TongTien?.toLocaleString()} đ</td>
              <td>{order.trang_thai?.TenTrangThai}</td>
              <td>
                <select
                  value={order.IdTT}
                  onChange={(e) =>
                    handleChangeStatus(order.IdDH, e.target.value)
                  }
                >
                  <option value="0">Pending</option>
                  <option value="1">Confirmed</option>
                  <option value="2">Shipping</option>
                  <option value="3">Completed</option>
                  <option value="4">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
