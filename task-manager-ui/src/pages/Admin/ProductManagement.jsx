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

    useEffect(() => {
        fetchData();
    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value || ""
        });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct({
                ...product,
                image: file
            });
        }
    };

    // ================= RESET =================
    const resetForm = () => {
        setProduct({
            name: "",
            price: "",
            shortDesc: "",
            categoryId: categories[0]?.id || "",
            image: null
        });

        setEditingId(null);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    // ================= ADD =================
    const handleAddProduct = async () => {

        if (!product.name || !product.price) {
            alert("Vui lòng nhập tên và giá!");
            return;
        }

        const formData = new FormData();

        formData.append("name", product.name || "");
        formData.append("price", product.price || "");
        formData.append("description", product.shortDesc || "");
        formData.append("categoryId", product.categoryId || "");

        if (product.image) {
            formData.append("image", product.image);
        }

        try {

            const res = await fetch(
                "http://localhost:8000/api/admin/products",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Thêm thành công 🎉");
                await fetchData();
                resetForm();
            }

        } catch (err) {
            console.log(err);
        }
    };

    // ================= UPDATE =================
    const handleUpdateProduct = async () => {

        if (!product.name || !product.price) {
            alert("Vui lòng nhập tên và giá!");
            return;
        }

        const formData = new FormData();

        formData.append("_method", "PUT"); 
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.shortDesc || "");
        formData.append("categoryId", product.categoryId || "");

        if (product.image) {
            formData.append("image", product.image);
        }

        try {

            const res = await fetch(
                `http://localhost:8000/api/admin/products/${editingId}`,
                {
                    method: "POST", 
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.log("Lỗi:", data);
                alert(data.message || "Update thất bại");
                return;
            }

            if (data.success) {
                alert("Cập nhật thành công ✨");
                await fetchData();
                resetForm();
            }

        } catch (err) {
            console.log("Lỗi update:", err);
        }
    };

    // ================= EDIT =================
    const handleEdit = (p) => {

        setEditingId(p.id);

        setProduct({
            name: p.name || "",
            price: p.price || "",
            shortDesc: p.description || "",
            categoryId: p.categoryId || categories[0]?.id || "",
            image: null
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {

        if (!window.confirm("Bạn chắc chắn xoá?")) return;

        try {

            const res = await fetch(
                `http://localhost:8000/api/admin/products/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Đã xoá");
                await fetchData();
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (

        <div className="product-page">

            <button
                className="back-btn"
                onClick={() => navigate("/admin/dashboard")}
            >
                ⬅ Quay lại
            </button>

            <h2 className="title">🌸 Quản lý sản phẩm</h2>

            {/* FORM */}
            <div className="product-card">

                <div className="form-grid">

                    <input
                        name="name"
                        placeholder="Tên sản phẩm"
                        value={product.name || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="price"
                        type="number"
                        placeholder="Giá"
                        value={product.price || ""}
                        onChange={handleChange}
                    />

                    <select
                        name="categoryId"
                        value={product.categoryId || ""}
                        onChange={handleChange}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="shortDesc"
                        placeholder="Mô tả"
                        value={product.shortDesc || ""}
                        onChange={handleChange}
                    />

                    <input type="file" onChange={handleImage} />

                </div>

                <div className="form-actions">

                    <button
                        className="add-btn"
                        onClick={editingId ? handleUpdateProduct : handleAddProduct}
                    >
                        {editingId ? "Cập nhật" : "Thêm"}
                    </button>

                    {editingId && (
                        <button
                            className="cancel-btn"
                            onClick={resetForm}
                        >
                            Huỷ
                        </button>
                    )}

                </div>

            </div>

            {/* LIST */}
            <div className="product-list">

                <h3>📋 Danh sách</h3>

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
                                        <img
                                            src={p.image}
                                            width="60"
                                            height="60"
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : "Không ảnh"}
                                </td>

                                <td>{p.name}</td>

                                <td>{p.category_name}</td>

                                <td>
                                    {Number(p.price || 0).toLocaleString()} VNĐ
                                </td>

                                <td>

                                    <button onClick={() => handleEdit(p)}>
                                        Sửa
                                    </button>

                                    <button onClick={() => handleDelete(p.id)}>
                                        Xóa
                                    </button>

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