<?php

namespace App\Http\Controllers;

use App\Models\SanPham;

class SanPhamController extends Controller
{

    // =============================
    // TRANG DANH SÁCH SẢN PHẨM
    // =============================
    public function index()
    {
        // Lấy toàn bộ sản phẩm + loại + ảnh + chi tiết giá
        $sanphams = SanPham::with([
            'LoaiSP',
            'AnhSP',
            'ChiTietSanPham'
        ])->orderBy('IdSP', 'desc')->get();

        return view('home', compact('sanphams'));
    }


    // =============================
    // TRANG CHI TIẾT SẢN PHẨM
    // =============================
    public function detail($id)
    {
        // Tìm sản phẩm theo id
        $sanpham = SanPham::with([
            'LoaiSP',
            'AnhSP',
            'ChiTietSanPham'
        ])->findOrFail($id);

        return view('detail', compact('sanpham'));
    }

}
