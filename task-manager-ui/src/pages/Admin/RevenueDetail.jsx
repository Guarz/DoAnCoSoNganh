import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/revenue.css";

function RevenueDetail() {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [revRes, prodRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/admin/revenue-chart"),
          axios.get("http://127.0.0.1:8000/api/admin/top-products"),
        ]);

        setChartData(revRes.data);
        setTopProducts(prodRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " VND";

  if (loading) {
    return <div className="loading">⏳ Đang tải...</div>;
  }

  return (
    <div className="revenue-container">
      {/* HEADER */}
      <div className="header">
        <button onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>

        <h2>
          <i className="bi bi-bar-chart"></i>
          Thống kê doanh thu
        </h2>
      </div>

      <div className="grid">
        {/* ===== DOANH THU ===== */}
        <div className="card">
          <h3>
            <i className="bi bi-graph-up"></i>
            Doanh thu theo tháng
          </h3>

          <table className="table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th className="right">Doanh thu</th>
              </tr>
            </thead>

            <tbody>
              {chartData.map((item, index) => (
                <tr key={index}>
                  <td>Tháng {item.month}</td>

                  <td className="right money">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== TOP PRODUCT ===== */}
        <div className="card">
          <h3>
            <i className="bi bi-star"></i>
            Sản phẩm bán chạy
          </h3>

          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th className="center">Đã bán</th>
                <th className="right">Doanh thu</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.map((p, index) => (
                <tr key={index}>
                  <td>
                    #{index + 1} {p.name}
                  </td>

                  <td className="center">
                    <span className="badge">{p.sold}</span>
                  </td>

                  <td className="right money">{formatCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RevenueDetail;
