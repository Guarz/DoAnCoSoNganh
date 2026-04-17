import React from "react";
import "../../style/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero text-center d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold text-white mb-3">
            VỀ SHOP QUẦN ÁO A
          </h1>
          <p
            className="lead text-white-50 mx-auto"
            style={{ maxWidth: "700px" }}
          >
            Nơi định hình phong cách cá nhân và tôn vinh vẻ đẹp tự tin thông qua
            những thiết kế thời trang hiện đại.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800"
                alt="Our Story"
                className="img-fluid rounded-4 shadow"
              />
            </div>
            <div className="col-lg-6 ps-lg-5">
              <h2 className="fw-bold mb-4">Hành Trình Của Chúng Tôi</h2>
              <p className="text-muted">
                Bắt đầu từ một cửa hàng nhỏ vào năm 2020,{" "}
                <strong>Shop Quần Áo A</strong> ra đời với niềm đam mê mãnh liệt
                dành cho thời trang. Chúng tôi tin rằng trang phục không chỉ là
                thứ khoác lên người, mà là cách bạn thể hiện cái tôi với thế
                giới.
              </p>
              <p className="text-muted">
                Trải qua hơn 5 năm phát triển, chúng tôi tự hào đã phục vụ hơn
                100.000 khách hàng trên toàn quốc, mang đến những bộ sưu tập
                chất lượng cao với mức giá hợp lý nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Tại Sao Chọn Chúng Tôi?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 card-hover">
                <i className="bi bi-gem text-pink fs-1 mb-3"></i>
                <h5 className="fw-bold">Chất Lượng Hàng Đầu</h5>
                <p className="small text-muted">
                  Mỗi sản phẩm đều được kiểm tra kỹ lưỡng về chất liệu vải và
                  đường kim mũi chỉ.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 card-hover">
                <i className="bi bi-lightning-charge text-pink fs-1 mb-3"></i>
                <h5 className="fw-bold">Cập Nhật Xu Hướng</h5>
                <p className="small text-muted">
                  Đội ngũ stylist luôn săn đón những xu hướng thời trang mới
                  nhất trên thế giới.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 card-hover">
                <i className="bi bi-heart text-pink fs-1 mb-3"></i>
                <h5 className="fw-bold">Tận Tâm Phục Vụ</h5>
                <p className="small text-muted">
                  Sự hài lòng của bạn là tôn chỉ hoạt động lớn nhất của đội ngũ
                  chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 text-white shadow-sm"
        style={{ backgroundColor: "#d63384" }}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h2 className="fw-bold">5+</h2>
              <p className="mb-0">Năm Hoạt Động</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold">20+</h2>
              <p className="mb-0">Cửa Hàng Toàn Quốc</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold">100k+</h2>
              <p className="mb-0">Khách Hàng Tin Dùng</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold">500+</h2>
              <p className="mb-0">Mẫu Mã Đa Dạng</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="container">
          <h3 className="fw-bold mb-4">Bạn Đã Sẵn Sàng Thay Đổi Phong Cách?</h3>
          <a
            href="/products"
            className="btn btn-outline-dark btn-lg rounded-pill px-5"
          >
            Khám Phá Ngay
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
