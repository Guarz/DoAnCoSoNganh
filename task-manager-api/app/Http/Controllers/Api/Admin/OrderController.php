<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Lấy danh sách đơn hàng
    public function index()
    {
        $orders = DonHang::with(['User', 'TrangThai', 'chiTiet.sanPham'])
            ->get();

        return response()->json($orders);
    }

    // Cập nhật trạng thái
    public function updateStatus(Request $request, $id)
    {
        $order = DonHang::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn'], 404);
        }

        $order->IdTT = $request->IdTT; // 1: Đang giao, 2: Hoàn thành
        $order->save();

        return response()->json(['message' => 'Cập nhật thành công']);
    }
}