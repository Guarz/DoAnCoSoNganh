<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Lấy danh sách danh mục
    public function index()
    {
        $categories = DB::table("loaisp")
            ->select("IdLoai as id", "TenLoai as name")
            ->orderBy("IdLoai", "desc")
            ->get();

        return response()->json($categories);
    }


    // Thêm danh mục
    public function store(Request $request)
    {
        if (!$request->name) {
            return response()->json([
                "success" => false,
                "message" => "Tên danh mục không được để trống"
            ], 400);
        }

        $id = DB::table("loaisp")->insertGetId([
            "TenLoai" => $request->name
        ]);

        return response()->json([
            "success" => true,
            "id" => $id
        ]);
    }


    // Cập nhật danh mục
    public function update(Request $request, $id)
    {
        if (!$request->name) {
            return response()->json([
                "success" => false,
                "message" => "Tên danh mục không được để trống"
            ], 400);
        }

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->update([
                "TenLoai" => $request->name
            ]);

        return response()->json([
            "success" => true
        ]);
    }


    // Xóa danh mục
    public function destroy($id)
    {
        // kiểm tra có sản phẩm thuộc danh mục không
        $count = DB::table("sanpham")
            ->where("IdLoai", $id)
            ->count();

        if ($count > 0) {
            return response()->json([
                "success" => false,
                "message" => "Danh mục đang chứa sản phẩm"
            ]);
        }

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    }
}
