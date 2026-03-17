<?php

namespace App\Http\Controllers\Api; // Thêm .Api vào đây

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GioHang;
use App\Models\ChiTietGioHang;
use App\Models\SanPham;

class CartController extends Controller
{
    // 1. Lấy toàn bộ sản phẩm trong giỏ hàng
    public function getCart($idUser)
    {
        $gioHang = GioHang::where('IdUser', $idUser)->first();

        if (!$gioHang) {
            return response()->json(['items' => []]);
        }

        $items = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->with(['SanPham.ChiTietSanPham', 'SanPham.AnhSP'])
            ->get()
            ->map(function($ct) {
                // Xử lý ảnh blob
                $imageData = null;
                if ($ct->SanPham && $ct->SanPham->AnhSP && $ct->SanPham->AnhSP->HinhAnh) {
                    $imageData = 'data:image/jpeg;base64,' . base64_encode($ct->SanPham->AnhSP->HinhAnh);
                }

                return [
                    'IdSP'     => $ct->IdSP,
                    'TenSP'    => $ct->SanPham->TenSP ?? 'Sản phẩm không tồn tại',
                    'HinhAnh'  => $imageData,
                    'price'    => $ct->SanPham->ChiTietSanPham->Gia ?? 0,
                    'quantity' => $ct->SoLuong,
                ];
            });

        return response()->json(['items' => $items, 'IdGH' => $gioHang->IdGH]);
    }

    // 2. Cập nhật số lượng (Tăng/Giảm)
    public function updateQty(Request $request)
    {
        $item = ChiTietGioHang::where('IdGH', $request->IdGH)
                              ->where('IdSP', $request->IdSP)
                              ->first();

        if ($item) {
            $item->SoLuong = $request->SoLuong;
            $item->save();
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 404);
    }

    // 3. Xóa sản phẩm khỏi giỏ
    public function removeItem(Request $request)
    {
        ChiTietGioHang::where('IdGH', $request->IdGH)
                      ->where('IdSP', $request->IdSP)
                      ->delete();

        return response()->json(['success' => true]);
    }
}