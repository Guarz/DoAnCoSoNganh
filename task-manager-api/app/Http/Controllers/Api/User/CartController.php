<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChiTietGioHang;
use App\Models\GioHang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Lấy danh sách giỏ hàng theo ID người dùng
     */
    public function getCartByUserId($idUser)
    {
        // Sử dụng firstOrCreate để đảm bảo luôn có giỏ hàng cho User
        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);

        $listItems = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->has('SanPham') // Chỉ lấy nếu sản phẩm còn tồn tại trong bảng sanpham
            ->with(['SanPham.anhSP', 'SanPham.chiTietSanPham'])
            ->get();

        if ($listItems->isEmpty()) {
            return response()->json([
                'success' => true,
                'products' => [],
                'cart_id' => $gioHang->IdGH
            ]);
        }

        $items = $listItems->map(function ($ct) {
            $sp = $ct->SanPham;
            return [
                'IdSP'      => $sp->IdSP,
                'TenSP'     => $sp->TenSP,
                'SoLuong'   => (int)$ct->SoLuong, // Đổi thành SoLuong cho đồng nhất
                'Gia'       => $sp->chiTietSanPham->Gia ?? 0,
                'HinhAnh'   => $sp->anhSP ? 'data:image/jpeg;base64,' . base64_encode($sp->anhSP->HinhAnh) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'cart_id' => $gioHang->IdGH,
            'products' => $items
        ]);
    }

    /**
     * Thêm sản phẩm vào giỏ
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'IdUser' => 'required',
            'IdSP' => 'required',
            'SoLuong' => 'required|integer|min:1'
        ]);

        $gioHang = GioHang::firstOrCreate(['IdUser' => $request->IdUser]);

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->SoLuong += $request->SoLuong;
            $chiTiet->save();
        } else {
            ChiTietGioHang::create([
                'IdGH' => $gioHang->IdGH,
                'IdSP' => $request->IdSP,
                'SoLuong' => $request->SoLuong
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sản phẩm vào giỏ hàng'
        ]);
    }

    /**
     * Cập nhật số lượng trong trang Cart
     */
    public function updateQty(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Giỏ hàng không tồn tại'], 404);
        }

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            // Nếu số lượng <= 0 thì coi như xóa
            if ($request->SoLuong <= 0) {
                $chiTiet->delete();
                return response()->json(['success' => true, 'message' => 'Đã xóa sản phẩm']);
            }

            $chiTiet->SoLuong = $request->SoLuong;
            $chiTiet->save();
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm trong giỏ'], 404);
    }

    /**
     * Xóa sản phẩm khỏi giỏ
     */
    public function removeItem(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }
        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->delete();
            return response()->json(['success' => true, 'message' => 'Xóa thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không có trong giỏ'], 404);
    }
}