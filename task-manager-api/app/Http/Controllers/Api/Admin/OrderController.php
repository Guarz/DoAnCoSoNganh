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
        $orders = DonHang::with([
            'User',
            'TrangThai',
            'chiTiet.sanPham'
        ])->orderBy('IdDH', 'desc')->get();

        return response()->json([
            "success" => true,
            "data" => $orders
        ]);
    }


    // Cập nhật trạng thái đơn hàng
    public function updateStatus(Request $request, $id)
    {
        if (!$request->IdTT) {
            return response()->json([
                "success" => false,
                "message" => "Thiếu trạng thái đơn hàng"
            ], 400);
        }

        $order = DonHang::find($id);

        if (!$order) {
            return response()->json([
                "success" => false,
                "message" => "Không tìm thấy đơn hàng"
            ], 404);
        }

        $order->IdTT = $request->IdTT;
        $order->save();

        return response()->json([
            "success" => true,
            "message" => "Cập nhật trạng thái thành công"
        ]);
    }
}
