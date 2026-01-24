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

Route::delete('/products/{id}', function ($id) {
    // Xóa theo đúng khóa chính product_id
    DB::table('products')->where('product_id', $id)->delete();
    return response()->json(['success' => true]);
});

// --- 3. NHÓM DANH MỤC (CATEGORIES) ---
Route::get('/get-categories', function () {
    return DB::table('categories')->get();
});

// --- 4. NHÓM ĐƠN HÀNG (ORDERS) ---
Route::get('/get-orders', function () {
    // Đã fix lỗi thiếu cột created_at và status mà bạn gặp ở SQL
    return DB::table('orders')
        ->leftJoin('users', 'orders.user_id', '=', 'users.user_id')
        ->select('orders.*', 'users.name as customer_name')
        ->orderBy('orders.order_id', 'desc')
        ->get();
});

// --- 5. THỐNG KÊ (DASHBOARD) ---
Route::get('/get-stats', function () {
    // Trả về số liệu để đổ vào các thẻ màu trên Dashboard
    return response()->json([
        'total_products' => DB::table('products')->count(),
        'total_categories' => DB::table('categories')->count(),
        'total_orders' => DB::table('orders')->count(),
        'total_users' => DB::table('users')->count(),
    ]);
});
// --- QUẢN LÝ ĐƠN HÀNG NÂNG CAO ---

// 1. Cập nhật trạng thái đơn hàng (Dùng POST hoặc PUT)
Route::post('/update-order-status', function (Request $request) {
    try {
        DB::table('orders')
            ->where('order_id', $request->order_id)
            ->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
});

// 2. Lấy chi tiết món đồ trong đơn hàng
Route::get('/get-order-details/{id}', function ($id) {
    $items = DB::table('order_items')
        ->where('order_id', $id)
        ->get();
    return response()->json($items);
});