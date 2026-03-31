import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
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
    await fetch(`http://localhost:8000/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IdTT: status })
    });

    fetchOrders();
  };

  // ================= DELETE =================
  const deleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    await fetch(`http://localhost:8000/api/admin/orders/${id}`, {
      method: "DELETE"
    });

    fetchOrders();
  };

  const formatMoney = (money) =>
    Number(money || 0).toLocaleString() + " đ";

  // ================= UI =================
  return (
    <div style={styles.page}>

      {/* BACK */}
      <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>
        ⬅ Quay lại Dashboard
      </button>

      {/* TITLE */}
      <h1 style={styles.title}>📦 Quản lý đơn hàng</h1>

      {/* CARD */}
      <div style={styles.card}>

        <h2 style={styles.subTitle}>📋 Danh sách đơn hàng</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : orders.length === 0 ? (
          <p>Không có đơn hàng</p>
        ) : (

          <table style={styles.table}>

            <thead>
              <tr style={styles.thead}>
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

                <tr key={order.IdDH} style={styles.row}>

                  <td>{order.IdDH}</td>

                  <td>{order.user?.name}</td>

                  <td>
                    {order.chi_tiet?.map((item) => (
                      <div key={item.IdCTDH}>
                        {item.san_pham?.TenSP} x{item.SoLuong}
                      </div>
                    ))}
                  </td>

                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {formatMoney(order.TongTien)}
                  </td>

                  <td>
                    <select
                      value={order.IdTT}
                      onChange={(e) =>
                        changeStatus(order.IdDH, e.target.value)
                      }
                      style={styles.select}
                    >
                      <option value={1}>Chờ xử lý</option>
                      <option value={2}>Đang giao</option>
                      <option value={3}>Hoàn thành</option>
                      <option value={4}>Hủy</option>
                    </select>
                  </td>

                  <td>
                    <button style={styles.deleteBtn} onClick={() => deleteOrder(order.IdDH)}>
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

export default AdminOrders;


// ================= STYLE =================
const styles = {

  page: {
    background: "#cfe8ef",
    minHeight: "100vh",
    padding: 30
  },

  backBtn: {
    background: "#ff3b6c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 20
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  subTitle: {
    marginBottom: 15
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  thead: {
    background: "#f7b2c4"
  },

  row: {
    textAlign: "center",
    borderBottom: "1px solid #ddd"
  },

  select: {
    padding: 5,
    borderRadius: 5
  },

  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 5,
    cursor: "pointer"
  }
};