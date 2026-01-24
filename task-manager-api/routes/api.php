<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Hệ Thống Quản Trị Hoàn Chỉnh (Đã tối ưu hóa)
|--------------------------------------------------------------------------
*/

// --- 1. NHÓM TÀI KHOẢN (USERS) ---
Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['success' => false, 'message' => 'Sai tài khoản!'], 401);
    }
    return response()->json(['success' => true, 'user' => $user]);
});

Route::get('/get-users', function () {
    // Lấy thêm trường 'id' để React làm key khi render bảng
    return DB::table('users')->select('user_id', 'name', 'email', 'created_at')->get();
});

// --- 2. NHÓM SẢN PHẨM (PRODUCTS) ---
Route::get('/get-products', function () {
    return DB::table('products')
        ->leftJoin('categories', 'products.category_id', '=', 'categories.category_id')
        ->select('products.*', 'categories.category_name')
        ->orderBy('products.product_id', 'desc')
        ->get();
});

Route::post('/products', function (Request $request) {
    try {
        // Thêm validate cơ bản để tránh lỗi Database
        if (!$request->product_name || !$request->category_id) {
            return response()->json(['success' => false, 'message' => 'Thiếu tên hoặc danh mục'], 400);
        }

        $id = DB::table('products')->insertGetId([
            'product_name' => $request->product_name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        return response()->json(['success' => true, 'product_id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

/**
 * 5. API XÓA SẢN PHẨM
 */
Route::delete('/products/{id}', function($id) {
    $deleted = DB::table('products')->where('product_id', $id)->delete();
    
    if ($deleted) {
        return response()->json(['success' => true, 'message' => 'Đã xóa sản phẩm']);
    }
    return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
});