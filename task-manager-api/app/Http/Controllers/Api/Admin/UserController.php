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
            //  VALIDATE
            $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email",
                "password" => "required|min:6"
            ]);

            //  CHECK EMAIL TRÙNG
            $exists = DB::table("user")
                ->where("Email", $request->email)
                ->exists();

            if ($exists) {
                return response()->json([
                    "success" => false,
                    "message" => "Email đã tồn tại"
                ], 400);
            }

            //  INSERT
            $id = DB::table("user")->insertGetId([
                "Ten" => $request->name,
                "Email" => $request->email,
                "Password" => bcrypt($request->password),
                "DiaChi" => "",
                "DienThoai" => ""
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
    // CẬP NHẬT USER (có password)
    // =============================
    public function update(Request $request, $id)
    {
        try {
            //  VALIDATE
            $request->validate([
                "name" => "required|string|max:255",
                "email" => "required|email"
            ]);

            //  CHECK USER TỒN TẠI
            $user = DB::table("user")->where("IdUser", $id)->first();

            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User không tồn tại"
                ], 404);
            }

            //  CHECK EMAIL TRÙNG (trừ chính nó)
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

            //  DATA UPDATE
            $data = [
                "Ten" => $request->name,
                "Email" => $request->email
            ];

            //  NẾU CÓ NHẬP PASSWORD → UPDATE
            if ($request->password) {
                $data["Password"] = bcrypt($request->password);
            }

            DB::table("user")
                ->where("IdUser", $id)
                ->update($data);

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
            $user = DB::table("user")->where("IdUser", $id)->first();

            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User không tồn tại"
                ], 404);
            }

            DB::table("user")
                ->where("IdUser", $id)
                ->delete();

            return response()->json([
                "success" => true,
                "message" => "Xóa thành công"
            ]);

        } catch (\Illuminate\Database\QueryException $e) {
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