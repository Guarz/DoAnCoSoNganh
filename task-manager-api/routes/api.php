<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\Api\User\CartController;
use App\Http\Controllers\Api\User\OrderController;

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductAdminController;
use App\Http\Controllers\Api\Admin\OrderAdminController;
use App\Http\Controllers\Api\Admin\UserController;


/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin-login', [AuthController::class, 'adminLogin']);
Route::post('/register', [AuthController::class, 'register']);
Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::get('/top-products', [DashboardController::class, 'topProducts']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/revenue-chart', [DashboardController::class, 'revenueChart']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Products
    Route::get('/products', [ProductAdminController::class, 'index']);
    Route::post('/products', [ProductAdminController::class, 'store']);
    Route::delete('/products/{id}', [ProductAdminController::class, 'destroy']);
    Route::put('/products/{id}', [ProductAdminController::class, 'update']);

    // Orders
    Route::get('/orders', [OrderAdminController::class, 'index']);
    Route::get('/orders/{id}', [OrderAdminController::class, 'show']);
    Route::put('/orders/{id}/status', [OrderAdminController::class, 'updateStatus']);
    Route::delete('/orders/{id}', [OrderAdminController::class, 'destroy']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
// USER ROUTES Đm thằng nào Admin mà làm chỗ này t đánh chết >:( 

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::post('/cart/update', [CartController::class, 'updateQty']);
Route::post('/cart/remove', [CartController::class, 'removeItem']);
Route::post('/cart/removeselected', [CartController::class, 'removeselected']);
Route::get('/cart/{idUser}', [CartController::class, 'getCartByUserId']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/user/{id}', [OrderController::class, 'getUserOrders']);
