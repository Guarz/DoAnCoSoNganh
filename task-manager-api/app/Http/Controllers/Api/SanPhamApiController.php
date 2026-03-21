<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SanPham;
use App\Models\AnhSP;

class SanPhamApiController extends Controller
{
    public function store(Request $request)
    {

        $image = file_get_contents($request->image);

        $anh = AnhSP::create([
            'HinhAnh' => $image
        ]);

        $sanpham = SanPham::create([
            'TenSP' => $request->name,
            'MoTa' => $request->shortDesc,
            'IdLoai' => 1,
            'NgayTao' => now(),
            'IdCT' => 1,
            'IdAnh' => $anh->IdAnh
        ]);

        return response()->json($sanpham);

    }
}