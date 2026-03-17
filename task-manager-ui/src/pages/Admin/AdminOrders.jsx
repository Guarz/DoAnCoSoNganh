import { useState, useEffect } from "react";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const data = localStorage.getItem("orders");

    if (data) {
      setOrders(JSON.parse(data));
    }

  }, []);

  // cập nhật trạng thái
  const changeStatus = (id, newStatus) => {

    const updated = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );

    setOrders(updated);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // xóa đơn hàng
  const deleteOrder = (id) => {

    const updated = orders.filter(order => order.id !== id);

    setOrders(updated);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (

    <div style={{ padding: 30 }}>

      <h2>📦 Quản lý đơn hàng</h2>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng</p>
      ) : (

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20
          }}
        >

          <thead>

            <tr style={{ background: "#abd0f5" }}>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>

          </thead>

          <tbody>

            {orders.map(order => (

              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>{order.product}</td>

                <td>{order.total} đ</td>

                <td>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      changeStatus(order.id, e.target.value)
                    }
                  >

                    <option value="pending">
                      Chờ xử lý
                    </option>

                    <option value="shipping">
                      Đang giao
                    </option>

                    <option value="done">
                      Hoàn thành
                    </option>

                  </select>

                </td>

                <td>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    style={{
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer"
                    }}
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
  );
}

// ví dụ dữ liệu đơn hàng
export default AdminOrders;
localStorage.setItem("orders", JSON.stringify([
{
id:1,
customer:"Nguyễn Văn A",
product:"Áo thun",
total:200000,
status:"pending"
},
{
id:2,
customer:"Trần Thị B",
product:"Áo hoodie",
total:350000,
status:"shipping"
}
]))