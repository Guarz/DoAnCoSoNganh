<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user theo cột Email (viết hoa chữ E)
        $user = User::where('Email', $request->email)->first();

        // Kiểm tra user tồn tại và so sánh mật khẩu
        // Tui dùng Hash::check để kiểm tra mật khẩu đã mã hóa (bcrypt)
        // Nếu DB của bạn đang lưu pass thô, hãy tạm sửa thành: $request->password === $user->Password
        if ($user && Hash::check($request->password, $user->Password)) {

            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->IdUser,
                    'name' => $user->Ten,
                    'email' => $user->Email,
                    // Trả về 'role' để React chuyển hướng vào trang Admin
                    'role' => $user->Quyen ?? 'user',
                ],
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Email hoặc mật khẩu không chính xác'
        ], 401);
    }

    public function register(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:User,Email',
            'password' => 'required|min:6',
        ]);

        // Tạo user mới và MÃ HÓA mật khẩu bằng bcrypt
        $user = User::create([
            'Ten' => $request->ten,
            'Email' => $request->email,
            'Password' => Hash::make($request->password),
            'Quyen' => 'user', // Mặc định là khách hàng
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký thành công!',
        ], 201);
    }

    public function updateProfile(Request $request, $id)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:User,Email,' . $id . ',IdUser',
            'diachi' => 'nullable|string|max:255',
            'dienthoai' => 'nullable|string|max:15',
        ]);

        $user = User::where('IdUser', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        // Cập nhật thông tin trực tiếp vào DB
        $user->Ten = $request->ten;
        $user->Email = $request->email;
        $user->DiaChi = $request->diachi;
        $user->DienThoai = $request->dienthoai;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!',
            'user' => [
                'id' => $user->IdUser,
                'name' => $user->Ten,
                'email' => $user->Email,
                'address' => $user->DiaChi,
                'phone' => $user->DienThoai,
                'role' => $user->Quyen
            ]
        ], 200);
    }
}