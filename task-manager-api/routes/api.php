<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\User\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =============================
// USER AUTH
// =============================
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// =============================
// USER API
// =============================
Route::prefix('user')->group(function () {

    // danh sách sản phẩm cho user
    Route::get('products', [ProductController::class, 'index']);

});


// =============================
// ADMIN DASHBOARD API
// =============================
Route::get('/admin/dashboard', function () {

    $total_products = DB::table('sanpham')->count();
    $total_categories = DB::table('loaisp')->count();
    $total_orders = DB::table('donhang')->count();
    $total_users = DB::table('user')->count();

    return response()->json([
        'total_products' => $total_products,
        'total_categories' => $total_categories,
        'total_orders' => $total_orders,
        'total_users' => $total_users
    ]);
});


// =============================
// ADMIN PRODUCT API
// =============================


/*
|--------------------------------------------------------------------------
| LẤY DANH SÁCH SẢN PHẨM
|--------------------------------------------------------------------------
*/
Route::get('/admin/products', function () {

    $products = DB::table('sanpham')
        ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
        ->select(
            'sanpham.IdSP as id',
            'sanpham.TenSP as name',
            'sanpham.MoTa as description',
            'chitietsanpham.Gia as price',
            'sanpham.NgayTao as created_at'
        )
        ->orderBy('sanpham.IdSP', 'desc')
        ->get();

    return response()->json($products);
});


/*
|--------------------------------------------------------------------------
| THÊM SẢN PHẨM
|--------------------------------------------------------------------------
*/
Route::post('/admin/products', function (Request $request) {

    try {

        DB::beginTransaction();

        // tạo chi tiết sản phẩm
        $detailId = DB::table('chitietsanpham')->insertGetId([
            'Gia' => $request->price,
            'IdSize' => 1
        ]);

        // tạo sản phẩm
        $productId = DB::table('sanpham')->insertGetId([
            'TenSP' => $request->name,
            'MoTa' => $request->description ?? 'Chưa có mô tả',
            'NgayTao' => now(),
            'IdLoai' => 1,
            'IdCT' => $detailId,
            'IdAnh' => 1
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'id' => $productId
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});


/*
|--------------------------------------------------------------------------
| CẬP NHẬT SẢN PHẨM
|--------------------------------------------------------------------------
*/
Route::put('/admin/products/{id}', function (Request $request, $id) {

    $product = DB::table('sanpham')
        ->where('IdSP', $id)
        ->first();

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ], 404);
    }

    // cập nhật sản phẩm
    DB::table('sanpham')
        ->where('IdSP', $id)
        ->update([
            'TenSP' => $request->name,
            'MoTa' => $request->description ?? 'Chưa có mô tả'
        ]);

    // cập nhật giá
    DB::table('chitietsanpham')
        ->where('IdCT', $product->IdCT)
        ->update([
            'Gia' => $request->price
        ]);

    return response()->json([
        'success' => true
    ]);
});


/*
|--------------------------------------------------------------------------
| XÓA SẢN PHẨM
|--------------------------------------------------------------------------
*/
Route::delete('/admin/products/{id}', function ($id) {

    $product = DB::table('sanpham')
        ->where('IdSP', $id)
        ->first();

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ], 404);
    }

    DB::beginTransaction();

    try {

        // xóa chi tiết sản phẩm
        DB::table('chitietsanpham')
            ->where('IdCT', $product->IdCT)
            ->delete();

        // xóa sản phẩm
        DB::table('sanpham')
            ->where('IdSP', $id)
            ->delete();

        DB::commit();

        return response()->json([
            'success' => true
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});