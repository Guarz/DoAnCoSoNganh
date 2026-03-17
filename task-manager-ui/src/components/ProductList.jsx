export default function ProductList({ products, onEdit, onDelete }) {

    // nếu chưa có sản phẩm
    if (!products || products.length === 0) {
        return (
            <div>
                <p style={{ marginTop: 10 }}>Chưa có sản phẩm</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1 }}>

            <table style={tableStyle}>

                <thead>
                    <tr>
                        <th style={thStyle}>Tên</th>
                        <th style={thStyle}>Giá</th>
                        <th style={thStyle}>Hành động</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map((p) => (
                        <tr key={p.id} style={rowStyle}>

                            <td style={tdStyle}>
                                {p.name}
                            </td>

                            <td style={tdStyle}>
                                {Number(p.price).toLocaleString()} VNĐ
                            </td>

                            <td style={tdStyle}>

                                <button
                                    style={editBtn}
                                    onClick={() => onEdit(p)}
                                >
                                    ✏️ Sửa
                                </button>

                                <button
                                    style={deleteBtn}
                                    onClick={() => onDelete(p.id)}
                                >
                                    🗑 Xóa
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}


/* ================= STYLE ================= */

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
};

const thStyle = {
    textAlign: "left",
    padding: 12,
    borderBottom: "2px solid #eee",
    background: "#fafafa",
};

const tdStyle = {
    padding: 12,
    borderBottom: "1px solid #eee",
};

const rowStyle = {
    transition: "0.2s",
};

const editBtn = {
    background: "#ffc107",
    border: "none",
    padding: "6px 10px",
    borderRadius: 5,
    marginRight: 8,
    cursor: "pointer",
};

const deleteBtn = {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 5,
    cursor: "pointer",
};