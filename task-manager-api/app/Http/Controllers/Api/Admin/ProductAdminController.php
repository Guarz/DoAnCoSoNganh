<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductAdminController extends Controller
{
    // ================= DANH SÁCH =================
    public function index()
    {
        $products = DB::table("sanpham")
            ->leftJoin("loaisp", "sanpham.IdLoai", "=", "loaisp.IdLoai")
            ->leftJoin("anhsp", "sanpham.IdSP", "=", "anhsp.IdSP")
            ->select(
                "sanpham.IdSP as id",
                "sanpham.TenSP as name",
                "sanpham.MoTa as description",
                "sanpham.Gia as price",
                "sanpham.IdLoai as categoryId",
                "loaisp.TenLoai as category_name",
                DB::raw("MAX(anhsp.HinhAnh) as image")
            )
            ->groupBy(
                "sanpham.IdSP",
                "sanpham.TenSP",
                "sanpham.MoTa",
                "sanpham.Gia",
                "sanpham.IdLoai",
                "loaisp.TenLoai"
            )
            ->orderBy("sanpham.IdSP", "desc")
            ->get();

        foreach ($products as $p) {
            $p->image = $p->image
                ? "data:image/jpeg;base64," . base64_encode($p->image)
                : null;
        }

        return response()->json($products);
    }

    // ================= THÊM =================
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            if (!$request->name || !$request->price || !$request->categoryId) {
                return response()->json([
                    "success" => false,
                    "message" => "Thiếu dữ liệu"
                ], 400);
            }

            $productId = DB::table("sanpham")->insertGetId([
                "TenSP" => $request->name,
                "MoTa" => $request->description ?? "",
                "Gia" => $request->price,
                "NgayTao" => now(),
                "IdLoai" => $request->categoryId
            ]);

            // ảnh
            if ($request->hasFile("image")) {
                $imageData = file_get_contents($request->file("image")->getRealPath());

                DB::table("anhsp")->insert([
                    "IdSP" => $productId,
                    "HinhAnh" => $imageData
                ]);
            }

            DB::commit();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // ================= UPDATE =================
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $product = DB::table("sanpham")->where("IdSP", $id)->first();

            if (!$product) {
                return response()->json([
                    "success" => false,
                    "message" => "Không tìm thấy"
                ], 404);
            }

            // 🔥 FIX QUAN TRỌNG
            if (!$request->name || !$request->price || !$request->categoryId) {
                return response()->json([
                    "success" => false,
                    "message" => "Thiếu dữ liệu update"
                ], 400);
            }

            DB::table("sanpham")
                ->where("IdSP", $id)
                ->update([
                    "TenSP" => $request->name,
                    "MoTa" => $request->description ?? "",
                    "Gia" => $request->price,
                    "IdLoai" => $request->categoryId
                ]);

            // ảnh mới
            if ($request->hasFile("image")) {

                $imageData = file_get_contents($request->file("image")->getRealPath());

                DB::table("anhsp")->where("IdSP", $id)->delete();

                DB::table("anhsp")->insert([
                    "IdSP" => $id,
                    "HinhAnh" => $imageData
                ]);
            }

            DB::commit();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // ================= DELETE =================
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $product = DB::table("sanpham")->where("IdSP", $id)->first();

            if (!$product) {
                return response()->json([
                    "success" => false,
                    "message" => "Không tồn tại"
                ], 404);
            }

            // 🔥 FIX FK
            DB::table("anhsp")->where("IdSP", $id)->delete();

            DB::table("sanpham")->where("IdSP", $id)->delete();

            DB::commit();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }
}