<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{

    // =============================
    // THỐNG KÊ TỔNG QUAN
    // =============================
    public function index()
    {
        $revenue = DB::table("chitietdonhang")->sum("TongTien");

        return response()->json([
            "totalProducts" => DB::table("sanpham")->count(),
            "totalCategories" => DB::table("loaisp")->count(),
            "totalOrders" => DB::table("donhang")->count(),
            "totalUser" => DB::table("user")->count(),
            "totalRevenue" => $revenue ?? 0
        ]);
    }


    // =============================
    // BIỂU ĐỒ DOANH THU THEO THÁNG
    // =============================
    public function revenueChart()
    {
        $data = DB::table("donhang")
            ->join("chitietdonhang", "donhang.IdDH", "=", "chitietdonhang.IdDH")
            ->select(
                DB::raw("MONTH(donhang.NgayDat) as month"),
                DB::raw("SUM(chitietdonhang.TongTien) as revenue")
            )
            ->groupBy(DB::raw("MONTH(donhang.NgayDat)"))
            ->get();

        $result = [];

        for ($i = 1; $i <= 12; $i++) {

            $found = $data->firstWhere("month", $i);

            $result[] = [
                "month" => $i,
                "revenue" => $found ? $found->revenue : 0
            ];
        }

        return response()->json($result);
    }


    // =============================
    // TOP SẢN PHẨM BÁN CHẠY
    // =============================
    public function topProducts()
    {
        $products = DB::table("chitietdonhang")
            ->join("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")
            ->select(
                "sanpham.TenSP as name",
                DB::raw("SUM(chitietdonhang.SoLuong) as sold"),
                DB::raw("SUM(chitietdonhang.TongTien) as revenue")
            )
            ->groupBy("sanpham.TenSP")
            ->orderByDesc("sold")
            ->limit(5)
            ->get();

        return response()->json($products);
    }

}