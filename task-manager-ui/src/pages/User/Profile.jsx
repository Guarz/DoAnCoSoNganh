import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    ten: "",
    diachi: "",
    dienthoai: "",
  });

  useEffect(() => {
    if (user === null) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) navigate("/login");
    } else {
      setFormData({
        ten: user.name || "",
        diachi: user.address || "",
        dienthoai: user.phone || "",
      });
    }
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/update/${user.id}`,
        {
          ten: formData.ten,
          email: user.email,
          diachi: formData.diachi,
          dienthoai: formData.dienthoai,
        }
      );

      if (response.data.success) {
        const updatedData = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedData));

        setUser(updatedData);

        setMsg("Thông tin đã được cập nhật thành công!");
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Lỗi cập nhật dữ liệu");
    }
  };

  if (!user) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 card p-4 shadow-sm border-0">
          <h3 className="text-center mb-4" style={{ color: "#d63384" }}>
            Hồ Sơ Của Tôi
          </h3>

          {msg && (
            <div
              className={`alert ${
                msg.includes("thành công") ? "alert-success" : "alert-danger"
              }`}
            >
              {msg}
            </div>
          )}

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
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                Email (Không thể đổi)
              </label>
              <input
                type="text"
                className="form-control bg-light"
                value={user.email}
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
