import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/product.css";

function ProductManagement() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        shortDesc: "",
        image: null
    });

    const [editingId, setEditingId] = useState(null);

    // =========================
    // LOAD DANH SÁCH SẢN PHẨM
    // =========================
    const fetchProducts = async () => {

        try {

            const res = await fetch("http://localhost:8000/api/admin/products");

            if (!res.ok) throw new Error("API lỗi");

            const data = await res.json();

            setProducts(data);

        } catch (err) {

            console.log("Lỗi load sản phẩm:", err);

        }

    };

    useEffect(() => {

        fetchProducts();

    }, []);


    // =========================
    // INPUT
    // =========================
    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // IMAGE
    // =========================
    const handleImage = (e) => {

        const file = e.target.files[0];

        if (file) {

            setProduct({
                ...product,
                image: file
            });

        }

    };


    // =========================
    // RESET FORM
    // =========================
    const resetForm = () => {

        setProduct({
            name: "",
            price: "",
            shortDesc: "",
            image: null
        });

        setEditingId(null);

    };


    // =========================
    // THÊM SẢN PHẨM
    // =========================
    const handleAddProduct = async () => {

        if (!product.name || !product.price) {

            alert("Nhập đầy đủ thông tin");
            return;

        }

        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("shortDesc", product.shortDesc);

        if (product.image) {

            formData.append("image", product.image);

        }

        try {

            const res = await fetch("http://localhost:8000/api/admin/products", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {

                console.log("Server lỗi:", res.status);
                alert("Server lỗi khi thêm sản phẩm");
                return;

            }

            const data = await res.json();

            if (data.success) {

                alert("Thêm sản phẩm thành công 🎉");

                fetchProducts();

                resetForm();

            } else {

                console.log(data);

                alert("Thêm sản phẩm thất bại");

            }

        } catch (err) {

            console.log("Lỗi thêm:", err);

        }

    };


    // =========================
    // SỬA
    // =========================
    const handleEdit = (p) => {

        setProduct({
            name: p.name,
            price: p.price,
            shortDesc: p.description || "",
            image: null
        });

        setEditingId(p.id);

        window.scrollTo({ top: 0, behavior: "smooth" });

    };


    // =========================
    // CẬP NHẬT
    // =========================
    const handleUpdateProduct = async () => {

        try {

            const res = await fetch(`http://localhost:8000/api/admin/products/${editingId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    description: product.shortDesc
                })

            });

            if (!res.ok) {

                alert("Server lỗi khi cập nhật");
                return;

            }

            const data = await res.json();

            if (data.success) {

                alert("Cập nhật thành công");

                fetchProducts();

                resetForm();

            }

        } catch (err) {

            console.log("Lỗi update:", err);

        }

    };


    // =========================
    // XÓA
    // =========================
    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa?")) return;

        try {

            const res = await fetch(`http://localhost:8000/api/admin/products/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.success) {

                alert("Đã xóa sản phẩm");

                fetchProducts();

            }

        } catch (err) {

            console.log("Lỗi delete:", err);

        }

    };


    return (

        <div className="product-page">

            {/* NÚT QUAY LẠI */}
            <button
                className="back-btn"
                onClick={() => navigate("/admin")}
            >
                ⬅ Quay lại Dashboard
            </button>

            <h2 className="title">🌸 Quản lý sản phẩm</h2>

            {/* FORM */}
            <div className="product-card">

                <div className="form-grid">

                    <input
                        name="name"
                        placeholder="Tên sản phẩm"
                        value={product.name}
                        onChange={handleChange}
                    />

                    <input
                        name="price"
                        placeholder="Giá"
                        value={product.price}
                        onChange={handleChange}
                    />

                    <input
                        name="shortDesc"
                        placeholder="Mô tả"
                        value={product.shortDesc}
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        onChange={handleImage}
                    />

                </div>

                <button
                    className="add-btn"
                    onClick={() => {
                        if (editingId) {
                            handleUpdateProduct();
                        } else {
                            handleAddProduct();
                        }
                    }}
                >
                    {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </button>

            </div>


            {/* DANH SÁCH */}
            <div className="product-list">

                <h3>📋 Danh sách sản phẩm</h3>

                {products.length === 0 ? (

                    <p>Chưa có sản phẩm</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Ảnh</th>
                                <th>Tên</th>
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
                                                src={`data:image/jpeg;base64,${p.image}`}
                                                width="60"
                                                height="60"
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "6px"
                                                }}
                                            />

                                        ) : (

                                            <span>Không ảnh</span>

                                        )}

                                    </td>

                                    <td>{p.name}</td>

                                    <td>{Number(p.price).toLocaleString()} VNĐ</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Xóa
                                        </button>

                                        <button
                                            onClick={() => navigate(`/admin/product/${p.id}`)}
                                        >
                                            Chi tiết
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

export default ProductManagement;