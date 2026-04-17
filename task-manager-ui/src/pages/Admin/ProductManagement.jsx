import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/product.css";
import "../../style/table.css";

function ProductManagement() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        price: "",
        shortDesc: "",
        categoryId: "",
        image: null
    });
    const [editingId, setEditingId] = useState(null);

    // ================= LOAD DATA =================
    const fetchData = async () => {
        try {
            const [resProd, resCat] = await Promise.all([
                fetch("http://localhost:8000/api/admin/products"),
                fetch("http://localhost:8000/api/admin/categories")
            ]);
            const dataProd = await resProd.json();
            const dataCat = await resCat.json();

            setProducts(dataProd);
            setCategories(dataCat);

            if (dataCat.length > 0 && !editingId) {
                setProduct(prev => ({
                    ...prev,
                    categoryId: dataCat[0].id || ""
                }));
            }
        } catch (err) {
            console.log("Lỗi load:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ================= HANDLE EVENTS =================
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value || "" });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) setProduct({ ...product, image: file });
    };

    const resetForm = () => {
        setProduct({
            name: "", price: "", shortDesc: "",
            categoryId: categories[0]?.id || "",
            image: null
        });
        setEditingId(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    // ================= ACTIONS =================
    const handleAddProduct = async () => {
        if (!product.name || !product.price) return alert("Vui lòng nhập tên và giá!");

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.shortDesc || "");
        formData.append("categoryId", product.categoryId);
        if (product.image) formData.append("image", product.image);

        try {
            const res = await fetch("http://localhost:8000/api/admin/products", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert("Thêm thành công 🎉");
                fetchData();
                resetForm();
            }
        } catch (err) { console.log(err); }
    };

    const handleUpdateProduct = async () => {
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.shortDesc || "");
        formData.append("categoryId", product.categoryId);
        if (product.image) formData.append("image", product.image);

        try {
            const res = await fetch(`http://localhost:8000/api/admin/products/${editingId}`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert("Cập nhật thành công ✨");
                fetchData();
                resetForm();
            }
        } catch (err) { console.log(err); }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setProduct({
            name: p.name,
            price: p.price,
            shortDesc: p.description || "",
            categoryId: p.categoryId,
            image: null
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn xoá?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/admin/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) { alert("Đã xoá"); fetchData(); }
        } catch (err) { console.log(err); }
    };

    return (
        <div className="page">
            <button className="backBtn" onClick={() => navigate("/admin/dashboard")}>
                <i className="bi bi-arrow-left"></i> Quay lại Dashboard
            </button>

            <h1 className="title">
                <i className="bi bi-flower1"></i> Quản lý sản phẩm
            </h1>

            {/* FORM CARD */}
            <div className="card" style={{ marginBottom: "30px" }}>
                <h2 className="subTitle">
                    <i className="bi bi-plus-circle"></i> {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <div className="form-grid">
                    <div className="input-group">
                        <label>Tên sản phẩm</label>
                        <input name="name" placeholder="Nhập tên..." value={product.name} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Giá bán (VNĐ)</label>
                        <input name="price" type="number" placeholder="Nhập giá..." value={product.price} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Danh mục</label>
                        <select name="categoryId" value={product.categoryId} onChange={handleChange}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Mô tả ngắn</label>
                        <input name="shortDesc" placeholder="Nhập mô tả..." value={product.shortDesc} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Hình ảnh</label>
                        <input type="file" onChange={handleImage} className="file-input" />
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button className="add-btn" onClick={editingId ? handleUpdateProduct : handleAddProduct}>
                        <i className={editingId ? "bi bi-check2-circle" : "bi bi-plus-lg"}></i>
                        {editingId ? " Cập nhật" : " Thêm mới"}
                    </button>
                    {editingId && (
                        <button className="cancel-btn" onClick={resetForm}>
                            Hủy bỏ
                        </button>
                    )}
                </div>
            </div>

            {/* LIST CARD */}
            <div className="card">
                <h2 className="subTitle">
                    <i className="bi bi-list-ul"></i> Danh sách sản phẩm
                </h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: "100px" }}>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Loại</th>
                            <th>Giá</th>
                            <th style={{ width: "120px", textAlign: "center" }}>HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td className="img-cell">
                                    {p.image ? (
                                        <img src={p.image} alt="product" />
                                    ) : <div className="no-img">No Image</div>}
                                </td>
                                <td><strong>{p.name}</strong></td>
                                <td><span className="badge-cat">{p.category_name}</span></td>
                                <td className="money">{Number(p.price || 0).toLocaleString()} đ</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-icon editBtn" title="Sửa" onClick={() => handleEdit(p)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn-icon deleteBtn" title="Xóa" onClick={() => handleDelete(p.id)}>
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

export default ProductManagement;