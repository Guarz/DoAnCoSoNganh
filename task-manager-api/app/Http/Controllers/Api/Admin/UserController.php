<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // =============================
    // LẤY DANH SÁCH USER
    // =============================
    public function index()
    {
        try {
            $user = DB::table("user")
                ->select(
                    "IdUser as id",
                    "Ten as name",
                    "Email as email"
                )
                ->orderBy("IdUser", "desc")
                ->get();

            return response()->json($user);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // =============================
    // THÊM USER
    // =============================
    public function store(Request $request)
    {
        try {
            // Validate
            $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email",
                "password" => "required|min:6"
            ]);

            // Check email trùng
            $exists = DB::table("user")
                ->where("Email", $request->email)
                ->exists();

            if ($exists) {
                return response()->json([
                    "success" => false,
                    "message" => "Email đã tồn tại"
                ], 400);
            }

            // Insert
            $id = DB::table("user")->insertGetId([
                "Ten" => $request->name,
                "Email" => $request->email,
                "Password" => bcrypt($request->password),
                "DiaChi" => $request->address ?? "",
                "DienThoai" => $request->phone ?? "",
                "TrangThai" => 1
            ]);

            return response()->json([
                "success" => true,
                "message" => "Thêm user thành công",
                "id" => $id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // =============================
    // CẬP NHẬT USER
    // =============================
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email"
            ]);

            // Check tồn tại
            $user = DB::table("user")->where("IdUser", $id)->first();

            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User không tồn tại"
                ], 404);
            }

            // Check email trùng (trừ chính nó)
            $exists = DB::table("user")
                ->where("Email", $request->email)
                ->where("IdUser", "!=", $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    "success" => false,
                    "message" => "Email đã tồn tại"
                ], 400);
            }

            // Update
            DB::table("user")
                ->where("IdUser", $id)
                ->update([
                    "Ten" => $request->name,
                    "Email" => $request->email
                ]);

            return response()->json([
                "success" => true,
                "message" => "Cập nhật thành công"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    // =============================
    // XÓA USER
    // =============================
    public function destroy($id)
    {
        try {
            // Check tồn tại
            $user = DB::table("user")->where("IdUser", $id)->first();

            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User không tồn tại"
                ], 404);
            }

            // Xoá
            DB::table("user")
                ->where("IdUser", $id)
                ->delete();

            return response()->json([
                "success" => true,
                "message" => "Xóa thành công"
            ]);

        } catch (\Illuminate\Database\QueryException $e) {
            // Lỗi ràng buộc khóa ngoại
            return response()->json([
                "success" => false,
                "message" => "User có dữ liệu liên quan, không thể xóa"
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }
}