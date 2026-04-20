import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  // =====================
  // LOAD CHI TIẾT SẢN PHẨM
  // =====================
  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/products/${id}`);

      const data = await res.json();

      setProduct(data);
    } catch (error) {
      console.log("Lỗi load chi tiết:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Đang tải sản phẩm...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Chi tiết sản phẩm</h2>

      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        {/* ẢNH */}
        <div>
          {product.image ? (
            <img src={`data:image/jpeg;base64,${product.image}`} width="300" />
          ) : (
            <p>Không có ảnh</p>
          )}
        </div>

        {/* THÔNG TIN */}
        <div>
          <h3>{product.name}</h3>

          <p>
            Giá:
            <b style={{ color: "red", marginLeft: "10px" }}>
              {Number(product.price).toLocaleString()} VNĐ
            </b>
          </p>

          <p>Mô tả:</p>

          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
