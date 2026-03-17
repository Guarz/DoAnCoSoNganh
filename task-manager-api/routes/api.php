<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\Api\CartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


/*
|--------------------------------------------------------------------------
| USER API
|--------------------------------------------------------------------------
*/

Route::prefix('user')->group(function () {

    // lấy danh sách sản phẩm cho user
    Route::get('products', [ProductController::class, 'index']);

});


/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD API
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| CART API
|--------------------------------------------------------------------------
*/

Route::get('/cart/{idUser}', [CartController::class, 'getCart']);
Route::post('/cart/update', [CartController::class, 'updateQty']);
Route::post('/cart/remove', [CartController::class, 'removeItem']);