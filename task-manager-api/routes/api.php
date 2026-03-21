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
// LẤY DANH SÁCH SẢN PHẨM
// =============================
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
// CHI TIẾT SẢN PHẨM
// =============================
Route::get('/admin/products/{id}', function ($id) {

    $product = DB::table('sanpham')
        ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
        ->leftJoin('anhsp', 'sanpham.IdAnh', '=', 'anhsp.IdAnh')
        ->select(
            'sanpham.IdSP as id',
            'sanpham.TenSP as name',
            'sanpham.MoTa as description',
            'chitietsanpham.Gia as price',
            'anhsp.HinhAnh as image'
        )
        ->where('sanpham.IdSP', $id)
        ->first();

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy sản phẩm'
        ]);
    }

    if ($product->image) {
        $product->image = base64_encode($product->image);
    }

    return response()->json($product);

});


// =============================
// THÊM SẢN PHẨM
// =============================
Route::post('/admin/products', function (Request $request) {

    try {

        DB::beginTransaction();

        if (!$request->name || !$request->price) {

            return response()->json([
                'success' => false,
                'message' => 'Thiếu name hoặc price'
            ]);

        }

        // LƯU ẢNH
        $imageId = null;

        if ($request->hasFile('image')) {

            $file = $request->file('image');
            $imageData = file_get_contents($file);

            $imageId = DB::table('anhsp')->insertGetId([
                'HinhAnh' => $imageData
            ]);

        }

        // TẠO CHI TIẾT SẢN PHẨM
        $detailId = DB::table('chitietsanpham')->insertGetId([
            'Gia' => $request->price,
            'IdSize' => 1
        ]);

        // TẠO SẢN PHẨM
        $productId = DB::table('sanpham')->insertGetId([
            'TenSP' => $request->name,
            'MoTa' => $request->shortDesc ?? 'Chưa có mô tả',
            'NgayTao' => now(),
            'IdLoai' => 1,
            'IdCT' => $detailId,
            'IdAnh' => $imageId
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Thêm sản phẩm thành công',
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


// =============================
// CẬP NHẬT SẢN PHẨM
// =============================
Route::put('/admin/products/{id}', function (Request $request, $id) {

    try {

        $product = DB::table('sanpham')
            ->where('IdSP', $id)
            ->first();

        if (!$product) {

            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ]);

        }

        DB::beginTransaction();

        DB::table('sanpham')
            ->where('IdSP', $id)
            ->update([
                'TenSP' => $request->name,
                'MoTa' => $request->description ?? 'Chưa có mô tả'
            ]);

        DB::table('chitietsanpham')
            ->where('IdCT', $product->IdCT)
            ->update([
                'Gia' => $request->price
            ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);

    }

});


// =============================
// XÓA SẢN PHẨM
// =============================
Route::delete('/admin/products/{id}', function ($id) {

    try {

        $product = DB::table('sanpham')
            ->where('IdSP', $id)
            ->first();

        if (!$product) {

            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ]);

        }

        DB::beginTransaction();

        DB::table('chitietsanpham')
            ->where('IdCT', $product->IdCT)
            ->delete();

        DB::table('sanpham')
            ->where('IdSP', $id)
            ->delete();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);

    }

});