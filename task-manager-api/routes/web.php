<?php

use App\Http\Controllers\TestController;
use App\Http\Controllers\SanPhamController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// =============================
// TRANG DANH SÁCH SẢN PHẨM
// =============================
Route::get('/', [SanPhamController::class, 'index']);


// =============================
// TRANG CHI TIẾT SẢN PHẨM
// =============================
Route::get('/sanpham/{id}', [SanPhamController::class, 'detail']);


// =============================
// ĐĂNG KÝ USER
// =============================
Route::post('/register', [TestController::class, 'register']);
