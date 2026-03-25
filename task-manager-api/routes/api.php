<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SHOP QUẦN ÁO
|--------------------------------------------------------------------------
*/

// =============================
// 🔑 AUTHENTICATION
// =============================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);

// =============================
// 👤 USER API (Khách hàng)
// =============================
Route::prefix('user')->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
});

// =============================
// 📊 ADMIN DASHBOARD (Thống kê)
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
// 🔥 QUẢN LÝ DANH MỤC (CATEGORY)
// =============================
Route::prefix('admin/categories')->group(function () {
    Route::get('/', function () {
        return response()->json(DB::table('loaisp')
            ->select('IdLoai as id', 'TenLoai as name')
            ->orderBy('IdLoai', 'desc')
            ->get());
    });

    Route::post('/', function (Request $request) {
        $name = $request->name;
        if (!$name)
            return response()->json(['success' => false, 'message' => 'Thiếu tên danh mục']);
        $id = DB::table('loaisp')->insertGetId(['TenLoai' => $name]);
        return response()->json(['success' => true, 'id' => $id]);
    });

    Route::put('/{id}', function (Request $request, $id) {
        DB::table('loaisp')->where('IdLoai', $id)->update(['TenLoai' => $request->name]);
        return response()->json(['success' => true]);
    });

    Route::delete('/{id}', function ($id) {
        DB::table('loaisp')->where('IdLoai', $id)->delete();
        return response()->json(['success' => true]);
    });
});

// =============================
// 🛒 QUẢN LÝ SẢN PHẨM (PRODUCTS)
// =============================
Route::prefix('admin/products')->group(function () {

    // 1. Lấy danh sách sản phẩm
    Route::get('/', function () {
        $products = DB::table('sanpham')
            ->join('chitietsanpham', 'sanpham.IdCT', '=', 'chitietsanpham.IdCT')
            ->leftJoin('anhsp', 'sanpham.IdAnh', '=', 'anhsp.IdAnh')
            ->leftJoin('loaisp', 'sanpham.IdLoai', '=', 'loaisp.IdLoai')
            ->select(
                'sanpham.IdSP as id',
                'sanpham.TenSP as name',
                'sanpham.MoTa as description',
                'sanpham.IdLoai as categoryId', // Thêm categoryId để React dễ xử lý edit
                'chitietsanpham.Gia as price',
                'loaisp.TenLoai as category_name',
                'anhsp.HinhAnh as image'
            )
            ->orderBy('sanpham.IdSP', 'desc')
            ->get();

        foreach ($products as $p) {
            if ($p->image)
                $p->image = base64_encode($p->image);
        }
        return response()->json($products);
    });

    // 2. Thêm sản phẩm mới
    Route::post('/', function (Request $request) {
        try {
            DB::beginTransaction();

            if (!$request->name || !$request->price) {
                return response()->json(['success' => false, 'message' => 'Thiếu tên hoặc giá']);
            }

            // Xử lý ảnh (ID mặc định = 1)
            $imageId = 1;
            if ($request->hasFile('image')) {
                $imageData = file_get_contents($request->file('image'));
                $imageId = DB::table('anhsp')->insertGetId(['HinhAnh' => $imageData]);
            }

            // Xử lý giá
            $validSizeId = DB::table('sizesp')->value('IdSize') ?? 1;
            $detailId = DB::table('chitietsanpham')->insertGetId([
                'Gia' => $request->price,
                'IdSize' => $validSizeId
            ]);

            $categoryId = $request->categoryId ?? (DB::table('loaisp')->value('IdLoai') ?? 1);

            $productId = DB::table('sanpham')->insertGetId([
                'TenSP' => $request->name,
                'MoTa' => $request->description ?? '',
                'NgayTao' => now(),
                'IdLoai' => $categoryId,
                'IdCT' => $detailId,
                'IdAnh' => $imageId
            ]);

            DB::commit();
            return response()->json(['success' => true, 'id' => $productId]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    });

    // 3. Cập nhật sản phẩm (Logic mới bổ sung)
    Route::put('/{id}', function (Request $request, $id) {
        try {
            DB::beginTransaction();

            $product = DB::table('sanpham')->where('IdSP', $id)->first();
            if (!$product)
                return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại']);

            // Cập nhật giá ở bảng chi tiết
            DB::table('chitietsanpham')
                ->where('IdCT', $product->IdCT)
                ->update(['Gia' => $request->price]);

            // Cập nhật ảnh nếu có file mới
            $imageId = $product->IdAnh;
            if ($request->hasFile('image')) {
                $imageData = file_get_contents($request->file('image'));
                $imageId = DB::table('anhsp')->insertGetId(['HinhAnh' => $imageData]);
            }

            // Cập nhật thông tin chính
            DB::table('sanpham')->where('IdSP', $id)->update([
                'TenSP' => $request->name,
                'MoTa' => $request->description ?? '',
                'IdLoai' => $request->categoryId,
                'IdAnh' => $imageId,
                'NgayTao' => now()
            ]);

            DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    });

    // 4. Xóa sản phẩm
    Route::delete('/{id}', function ($id) {
        try {
            $product = DB::table('sanpham')->where('IdSP', $id)->first();
            if ($product) {
                DB::table('sanpham')->where('IdSP', $id)->delete();
                return response()->json(['success' => true]);
            }
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    });
});