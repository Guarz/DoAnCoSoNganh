import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/product.css";
import "../../style/category.css";

function CategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/admin/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Lỗi load danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8000/api/admin/categories/${editingId}`
      : "http://localhost:8000/api/admin/categories";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
        resetForm();
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    }
  };

  const handleEdit = (c) => {
    setName(c.name);
    setEditingId(c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await fetch(`http://localhost:8000/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        <i className="bi bi-arrow-left"></i> Quay lại Dashboard
      </button>

      {/* CẬP NHẬT ICON TIÊU ĐỀ TRANG */}
      <h2 className="title">
        <i className="bi bi-tags-fill me-2"></i> Quản lý danh mục
      </h2>

      <div className="product-card">
        <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <input
            placeholder="Ví dụ: Áo sơ mi, Quần Jean..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button className="add-btn" onClick={handleSubmit}>
            {editingId ? "CẬP NHẬT DANH MỤC" : "THÊM DANH MỤC MỚI"}
          </button>
          {editingId && (
            <button className="cancel-btn" onClick={resetForm}>
              HỦY
            </button>
          )}
        </div>
      </div>

      <div className="product-list">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          {/* CẬP NHẬT ICON TIÊU ĐỀ DANH SÁCH */}
          <h3 style={{ margin: 0 }}>
            <i className="bi bi-list-task me-2"></i> Danh sách hiện có
          </h3>
          <span className="total-badge">Tổng số: {categories.length}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ width: "15%" }}>ID</th>
              <th style={{ width: "65%" }}>Tên danh mục</th>
              <th style={{ width: "20%", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="id-cell">#{c.id}</td>
                <td className="name-cell">{c.name}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(c)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(c.id)}
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

export default CategoryManagement;
