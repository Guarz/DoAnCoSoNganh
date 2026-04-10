<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\ChiTietGioHang;
use App\Models\GioHang;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function getCartByUserId($idUser)
    {
        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);

        $listItems = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->with(['SanPham.AnhSP']) 
            ->get();

        $items = $listItems->map(function ($ct) {
            $sp = $ct->SanPham;
            $firstImage = $sp->AnhSP->first(); 

            return [
                'IdSP'    => $sp->IdSP,
                'TenSP'   => $sp->TenSP,
                'SoLuong' => (int)$ct->SoLuong,
                'Gia'     => $sp->Gia,
                'HinhAnh' => $firstImage ? 'data:image/jpeg;base64,' . base64_encode($firstImage->Anh) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'cart_id' => $gioHang->IdGH,
            'products' => $items
        ]);
    }

    /** Thêm sản phẩm vào giỏ */
    public function addToCart(Request $request)
    {
        $request->validate([
            'IdUser' => 'required',
            'IdSP' => 'required',
            'SoLuong' => 'required|integer|min:1'
        ]);

        // Kiểm tra xem ID sản phẩm gửi lên có thực sự tồn tại trong máy chủ không
        $product = SanPham::find($request->IdSP);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại!'], 404);
        }

        $gioHang = GioHang::firstOrCreate(['IdUser' => $request->IdUser]);

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            // Vẫn dùng DB::table cho Update vì bảng ChiTietGioHang không có khóa chính
            DB::table('ChiTietGioHang')
                ->where('IdGH', $gioHang->IdGH)
                ->where('IdSP', $request->IdSP)
                ->update(['SoLuong' => $chiTiet->SoLuong + $request->SoLuong]);
        } else {
            // Dùng Model ChiTietGioHang để Create
            ChiTietGioHang::create([
                'IdGH' => $gioHang->IdGH,
                'IdSP' => $request->IdSP,
                'SoLuong' => $request->SoLuong
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Đã thêm ' . $product->TenSP . ' vào giỏ']);
    }

    /** Xóa sản phẩm khỏi giỏ */
    public function removeItem(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();
        if (!$gioHang) return response()->json(['success' => false], 404);

        ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Xóa thành công']);
    }
}