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
    public function index()
    {
        $orders = DonHang::with(['trangThai', 'user'])
            ->orderBy('NgayDat', 'desc')
            ->get();

        return response()->json($orders);
    }
    public function show($id)
    {
        $order = DonHang::with(['chiTiet.SanPham', 'trangThai', 'user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        return response()->json($order);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $donHang = DonHang::create([
                'IdUser'    => $request->IdUser,
                'DiaChiDat' => $request->DiaChiDat,
                'IdTT'      => 1, // Mặc định: Chờ xác nhận
                'NgayDat'   => now()->toDateString(),
            ]);

            $items = $request->ChiTietDonHang;

            if (!empty($items)) {
                foreach ($items as $item) {
                    $product = SanPham::find($item['IdSP']);

                    if (!$product) {
                        throw new \Exception("Sản phẩm ID " . $item['IdSP'] . " không tồn tại!");
                    }
                    ChiTietDonHang::create([
                        'IdDH'     => $donHang->IdDH,
                        'IdSP'     => $item['IdSP'],
                        'SoLuong'  => $item['SoLuong'],
                        'TongTien' => $product->Gia * $item['SoLuong'],
                    ]);
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
    public function updateStatus(Request $request, $id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }
        $order->update(['IdTT' => $request->IdTT]);

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'order'   => $order->load('trangThai')
        ]);
    }
    public function getUserOrders($userId)
    {
        try {
            $orders = DonHang::with([
                'trangThai',
                'chiTiet.SanPham.AnhSP'
            ])
                ->where('IdUser', $userId)
                ->orderBy('IdDH', 'desc')
                ->get();
            foreach ($orders as $order) {
                foreach ($order->chiTiet as $detail) {
                    $sp = $detail->SanPham;

                    if ($sp) {
                        $firstImage = $sp->AnhSP->first();
                        if ($firstImage && $firstImage->HinhAnh) {
                            $sp->Anh = 'data:image/jpeg;base64,' . base64_encode($firstImage->HinhAnh);
                        } else {
                            $sp->Anh = null;
                        }
                        unset($sp->AnhSP);
                    }
                }
            }
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }
}
