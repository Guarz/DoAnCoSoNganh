import React from "react";
import "../../style/HomePage.css";

const HomePage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container py-5">
        <section className="row align-items-center mb-5 bg-white p-5 rounded-4 shadow-sm">
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-4 fw-bold text-danger mb-3">
              Chào Mừng Đến Với SHOP QUẦN ÁO A
            </h1>
            <p className="lead text-muted mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <button className="btn btn-danger btn-lg px-4 rounded-pill">
                Mua Ngay
              </button>
              <button className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="https://via.placeholder.com/500x350/ffebee/d63384?text=Banner+Shop+A"
              alt="Hero Banner"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </section>

        {/* Phần 2: Giới thiệu ngắn về Shop */}
        <section className="mb-5 bg-white p-5 rounded-4 shadow-sm">
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center">
              <h2 className="fw-bold text-dark mb-4 border-bottom pb-2 d-inline-block">
                Về Chúng Tôi
              </h2>
              <p className="text-muted fs-5 lh-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </section>

        {/* Phần 3: Tại sao chọn chúng tôi? */}
        <section className="bg-white p-5 rounded-4 shadow-sm">
          <h2 className="fw-bold text-dark mb-5 text-center">
            Tại Sao Chọn SHOP QUẦN ÁO A?
          </h2>
          <div className="row g-4 text-center">
            {/* Lý do 1 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm bg-light-subtle rounded-3 p-3">
                <div className="card-body">
                  <i className="fas fa-tshirt text-danger fs-1 mb-3"></i>
                  <h5 className="card-title fw-semibold text-danger">
                    Mẫu Mã Đa Dạng
                  </h5>
                  <p className="card-text text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt.
                  </p>
                </div>
              </div>
            </div>
            {/* Lý do 2 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm bg-light-subtle rounded-3 p-3">
                <div className="card-body">
                  <i className="fas fa-shipping-fast text-danger fs-1 mb-3"></i>
                  <h5 className="card-title fw-semibold text-danger">
                    Giao Hàng Nhanh
                  </h5>
                  <p className="card-text text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt.
                  </p>
                </div>
              </div>
            </div>
            {/* Lý do 3 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm bg-light-subtle rounded-3 p-3">
                <div className="card-body">
                  <i className="fas fa-hand-holding-usd text-danger fs-1 mb-3"></i>
                  <h5 className="card-title fw-semibold text-danger">
                    Giá Cả Hợp Lý
                  </h5>
                  <p className="card-text text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
