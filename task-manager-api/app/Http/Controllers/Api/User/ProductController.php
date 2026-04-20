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
            $productsRaw = SanPham::with(['AnhSP', 'LoaiSP'])->get();

            $categories = DB::table('LoaiSP')
                ->select('IdLoai', 'TenLoai')
                ->get();

            $productsFormatted = $productsRaw->map(function ($p) {
                $firstImage = $p->AnhSP->first();

                return [
                    'IdSP'    => $p->IdSP,
                    'TenSP'   => $p->TenSP,
                    'IdLoai'  => $p->IdLoai,
                    'TenLoai' => $p->LoaiSP->TenLoai ?? 'Khác',
                    'Gia'     => $p->Gia,
                    'Size'    => $p->Size,
                    'HinhAnh' => $firstImage ? 'data:image/jpeg;base64,' . base64_encode($firstImage->HinhAnh) : null,
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
            $p = SanPham::with(['AnhSP', 'LoaiSP'])->find($id);

            if (!$p) {
                return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại'], 404);
            }

            $images = $p->AnhSP->map(function ($img) {
                return 'data:image/jpeg;base64,' . base64_encode($img->HinhAnh);
            });

            $data = [
                'IdSP'    => $p->IdSP,
                'TenSP'   => $p->TenSP,
                'MoTa'    => $p->MoTa,
                'IdLoai'  => $p->IdLoai,
                'TenLoai' => $p->LoaiSP->TenLoai ?? 'Chưa phân loại',
                'Gia'     => $p->Gia,
                'Size'    => $p->Size,
                'NgayTao' => $p->NgayTao,
                'HinhAnh' => $images,
            ];

            return response()->json([
                'success' => true,
                'data'    => $data
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
