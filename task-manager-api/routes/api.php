<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// 1. Nhớ thêm dòng import Controller này vào đầu file
use App\Http\Controllers\Api\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Giữ lại cái này cũng được hoặc xóa đi nếu không dùng
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 2. Thêm 2 dòng quan trọng này để React có thể gọi
Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);