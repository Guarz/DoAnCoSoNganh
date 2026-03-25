<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Xử lý Đăng nhập & Phân quyền dựa trên Email
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user theo cột Email (khớp với Database của bạn)
        $user = User::where('Email', $request->email)->first();

        // Kiểm tra user và so sánh mật khẩu thô (VD: 123456)
        if ($user && $request->password === $user->Password) {

            /** * PHÂN QUYỀN TRỰC TIẾP TRONG CODE
             * Nếu email là admin@gmail.com thì gắn role là admin.
             * Tất cả các email còn lại sẽ có role là user.
             */
            $role = ($user->Email === 'admin@gmail.com') ? 'admin' : 'user';

            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->IdUser,
                    'name' => $user->Ten,
                    'email' => $user->Email,
                    'role' => $role,
                ],
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Email hoặc mật khẩu không chính xác'
        ], 401);
    }

    /**
     * Xử lý Đăng ký (Mặc định là user)
     */
    public function register(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:user,Email', // Kiểm tra trùng email trong bảng user
            'password' => 'required',
        ]);

        // Tạo user mới với mật khẩu thô
        $user = User::create([
            'Ten' => $request->ten,
            'Email' => $request->email,
            'Password' => $request->password,
            'NgayTao' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký thành công!',
        ], 201);
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    public function updateProfile(Request $request, $id)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:user,Email,' . $id . ',IdUser',
            'diachi' => 'nullable|string|max:255',
            'dienthoai' => 'nullable|string|max:15',
        ]);

        $user = User::where('IdUser', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        // Cập nhật các trường viết hoa khớp với DB
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
                // Vẫn giữ logic phân quyền khi trả về thông tin cập nhật
                'role' => ($user->Email === 'admin@gmail.com') ? 'admin' : 'user'
            ]
        ], 200);
    }
}