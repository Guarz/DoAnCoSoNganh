import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/product.css";

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

    // =========================
    // LOAD DỮ LIỆU
    // =========================
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

            // Mặc định chọn loại đầu tiên nếu đang thêm mới
            if (dataCat.length > 0 && !editingId) {
                setProduct(prev => ({ ...prev, categoryId: dataCat[0].id }));
            }
        } catch (err) {
            console.log("Lỗi load dữ liệu:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [editingId]);

    // =========================
    // HANDLERS
    // =========================
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) { setProduct({ ...product, image: file }); }
    };

    const resetForm = () => {
        setProduct({
            name: "",
            price: "",
            shortDesc: "",
            categoryId: categories[0]?.id || "",
            image: null
        });
        setEditingId(null);
        // Reset input file thủ công
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    // =========================
    // THÊM SẢN PHẨM
    // =========================
    const handleAddProduct = async () => {
        if (!product.name || !product.price) {
            alert("Vui lòng nhập tên và giá sản phẩm!");
            return;
        }

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.shortDesc);
        formData.append("categoryId", product.categoryId);

        if (product.image) { formData.append("image", product.image); }

        try {
            const res = await fetch("http://localhost:8000/api/admin/products", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert("Thêm sản phẩm thành công 🎉");
                fetchData();
                resetForm();
            }
        } catch (err) { console.log("Lỗi thêm:", err); }
    };

    // =========================
    // CẬP NHẬT SẢN PHẨM (FIX)
    // =========================
    const handleUpdateProduct = async () => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.shortDesc);
        formData.append("categoryId", product.categoryId);

        // Trick cho Laravel: Dùng POST nhưng giả lập PUT để nhận được file
        formData.append("_method", "PUT"); 

        if (product.image) {
            formData.append("image", product.image);
        }

        try {
            const res = await fetch(`http://localhost:8000/api/admin/products/${editingId}`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                alert("Cập nhật thành công! ✨");
                fetchData();
                resetForm();
            } else {
                alert("Lỗi: " + data.error);
            }
        } catch (err) { console.log("Lỗi cập nhật:", err); }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setProduct({
            name: p.name,
            price: p.price,
            shortDesc: p.description || "",
            categoryId: p.categoryId || "",
            image: null
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/admin/products/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                alert("Đã xóa sản phẩm");
                fetchData();
            }
        } catch (err) { console.log("Lỗi delete:", err); }
    };

    return (
        <div className="product-page">
            <button className="back-btn" onClick={() => navigate("/admin")}>
                ⬅ Quay lại Dashboard
            </button>

            <h2 className="title">🌸 Quản lý sản phẩm</h2>

            <div className="product-card">
                <div className="form-grid">
                    <input name="name" placeholder="Tên sản phẩm" value={product.name} onChange={handleChange} />
                    <input name="price" type="number" placeholder="Giá" value={product.price} onChange={handleChange} />

                    <select name="categoryId" value={product.categoryId} onChange={handleChange} className="form-select">
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <input name="shortDesc" placeholder="Mô tả" value={product.shortDesc} onChange={handleChange} />
                    <input type="file" onChange={handleImage} />
                </div>

                <div className="form-actions">
                    <button
                        className="add-btn"
                        onClick={editingId ? handleUpdateProduct : handleAddProduct}
                    >
                        {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                    </button>
                    {editingId && <button className="cancel-btn" onClick={resetForm}>Hủy bỏ</button>}
                </div>
            </div>

            <div className="product-list">
                <h3>📋 Danh sách sản phẩm</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên</th>
                            <th>Loại</th>
                            <th>Giá</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    {p.image ? (
                                        <img src={`data:image/jpeg;base64,${p.image}`} width="60" height="60" style={{ objectFit: "cover", borderRadius: "6px" }} />
                                    ) : <span>Không ảnh</span>}
                                </td>
                                <td>{p.name}</td>
                                <td><span className="badge-cat">{p.category_name}</span></td>
                                <td>{Number(p.price).toLocaleString()} VNĐ</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(p)}>Sửa</button>
                                    <button className="delete-btn" onClick={() => handleDelete(p.id)}>Xóa</button>
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