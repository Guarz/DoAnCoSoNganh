<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use App\Models\ChiTietGioHang;
use App\Models\SanPham;
use App\Models\GioHang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng (Admin)
     */
    public function index()
    {
        // Dùng Model kèm theo quan hệ để lấy dữ liệu đầy đủ
        $orders = DonHang::with(['trangThai', 'user'])
            ->orderBy('NgayDat', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Xem chi tiết 1 đơn hàng
     */
    public function show($id)
    {
        $order = DonHang::with(['chiTiet.SanPham', 'trangThai', 'user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        return response()->json($order);
    }

    /** TẠO ĐƠN HÀNG MỚI (CHECKOUT) */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // 1. Tạo đơn hàng chính bằng Model DonHang
            $donHang = DonHang::create([
                'IdUser'    => $request->IdUser,
                'DiaChiDat' => $request->DiaChiDat,
                'IdTT'      => 1, // Mặc định: Chờ xác nhận
                'NgayDat'   => now()->toDateString(),
            ]);

            $items = $request->ChiTietDonHang; 
            
            if (!empty($items)) {
                foreach ($items as $item) {
                    // Lấy thông tin sản phẩm qua Model SanPham
                    $product = SanPham::find($item['IdSP']);
                    
                    if (!$product) {
                        throw new \Exception("Sản phẩm ID " . $item['IdSP'] . " không tồn tại!");
                    }

                    // 2. Tạo chi tiết đơn hàng bằng Model ChiTietDonHang
                    ChiTietDonHang::create([
                        'IdDH'     => $donHang->IdDH,
                        'IdSP'     => $item['IdSP'],
                        'SoLuong'  => $item['SoLuong'],
                        'TongTien' => $product->Gia * $item['SoLuong'],
                    ]);

                    // 3. Xóa món này khỏi giỏ hàng bằng Model ChiTietGioHang
                    // Tìm giỏ hàng của user
                    $gioHang = GioHang::where('IdUser', $request->IdUser)->first();
                    if ($gioHang) {
                        ChiTietGioHang::where('IdGH', $gioHang->IdGH)
                            ->where('IdSP', $item['IdSP'])
                            ->delete();
                    }
                }
            }

            DB::commit();
            return response()->json([
                'success' => true, 
                'message' => 'Đặt hàng thành công!', 
                'data'    => $donHang
            ], 200);

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
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        // Cập nhật IdTT (Foreign Key tới bảng TrangThai)
        $order->update(['IdTT' => $request->IdTT]);

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'order'   => $order->load('trangThai')
        ]);
    }

    /**
     * Hủy đơn hàng
     */
    public function destroy($id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        // Vì ChiTietDonHang không có khóa chính, lệnh delete() từ Model có thể gặp khó khăn
        // Ta nên xóa thủ công qua query để đảm bảo chính xác
        ChiTietDonHang::where('IdDH', $id)->delete();
        $order->delete();

        return response()->json(['message' => 'Hủy đơn hàng thành công']);
    }
}