<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChiTietGioHang;
use App\Models\GioHang;
// use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Lấy danh sách sản phẩm trong giỏ
     */
    public function getCartByUserId($idUser)
    {
        // 1. Đảm bảo luôn có bản ghi GioHang (cái vỏ)
        // Lưu ý: Cần thêm $fillable = ['IdUser'] vào model GioHang để chạy dòng này
        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);

        // 2. Truy vấn trực tiếp từ bảng ChiTietGioHang thông qua IdGH
        // Sử dụng chính xác tên hàm bạn viết trong Model: ChiTietGioHang, SanPham
        $listItems = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->with(['SanPham.anhSP', 'SanPham.chiTietSanPham'])
            ->get();

        // 3. Trường hợp giỏ hàng trống
        if ($listItems->isEmpty()) {
            return response()->json([
                'success' => true,
                'products' => [], // Trả về mảng rỗng để React hiện "Giỏ hàng trống"
                'cart_id' => $gioHang->IdGH
            ]);
        }

        // 4. Map dữ liệu để trả về frontend (Khớp với các trường React đang dùng)
        $items = $listItems->map(function ($ct) {
            $sp = $ct->SanPham; // Gọi đúng hàm SanPham() trong model ChiTietGioHang

            return [
                'IdSP'     => $sp->IdSP,
                'TenSP'    => $sp->TenSP,
                'quantity' => $ct->SoLuong, 
                'Gia'      => $sp->chiTietSanPham->Gia ?? 0,
                'HinhAnh'  => $sp->anhSP ? 'data:image/jpeg;base64,' . base64_encode($sp->anhSP->HinhAnh) : null,
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
        $idUser = $request->IdUser;
        $idSP = $request->IdSP;
        $soLuongThem = $request->SoLuong;

        $gioHang = GioHang::firstOrCreate(['IdUser' => $idUser]);

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $idSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->SoLuong += $soLuongThem;
            $chiTiet->save();
        } else {
            // Cần thêm $fillable vào model ChiTietGioHang để chạy dòng này
            ChiTietGioHang::create([
                'IdGH' => $gioHang->IdGH,
                'IdSP' => $idSP,
                'SoLuong' => $soLuongThem
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sản phẩm vào giỏ hàng',
            'IdGH' => $gioHang->IdGH
        ]);
    }

    /**
     * Cập nhật số lượng (+ - tại trang giỏ hàng)
     */
    public function updateQty(Request $request)
    {
        $gioHang = GioHang::where('IdUser', $request->IdUser)->first();

        if (!$gioHang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }

        $chiTiet = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->first();

        if ($chiTiet) {
            $chiTiet->SoLuong = $request->SoLuong; 
            $chiTiet->save();
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
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

        $deleted = ChiTietGioHang::where('IdGH', $gioHang->IdGH)
            ->where('IdSP', $request->IdSP)
            ->delete();

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Xóa thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
    }
}