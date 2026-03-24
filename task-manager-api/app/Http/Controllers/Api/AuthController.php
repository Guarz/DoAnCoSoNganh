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
}
