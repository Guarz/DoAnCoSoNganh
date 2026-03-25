import React, { useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // Lấy user và setUser từ OutletContext (giống như cách làm với giỏ hàng)
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu không có user (chưa đăng nhập), đá về trang login ngay
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  const [formData, setFormData] = useState({
    ten: user?.name || "",
    diachi: user?.address || "",
    dienthoai: user?.phone || "",
  });
  const [msg, setMsg] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/update/${user.id}`,
        {
          ten: formData.ten,
          email: user.email, // Giữ nguyên email hoặc lấy từ form nếu cho sửa
          diachi: formData.diachi,
          dienthoai: formData.dienthoai,
        }
      );

      if (response.data.status === "success") {
        const updatedData = response.data.user;

        // GHI ĐÈ LÊN LOCALSTORAGE (Rất quan trọng)
        localStorage.setItem("user", JSON.stringify(updatedData));

        // CẬP NHẬT STATE TOÀN CỤC (Để Header đổi tên ngay)
        setUser(updatedData);

        setMsg("Thông tin đã được ghi đè thành công!");
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Lỗi ghi dữ liệu vào Database");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 card p-4 shadow-sm border-0">
          <h3 className="text-center mb-4" style={{ color: "#d63384" }}>
            Hồ Sơ Của Tôi
          </h3>

          {msg && <div className="alert alert-info">{msg}</div>}

          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label fw-bold">Họ và Tên</label>
              <input
                type="text"
                className="form-control"
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                Email (Không thể đổi)
              </label>
              <input
                type="text"
                className="form-control bg-light"
                value={user?.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={formData.dienthoai}
                onChange={(e) =>
                  setFormData({ ...formData, dienthoai: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Địa chỉ giao hàng</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.diachi}
                onChange={(e) =>
                  setFormData({ ...formData, diachi: e.target.value })
                }
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-bold"
              style={{ backgroundColor: "#d63384" }}
            >
              LƯU THAY ĐỔI
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
