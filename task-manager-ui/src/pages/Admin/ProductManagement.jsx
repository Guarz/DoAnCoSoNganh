import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";

export default function ProductManagement() {

    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    // ================================
    // LOAD DANH SÁCH SẢN PHẨM
    // ================================
    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "http://127.0.0.1:8000/api/admin/products"
            );

            setProducts(res.data);

        } catch (error) {
            console.error("Lỗi load sản phẩm:", error);
            alert("Không tải được danh sách sản phẩm");

        } finally {
            setLoading(false);
        }
    };

    // ================================
    // THÊM / CẬP NHẬT SẢN PHẨM
    // ================================
    const handleSave = async (product) => {

        try {

            if (editing) {

                await axios.put(
                    `http://127.0.0.1:8000/api/admin/products/${editing.id}`,
                    product
                );

                alert("Cập nhật sản phẩm thành công");

            } else {

                await axios.post(
                    "http://127.0.0.1:8000/api/admin/products",
                    product
                );

                alert("Thêm sản phẩm thành công");
            }

            setEditing(null);
            fetchProducts();

        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error);
            alert("Có lỗi xảy ra khi lưu sản phẩm");
        }
    };

    // ================================
    // XÓA SẢN PHẨM
    // ================================
    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?"))
            return;

        try {

            await axios.delete(
                `http://127.0.0.1:8000/api/admin/products/${id}`
            );

            alert("Đã xóa sản phẩm");

            fetchProducts();

        } catch (error) {

            console.error("Lỗi xóa:", error);
            alert("Xóa sản phẩm thất bại");

        }
    };

    return (
        <div style={container}>

            <h2 style={title}>
                📦 QUẢN LÝ SẢN PHẨM
            </h2>

            <div style={grid}>

                {/* FORM THÊM / SỬA */}
                <div style={card}>

                    <h3 style={cardTitle}>
                        {editing ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}
                    </h3>

                    <ProductForm
                        onSave={handleSave}
                        editing={editing}
                    />

                </div>

                {/* DANH SÁCH */}
                <div style={card}>

                    <h3 style={cardTitle}>
                        📋 Danh sách sản phẩm
                    </h3>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <ProductList
                            products={products}
                            onEdit={setEditing}
                            onDelete={handleDelete}
                        />
                    )}

                </div>

            </div>

        </div>
    );
}


/* =========================
        STYLE
========================= */

const container = {
    padding: 30,
};

const title = {
    marginBottom: 25,
};

const grid = {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: 30,
};

const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const cardTitle = {
    marginBottom: 15,
};