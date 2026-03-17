import { useEffect, useState } from "react";

export default function ProductForm({ onSave, editing }) {

    const [form, setForm] = useState({
        name: "",
        price: ""
    });

    // khi click sửa sản phẩm
    useEffect(() => {
        if (editing) {
            setForm({
                name: editing.name || "",
                price: editing.price || ""
            });
        } else {
            setForm({
                name: "",
                price: ""
            });
        }
    }, [editing]);

    // thay đổi input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name || !form.price) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        onSave(form);

        // reset form sau khi thêm
        setForm({
            name: "",
            price: ""
        });
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>

            <input
                name="name"
                placeholder="Tên sản phẩm"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
            />

            <input
                name="price"
                type="number"
                placeholder="Giá"
                value={form.price}
                onChange={handleChange}
                style={inputStyle}
            />

            <button style={btnStyle}>
                {editing ? "Cập nhật" : "Thêm"}
            </button>

        </form>
    );
}


/* ================= STYLE ================= */

const formStyle = {
    display: "flex",
    flexDirection: "column",
};

const inputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
};

const btnStyle = {
    width: "100%",
    padding: 10,
    background: "#d63384",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
};