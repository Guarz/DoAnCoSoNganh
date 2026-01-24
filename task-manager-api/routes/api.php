<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes - Hệ Thống Quản Trị
|--------------------------------------------------------------------------
*/

/**
 * 1. API ĐĂNG NHẬP
 * Kiểm tra email và mật khẩu (đã mã hóa) từ database
 */
Route::post('/login', function (Request $request) {
    // Tìm user theo email
    $user = User::where('email', $request->email)->first();

    // Sử dụng Hash::check để so sánh mật khẩu nhập vào với mã Bcrypt trong DB
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false, 
            'message' => 'Sai email hoặc mật khẩu quản trị!'
        ], 401);
    }

    return response()->json([
        'success' => true, 
        'user' => $user
    ]);
});

/**
 * 2. API LẤY DANH SÁCH SẢN PHẨM
 * Kết hợp với bảng categories để lấy tên danh mục thay vì chỉ lấy ID
 */
Route::get('/get-products', function() {
    return DB::table('products')
        ->join('categories', 'products.category_id', '=', 'categories.category_id')
        ->select('products.*', 'categories.category_name') // Lấy thêm category_name
        ->orderBy('products.product_id', 'desc') // Sản phẩm mới nhất lên đầu
        ->get();
});

/**
 * 3. API LẤY DANH SÁCH DANH MỤC
 * Dùng để hiển thị trong Select Box khi thêm sản phẩm mới
 */
Route::get('/get-categories', function() {
    return DB::table('categories')->select('category_id', 'category_name')->get();
});

/**
 * 4. API THÊM SẢN PHẨM MỚI
 */
Route::post('/products', function(Request $request) {
    try {
        $id = DB::table('products')->insertGetId([
            'product_name' => $request->product_name,
            'description'  => $request->description,
            'category_id'  => $request->category_id,
            'created_at'   => now(),
            'updated_at'   => now()
        ]);
        
        return response()->json([
            'success' => true, 
            'message' => 'Thêm sản phẩm thành công!',
            'product_id' => $id
        ]);
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