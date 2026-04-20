<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{

    // =========================
    // USER LOGIN
    // =========================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('Email', $request->email)->first();

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Email không tồn tại"
            ], 404);
        }

        if ($request->password !== $user->Password) {
            return response()->json([
                "success" => false,
                "message" => "Mật khẩu không đúng"
            ], 401);
        }

        return response()->json([
            "success" => true,
            "message" => "Đăng nhập thành công",
            "user" => [
                "id" => $user->IdUser,
                "name" => $user->Ten,
                "email" => $user->Email,
                "address" => $user->DiaChi,
                "phone" => $user->DienThoai,
                "role" => "user"
            ]
        ]);
    }


    // =========================
    // ADMIN LOGIN
    // =========================
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = DB::table('admin')
            ->where('Email', $request->email)
            ->first();

        if (!$admin) {
            return response()->json([
                "success" => false,
                "message" => "Admin không tồn tại"
            ], 404);
        }

        if ($request->password !== $admin->Password) {
            return response()->json([
                "success" => false,
                "message" => "Mật khẩu admin không đúng"
            ], 401);
        }

        return response()->json([
            "success" => true,
            "message" => "Chào mừng Admin",
            "user" => [
                "id" => $admin->idAdmin,
                "name" => $admin->TenAdmin,
                "email" => $admin->Email,
                "role" => "admin"
            ]
        ]);
    }


    // =========================
    // REGISTER
    // =========================
    public function register(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:user,Email',
            'password' => 'required'
        ]);

        $user = User::create([
            "Ten" => $request->ten,
            "Email" => $request->email,
            "Password" => $request->password,
        ]);

        return response()->json([
            "success" => true,
            "message" => "Đăng ký thành công",
            "user" => [
                "id" => $user->IdUser,
                "name" => $user->Ten,
                "email" => $user->Email,
            ]
        ]);
    }


    // =========================
    // UPDATE PROFILE
    // =========================
    public function updateProfile(Request $request, $id)
    {

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Không tìm thấy người dùng"
            ], 404);
        }

        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:user,Email,' . $id . ',IdUser',
            'diachi' => 'nullable|string|max:255',
            'dienthoai' => 'nullable|string|max:15'
        ]);

        try {

            $user->update([
                'Ten' => $request->ten,
                'Email' => $request->email,
                'DiaChi' => $request->diachi,
                'DienThoai' => $request->dienthoai,
            ]);

            return response()->json([
                "success" => true,
                "message" => "Cập nhật thông tin thành công",
                "user" => [
                    "id" => $user->IdUser,
                    "name" => $user->Ten,
                    "email" => $user->Email,
                    "address" => $user->DiaChi,
                    "phone" => $user->DienThoai,
                ]
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                "success" => false,
                "message" => "Lỗi hệ thống: " . $e->getMessage()
            ], 500);
        }
    }
}
