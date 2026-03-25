<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// use Illuminate\Support\Facades\Hash;
use App\Models\User;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('Email', $request->email)->first();

        // SO SÁNH TRỰC TIẾP (Chỉ dùng để TEST, không dùng cho thực tế)
        if ($user && $request->password === $user->Password) {
            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->IdUser,
                    'name' => $user->Ten,
                    'email' => $user->Email,
                ],
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Email hoặc mật khẩu không khớp'
        ], 401);
    }
    public function register(Request $request)
    {
        $request->validate([
            'ten' => 'required',
            'email' => 'required|email|max:255|unique:User,Email',
            'password' => 'required',
        ]);

        // Gọi User::create sẽ kích hoạt Model
        $user = User::create([
            'Ten' => $request->ten,
            'Email' => $request->email,
            'Password' => $request->password,
        ]);

        // Nếu tạo thành công $user sẽ tồn tại
        if ($user) {
            return response()->json([
                'status' => 'success',
                'message' => 'Đăng ký thành công!',
            ], 201);
        }
    }
    public function updateProfile(Request $request, $id)
    {
        // 1. Kiểm tra dữ liệu (Validate)
        $request->validate([
            'ten' => 'required|string|max:255',
            // Cho phép trùng email với chính ID hiện tại, nhưng không được trùng với người khác
            'email' => 'required|email|unique:User,Email,' . $id . ',IdUser',
            'diachi' => 'nullable|string|max:255',
            'dienthoai' => 'nullable|string|max:15',
        ]);

        // 2. Thực hiện ghi đè dữ liệu
        $user = User::where('IdUser', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        // Ghi đè trực tiếp vào các cột viết hoa trong DB
        $user->Ten = $request->ten;
        $user->Email = $request->email;
        $user->DiaChi = $request->diachi;
        $user->DienThoai = $request->dienthoai;

        $user->save(); // Lệnh này thực hiện UPDATE SQL

        // 3. Trả về thông tin mới để React cập nhật Header
        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành công!',
            'user' => [
                'id' => $user->IdUser,
                'name' => $user->Ten,
                'email' => $user->Email,
                'address' => $user->DiaChi,
                'phone' => $user->DienThoai,
            ]
        ], 200);
    }
}
