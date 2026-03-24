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

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']); 
});


// =============================
// ADMIN DASHBOARD
// =============================
Route::get('/admin/dashboard', function () {

    return response()->json([
        'total_products' => DB::table('sanpham')->count(),
        'total_categories' => DB::table('loaisp')->count(),
        'total_orders' => DB::table('donhang')->count(),
        'total_users' => DB::table('user')->count()
    ]);

});


// =============================
// 🔥 DANH MỤC (CATEGORY)
// =============================

// LẤY DANH SÁCH
Route::get('/admin/categories', function () {

    $categories = DB::table('loaisp')
        ->select(
            'IdLoai as id',
            'TenLoai as name'
        )
        ->orderBy('IdLoai', 'desc')
        ->get();

    return response()->json($categories);
});


// =============================
// ✅ FIX LỖI 500 Ở ĐÂY
// =============================
Route::post('/admin/categories', function (Request $request) {

    try {

        // 🔥 đọc JSON đúng cách
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;

        if (!$name) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu tên danh mục'
            ]);
        }

        $id = DB::table('loaisp')->insertGetId([
            'TenLoai' => $name
        ]);

        return response()->json([
            'success' => true,
            'id' => $id
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});


// CẬP NHẬT DANH MỤC
Route::put('/admin/categories/{id}', function (Request $request, $id) {

    try {

        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;

        if (!$name) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu tên'
            ]);
        }

        DB::table('loaisp')
            ->where('IdLoai', $id)
            ->update([
                'TenLoai' => $name
            ]);

        return response()->json(['success' => true]);

    } catch (\Exception $e) {

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});


// XÓA DANH MỤC
Route::delete('/admin/categories/{id}', function ($id) {

    DB::table('loaisp')->where('IdLoai', $id)->delete();

    return response()->json(['success' => true]);
});


// =============================
// SẢN PHẨM
// =============================

// LẤY DANH SÁCH
Route::get('/admin/products', function () {

    $products = DB::table('sanpham')
        ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
        ->leftJoin('anhsp', 'sanpham.IdAnh', '=', 'anhsp.IdAnh')
        ->select(
            'sanpham.IdSP as id',
            'sanpham.TenSP as name',
            'sanpham.MoTa as description',
            'chitietsanpham.Gia as price',
            'sanpham.NgayTao as created_at',
            'anhsp.HinhAnh as image'
        )
        ->orderBy('sanpham.IdSP', 'desc')
        ->get();

    foreach ($products as $p) {
        if ($p->image) {
            $p->image = base64_encode($p->image);
        }
    }

    return response()->json($products);
});


// =============================
// THÊM SẢN PHẨM
// =============================
Route::post('/admin/products', function (Request $request) {

    try {

        DB::beginTransaction();

        if (!$request->name || !$request->price) {
            return response()->json([
                'success' => false
            ]);
        }

        $imageId = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageData = file_get_contents($file);

            $imageId = DB::table('anhsp')->insertGetId([
                'HinhAnh' => $imageData
            ]);
        }

        $detailId = DB::table('chitietsanpham')->insertGetId([
            'Gia' => $request->price,
            'IdSize' => 1
        ]);

        $productId = DB::table('sanpham')->insertGetId([
            'TenSP' => $request->name,
            'MoTa' => $request->shortDesc ?? '',
            'NgayTao' => now(),
            'IdLoai' => 1,
            'IdCT' => $detailId,
            'IdAnh' => $imageId
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
        ]);
    }
});