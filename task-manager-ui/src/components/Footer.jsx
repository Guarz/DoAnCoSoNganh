import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Cột trái: Chiếm 12 cột trên mobile, 6 cột trên PC */}
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <p className="mb-1">
              <strong>Địa chỉ:</strong> CS2 - Học Viện Hàng không Việt Nam
            </p>
            <p className="mb-0">
              <strong>Email:</strong> shopquanao@gmail.com
            </p>
          </div>

          {/* Cột phải */}
          <div className="col-12 col-md-6 text-md-end">
            <p className="mb-1">
              <strong>Điện thoại:</strong> 0123456789
            </p>
            <p className="mb-0 text-muted small">
              © Shop quần áo nhóm 1. Bảo lưu mọi quyền.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
