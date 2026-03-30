import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/category.css";

function CategoryManagement() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    =========================
    LOAD DATA
    =========================
    */

    const fetchCategories = async () => {

        try {

            setLoading(true);

            const res = await fetch("http://localhost:8000/api/admin/categories");
            const data = await res.json();

            setCategories(Array.isArray(data) ? data : []);

        } catch (err) {

            console.log("Lỗi load danh mục:", err);
            alert("Không thể tải dữ liệu");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchCategories();

    }, []);

    /*
    =========================
    RESET
    =========================
    */

    const resetForm = () => {

        setName("");
        setEditingId(null);

    };

    /*
    =========================
    ADD
    =========================
    */

    const handleAdd = async () => {

        if (!name.trim()) {

            alert("Nhập tên danh mục");
            return;

        }

        try {

            const res = await fetch("http://localhost:8000/api/admin/categories", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ name })

            });

            const data = await res.json();

            if (data.success) {

                alert("Thêm thành công 🎉");

                fetchCategories();
                resetForm();

            } else {

                alert("Thêm thất bại");

            }

        } catch (err) {

            console.log(err);
            alert("Lỗi kết nối server");

        }

    };

    /*
    =========================
    EDIT
    =========================
    */

    const handleEdit = (c) => {

        setName(c.name);
        setEditingId(c.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    /*
    =========================
    UPDATE
    =========================
    */

    const handleUpdate = async () => {

        if (!name.trim()) {

            alert("Nhập tên danh mục");
            return;

        }

        try {

            const res = await fetch(`http://localhost:8000/api/admin/categories/${editingId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ name })

            });

            const data = await res.json();

            if (data.success) {

                alert("Cập nhật thành công");

                fetchCategories();
                resetForm();

            } else {

                alert("Cập nhật thất bại");

            }

        } catch (err) {

            console.log(err);
            alert("Lỗi server");

        }

    };

    /*
    =========================
    DELETE
    =========================
    */

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa?")) return;

        try {

            const res = await fetch(`http://localhost:8000/api/admin/categories/${id}`, {

                method: "DELETE"

            });

            const data = await res.json();

            if (data.success) {

                alert("Đã xóa");

                fetchCategories();

            } else {

                alert("Xóa thất bại");

            }

        } catch (err) {

            console.log(err);
            alert("Lỗi server");

        }

    };

    return (

        <div className="category-page">

            {/* BACK BUTTON */}

            <button
                className="back-btn"
                onClick={() => navigate("/admin/dashboard")}
            >
                ⬅ Quay lại Dashboard
            </button>

            <h2>📂 Quản lý danh mục</h2>

            {/* FORM */}

            <div className="category-card">

                <input
                    placeholder="Tên danh mục"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button onClick={editingId ? handleUpdate : handleAdd}>

                    {editingId ? "Cập nhật" : "Thêm danh mục"}

                </button>

                {editingId && (

                    <button
                        style={{ marginLeft: 10, background: "gray", color: "white" }}
                        onClick={resetForm}
                    >
                        Hủy
                    </button>

                )}

            </div>

            {/* LIST */}

            <div className="category-list">

                <h3>📋 Danh sách danh mục</h3>

                {loading ? (

                    <p>⏳ Đang tải...</p>

                ) : categories.length === 0 ? (

                    <p>Chưa có danh mục</p>

                ) : (

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Hành động</th>
                            </tr>

                        </thead>

                        <tbody>

                            {categories.map((c) => (

                                <tr key={c.id}>

                                    <td>{c.id}</td>

                                    <td>{c.name}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(c)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(c.id)}
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

export default CategoryManagement;