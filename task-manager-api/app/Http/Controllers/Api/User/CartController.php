<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChiTietGioHang;
use App\Models\GioHang;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCartByUserId($idUser)
    {
        // Dán nội dung hàm của bạn vào đây
        $userData = User::with(['gioHang.chiTiet.sanPham.anhSP', 'gioHang.chiTiet.sanPham.chiTietSanPham'])
            ->where('IdUser', $idUser)
            ->first();

        if (!$userData || !$userData->gioHang) {
            return response()->json(['success' => true, 'products' => []]);
        }

        $items = $userData->gioHang->chiTiet->map(function ($ct) {
            $sp = $ct->sanPham;

            return [
                'IdSP'     => $sp->IdSP,
                'TenSP'    => $sp->TenSP,
                'SoLuong'  => $ct->SoLuong,
                'Gia'      => $sp->chiTietSanPham->Gia ?? 0,
                'HinhAnh'  => $sp->anhSP ? 'data:image/jpeg;base64,' . base64_encode($sp->anhSP->HinhAnh) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'cart_id' => $userData->gioHang->IdGH,
            'products' => $items
        ]);
    }
    // Hàm xóa sản phẩm khỏi giỏ hàng
    public function removeItem(Request $request)
    {
        // Tìm giỏ hàng của User trước
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }

        // Xóa dòng sản phẩm tương ứng trong bảng ChiTietGioHang
        $deleted = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->delete();

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Xóa sản phẩm thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại trong giỏ'], 404);
    }
}
