<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{

    /*
    =====================================
    LOGIN
    =====================================
    */

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // tìm user theo email
        $user = User::where('Email', $request->email)->first();

        if (!$user) {

            return response()->json([
                "success" => false,
                "message" => "Email không tồn tại"
            ], 404);

        }

        // kiểm tra mật khẩu
        if ($request->password !== $user->Password) {

            return response()->json([
                "success" => false,
                "message" => "Mật khẩu không đúng"
            ], 401);

        }

        /*
        =========================
        PHÂN QUYỀN
        =========================
        */

        $role = "user";

        if ($user->Email === "admin@gmail.com") {
            $role = "admin";
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
                "role" => $role
            ]
        ]);

    }



    /*
    =====================================
    REGISTER
    =====================================
    */

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
            "NgayTao" => now()
        ]);

        return response()->json([
            "success" => true,
            "message" => "Đăng ký thành công",
            "user" => [
                "id" => $user->IdUser,
                "name" => $user->Ten,
                "email" => $user->Email,
                "role" => "user"
            ]
        ]);

    }



    /*
    =====================================
    UPDATE PROFILE
    =====================================
    */

    public function updateProfile(Request $request, $id)
    {

        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:user,Email,' . $id . ',IdUser',
            'diachi' => 'nullable|string|max:255',
            'dienthoai' => 'nullable|string|max:15'
        ]);

        $user = User::where("IdUser", $id)->first();

        if (!$user) {

            return response()->json([
                "success" => false,
                "message" => "Không tìm thấy người dùng"
            ], 404);

        }

        $user->Ten = $request->ten;
        $user->Email = $request->email;
        $user->DiaChi = $request->diachi;
        $user->DienThoai = $request->dienthoai;

        $user->save();

        /*
        =========================
        PHÂN QUYỀN
        =========================
        */

        $role = "user";

        if ($user->Email === "admin@gmail.com") {
            $role = "admin";
        }

        return response()->json([
            "success" => true,
            "message" => "Cập nhật thành công",
            "user" => [
                "id" => $user->IdUser,
                "name" => $user->Ten,
                "email" => $user->Email,
                "address" => $user->DiaChi,
                "phone" => $user->DienThoai,
                "role" => $role
            ]
        ]);

    }

}