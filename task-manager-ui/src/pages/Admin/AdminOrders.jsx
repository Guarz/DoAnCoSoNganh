import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  =========================
  LOAD ORDERS FROM API
  =========================
  */

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const res = await fetch("http://localhost:8000/api/admin/orders");

      if (!res.ok) {
        throw new Error("API lỗi");
      }

      const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);

    } catch (err) {

      console.log("Lỗi load đơn hàng:", err);
      setOrders([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  /*
  =========================
  UPDATE STATUS
  =========================
  */

  const changeStatus = async (id, newStatus) => {

    try {

      const res = await fetch(
        `http://localhost:8000/api/admin/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        fetchOrders();

      } else {

        alert("Cập nhật trạng thái thất bại");

      }

    } catch (err) {

      console.log("Lỗi update:", err);

    }

  };

  /*
  =========================
  DELETE ORDER
  =========================
  */

  const deleteOrder = async (id) => {

    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng?")) return;

    try {

      const res = await fetch(
        `http://localhost:8000/api/admin/orders/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      if (data.success) {

        alert("Đã xóa đơn hàng");

        fetchOrders();

      }

    } catch (err) {

      console.log("Lỗi xóa:", err);

    }

  };

  /*
  =========================
  FORMAT MONEY
  =========================
  */

  const formatMoney = (money) => {

    if (!money) return "0 đ";

    return Number(money).toLocaleString() + " đ";

  };

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div style={{ padding: 30 }}>

      {/* BACK BUTTON */}

      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginBottom: 20,
          padding: "8px 15px",
          border: "none",
          background: "#555",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ⬅ Quay lại Dashboard
      </button>

      <h2>📦 Quản lý đơn hàng</h2>

      {loading ? (

        <p>⏳ Đang tải dữ liệu...</p>

      ) : orders.length === 0 ? (

        <p>Không có đơn hàng</p>

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

            {orders.map((order) => (

              <tr key={order.id} style={{ textAlign: "center" }}>

                <td>{order.id}</td>

                <td>{order.customer || "Không rõ"}</td>

                <td>{order.product || "Chưa có sản phẩm"}</td>

                <td>{formatMoney(order.total)}</td>

                <td>

                  <select
                    value={order.status || "Chờ xử lý"}
                    onChange={(e) =>
                      changeStatus(order.id, e.target.value)
                    }
                  >

                    <option value="Chờ xử lý">
                      Chờ xử lý
                    </option>

                    <option value="Đang giao">
                      Đang giao
                    </option>

                    <option value="Hoàn thành">
                      Hoàn thành
                    </option>

                    <option value="Hủy">
                      Hủy
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
                      padding: "6px 12px",
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

export default AdminOrders;