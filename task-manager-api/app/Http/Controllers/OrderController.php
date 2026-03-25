<?php

namespace App\Http\Controllers;

use App\Models\DonHang;
use App\Models\ChiTietDonHang;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'IdUser' => 'required',
            'ChiTietDonHang' => 'required|array',
        ]);

        return DB::transaction(function () use ($request) {
            // Tạo đơn hàng
            $donHang = new DonHang();
            $donHang->IdUser = $request->IdUser;
            $donHang->DiaChiDat = $request->DiaChiDat;
            $donHang->IdTT = 1;
            $donHang->NgayDat = now();
            $donHang->save();

            $chiTiet = collect($request->ChiTietDonHang)->map(function ($item) use ($donHang) {
                return [
                    'IdDH'     => $donHang->IdDH,
                    'IdSP'     => $item['IdSP'],
                    'SoLuong'  => $item['SoLuong'],
                    'TongTien' => $item['Gia'] * $item['SoLuong'],
                ];
            })->toArray();

            ChiTietDonHang::insert($chiTiet);

            return response()->json(['status' => 'success', 'message' => 'Đặt hàng thành công!']);
        });
    }

    public function getOrdersByUser($id)
    {
        $orders = DonHang::with('chiTiet.sanPham')
            ->where('IdUser', $id)
            ->orderBy('IdDH', 'desc')
            ->get();

        $orders->each(function ($order) {
            $order->details = $order->chiTiet; 
            $order->TongTien = $order->chiTiet->sum('TongTien');
            $order->TrangThai = ($order->IdTT == 1) ? 'Chờ xác nhận' : 'Đã xác nhận';
        });

        return response()->json($orders);
    }
}
