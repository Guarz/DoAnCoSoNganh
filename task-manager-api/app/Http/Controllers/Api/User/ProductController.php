<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\SanPham;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $productsRaw = SanPham::with(['ChiTietSanPham', 'AnhSP', 'LoaiSP'])->get();

            $categories = DB::table('loaisp')
                ->select('IdLoai', 'TenLoai')
                ->get();

            $productsFormatted = $productsRaw->map(function ($p) {
                return [
                    'IdSP'      => $p->IdSP,
                    'TenSP'     => $p->TenSP,
                    'IdLoai'    => $p->IdLoai,
                    'TenLoai'   => $p->LoaiSP->TenLoai ?? 'Khác',
                    'Gia'       => $p->ChiTietSanPham->Gia ?? 0,
                    'HinhAnh'   => $p->AnhSP ? 'data:image/jpeg;base64,' . base64_encode($p->AnhSP->HinhAnh) : null,
                ];
            });

            return response()->json([
                'success'    => true,
                'products'   => $productsFormatted,
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $p = SanPham::with(['ChiTietSanPham', 'AnhSP', 'LoaiSP'])->find($id);

            if (!$p) {
                return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
            }

            $data = [
                'IdSP'        => $p->IdSP,
                'TenSP'       => $p->TenSP,
                'MoTa'        => $p->MoTa,
                'IdLoai'      => $p->IdLoai,
                'TenLoai'     => $p->LoaiSP->TenLoai ?? 'Chưa phân loại',
                'Gia'         => $p->ChiTietSanPham->Gia ?? 0,
                'HinhAnh'     => $p->AnhSP ? 'data:image/jpeg;base64,' . base64_encode($p->AnhSP->HinhAnh) : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
