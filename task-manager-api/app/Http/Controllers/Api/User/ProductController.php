<?php
namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    /**
     * DANH SÁCH SẢN PHẨM CHO USER
     */
    public function index()
    {

        try {

            $products = DB::table('sanpham')
                ->leftjoin('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
                ->leftJoin('anhsp', 'sanpham.IdAnh', '=', 'anhsp.IdAnh')
                ->leftJoin('loaisp', 'sanpham.IdLoai', '=', 'loaisp.IdLoai')
                ->select(
                    'sanpham.IdSP as id',
                    'sanpham.TenSP as name',
                    'sanpham.MoTa as description',
                    'chitietsanpham.Gia as price',
                    'loaisp.TenLoai as category',
                    'anhsp.HinhAnh as image'
                )
                ->orderBy('sanpham.IdSP', 'desc')
                ->get();


            // Convert ảnh binary → base64
            foreach ($products as $p) {

                if ($p->image) {

                    $p->image = base64_encode($p->image);

                }

            }

            return response()->json($products);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);

        }

    }
    public function show($id)
    {
        try {
            $product = DB::table('sanpham')
                ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
                ->leftJoin('anhsp', 'sanpham.IdAnh', '=', 'anhsp.IdAnh')
                ->leftJoin('loaisp', 'sanpham.IdLoai', '=', 'loaisp.IdLoai')
                ->select(
                    'sanpham.IdSP as id',
                    'sanpham.TenSP as name',
                    'sanpham.MoTa as description',
                    'chitietsanpham.Gia as price',
                    'loaisp.TenLoai as category',
                    'anhsp.HinhAnh as image'
                )
                ->where('sanpham.IdSP', $id)
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không tồn tại'
                ], 404);
            }

            // Convert ảnh binary → base64
            if ($product->image) {
                $product->image = base64_encode($product->image);
            }

            return response()->json([
                'success' => true,
                'data' => $product
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}