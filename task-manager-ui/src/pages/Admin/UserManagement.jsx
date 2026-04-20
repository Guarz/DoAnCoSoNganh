import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/userManagement.css";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/api/admin/users");

      // 🔥 FIX: đảm bảo luôn là array
      const data = Array.isArray(res.data) ? res.data : res.data.data;

      setUsers(data || []);
    } catch (err) {
      console.log(err);
      alert("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ADD USER =================
  const addUser = async () => {
    if (!newName || !newEmail || !newPassword)
      return alert("Vui lòng nhập đủ thông tin");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
      });

      console.log("ADD RESPONSE:", res.data);

      alert("Thêm thành công 🎉");

      await fetchUsers(); // 🔥 reload data

      setShowAdd(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setSearch(""); // 🔥 reset search
    } catch (err) {
      alert(err.response?.data?.message || "Thêm thất bại");
    }
  };

  // ================= DELETE =================
  const deleteUser = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá user này?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`);

      setUsers((prev) => prev.filter((u) => u.id !== id));

      alert("Xoá thành công");
    } catch (err) {
      alert("Xoá thất bại");
    }
  };

  // ================= EDIT =================
  const startEdit = (user) => {
    setEditingUser(user.id);
    setName(user.name);
    setEmail(user.email);
    setShowAdd(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= UPDATE =================
  const updateUser = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/admin/users/${editingUser}`, {
        name,
        email,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser ? { ...u, name, email } : u))
      );

      alert("Cập nhật thành công");

      setEditingUser(null);
      setName("");
      setEmail("");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // ================= SEARCH =================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="loading-state">
        <h3 style={{ textAlign: "center", marginTop: "50px" }}>
          ⏳ Đang tải dữ liệu...
        </h3>
      </div>
    );
  }

  return (
    <div className="user-container">
      {/* HEADER */}
      <div className="user-header shadow-sm">
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>

          <h2 className="user-title">
            <i className="bi bi-people-fill" style={{ color: "#ff6fa5" }}></i>
            Quản lý người dùng
          </h2>
        </div>

        <div className="header-right">
          <div className="search-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm user..."
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="reload-btn" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>

          <button
            className="add-btn-main"
            onClick={() => {
              setShowAdd(!showAdd);
              setEditingUser(null);
            }}
          >
            <i className="bi bi-person-plus-fill"></i> Thêm user
          </button>
        </div>
      </div>

      {/* FORM */}
      {(showAdd || editingUser) && (
        <div className="edit-box shadow-sm">
          <h3>
            <i
              className={
                editingUser ? "bi bi-pencil-square" : "bi bi-person-plus"
              }
            ></i>
            {editingUser ? " Cập nhật thông tin" : " Thêm người dùng"}
          </h3>

          <div className="form-grid-user">
            <input
              className="edit-input"
              placeholder="Tên"
              value={editingUser ? name : newName}
              onChange={(e) =>
                editingUser
                  ? setName(e.target.value)
                  : setNewName(e.target.value)
              }
            />

            <input
              className="edit-input"
              placeholder="Email"
              value={editingUser ? email : newEmail}
              onChange={(e) =>
                editingUser
                  ? setEmail(e.target.value)
                  : setNewEmail(e.target.value)
              }
            />

            {!editingUser && (
              <input
                className="edit-input"
                type="password"
                placeholder="Mật khẩu"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            )}
          </div>

          <div className="edit-actions">
            <button
              className="btn-update"
              onClick={editingUser ? updateUser : addUser}
            >
              Xác nhận
            </button>

            <button
              className="btn-cancel"
              onClick={() => {
                setShowAdd(false);
                setEditingUser(null);
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table-card shadow-sm">
        <div className="list-header">
          <h3>
            <i className="bi bi-list-stars"></i> Danh sách thành viên
          </h3>
          <span className="total-badge">Tổng: {filteredUsers.length}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td className="action-column">
                  <div className="action-btns">
                    <button
                      className="btn-icon edit"
                      onClick={() => startEdit(user)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="btn-icon delete"
                      onClick={() => deleteUser(user.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
