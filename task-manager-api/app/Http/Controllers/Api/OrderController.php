<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng (Admin)
     */
    public function index()
    {
        $orders = DonHang::orderBy('created_at', 'desc')->get();

        return response()->json($orders);
    }

    /**
     * Xem chi tiết 1 đơn hàng
     */
    public function show($id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        return response()->json($order);
    }
/** TẠO ĐƠN HÀNG MỚI */
    public function store(Request $request)
{
    try {
        DB::beginTransaction();

        // 1. Tạo đơn hàng chính
        $idDonHang = DB::table('donhang')->insertGetId([
            'IdUser'     => $request->IdUser,
            'DiaChiDat'  => $request->DiaChiDat,
            'IdTT'       => 0, 
            'NgayDat'    => now()->toDateString(), 
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $chiTiet = $request->ChiTietDonHang; 
        if (!empty($chiTiet)) {
            foreach ($chiTiet as $item) {
                $product = DB::table('sanpham')
                    ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
                    ->where('sanpham.IdSP', $item['IdSP'])
                    ->first();
                
                if (!$product) {
                    throw new \Exception("Sản phẩm ID " . $item['IdSP'] . " không còn tồn tại trong hệ thống!");
                }

                DB::table('chitietdonhang')->insert([
                    'IdDH'      => $idDonHang,
                    'IdSP'      => $item['IdSP'],
                    'SoLuong'   => $item['SoLuong'],
                    'TongTien'  => (int)$product->Gia * $item['SoLuong'],
                ]);

                DB::table('chitietgiohang')
                    ->join('giohang', 'chitietgiohang.IdGH', '=', 'giohang.IdGH')
                    ->where('giohang.IdUser', $request->IdUser)
                    ->where('chitietgiohang.IdSP', $item['IdSP'])
                    ->delete();
            }
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'Đặt hàng thành công!'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false, 
            'message' => 'Lỗi hệ thống: ' . $e->getMessage()
        ], 500);
    }
}
    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'trang_thai' => 'required|string'
        ]);

        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        $order->trang_thai = $request->trang_thai;
        $order->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công',
            'order' => $order
        ]);
    }

    /**
     * Hủy đơn hàng
     */
    public function destroy($id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'message' => 'Hủy đơn hàng thành công'
        ]);
    }
}
