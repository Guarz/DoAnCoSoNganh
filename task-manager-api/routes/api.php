<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

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
        ->select('IdLoai as id', 'TenLoai as name')
        ->orderBy('IdLoai', 'desc')
        ->get();
    return response()->json($categories);
});

// THÊM DANH MỤC
Route::post('/admin/categories', function (Request $request) {
    try {
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;

        if (!$name) {
            return response()->json(['success' => false, 'message' => 'Thiếu tên danh mục']);
        }

        $id = DB::table('loaisp')->insertGetId(['TenLoai' => $name]);
        return response()->json(['success' => true, 'id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
});

// CẬP NHẬT DANH MỤC
Route::put('/admin/categories/{id}', function (Request $request, $id) {
    try {
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;
        if (!$name)
            return response()->json(['success' => false, 'message' => 'Thiếu tên']);

        DB::table('loaisp')->where('IdLoai', $id)->update(['TenLoai' => $name]);
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
});

// XÓA DANH MỤC
Route::delete('/admin/categories/{id}', function ($id) {
    DB::table('loaisp')->where('IdLoai', $id)->delete();
    return response()->json(['success' => true]);
});

// =============================
// 🛒 SẢN PHẨM (PRODUCTS)
// =============================

// LẤY DANH SÁCH SẢN PHẨM
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
// LẤY CHI TIẾT 1 SẢN PHẨM
Route::get('/admin/products/{id}', function ($id) {
    $product = DB::table('sanpham')
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
        ->where('sanpham.IdSP', $id)
        ->first();

    if ($product) {
        if ($product->image) {
            $product->image = base64_encode($product->image);
        }
        return response()->json($product);
    }

    return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
});
// THÊM SẢN PHẨM MỚI
Route::post('/admin/products', function (Request $request) {
    try {
        DB::beginTransaction();

        // 1. Kiểm tra đầu vào
        if (!$request->name || !$request->price) {
            return response()->json(['success' => false, 'message' => 'Thiếu tên hoặc giá']);
        }
<<<<<<< HEAD

        // 2. Xử lý ảnh (Database yêu cầu IdAnh NOT NULL)
        $imageId = 1; // Mặc định ID 1 nếu không có ảnh
=======
        $imageId = null;
>>>>>>> dd6d5d80ca8d9332428e88b1f965c4b150759ba7
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageData = file_get_contents($file);
            $imageId = DB::table('anhsp')->insertGetId(['HinhAnh' => $imageData]);
        }

        // 3. Kiểm tra IdSize hợp lệ (Tránh lỗi Integrity constraint)
        $validSizeId = DB::table('sizesp')->value('IdSize') ?? 1;

        // 4. Tạo chi tiết sản phẩm
        $detailId = DB::table('chitietsanpham')->insertGetId([
            'Gia' => $request->price,
            'IdSize' => $validSizeId
        ]);

        // 5. Kiểm tra IdLoai hợp lệ (Lấy ID đầu tiên từ danh sách bạn mới thêm)
        $validCategoryId = DB::table('loaisp')->value('IdLoai') ?? 1;

        // 6. Lưu vào bảng sanpham
        $productId = DB::table('sanpham')->insertGetId([
            'TenSP' => $request->name,
            'MoTa' => $request->shortDesc ?? '',
            'NgayTao' => now(),
            'IdLoai' => $validCategoryId,
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
// CẬP NHẬT SẢN PHẨM (UPDATE)
Route::put('/admin/products/{id}', function (Request $request, $id) {
    try {
        DB::beginTransaction();

        // 1. Tìm sản phẩm hiện tại để lấy ID chi tiết và ID ảnh
        $product = DB::table('sanpham')->where('IdSP', $id)->first();
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Sản phẩm không tồn tại']);
        }

        // 2. Cập nhật giá trong bảng chitietsanpham
        DB::table('chitietsanpham')
            ->where('IdCT', $product->IdCT)
            ->update(['Gia' => $request->price]);

        // 3. Xử lý ảnh mới (nếu có)
        $imageId = $product->IdAnh;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageData = file_get_contents($file);

            // Cập nhật lại hình ảnh trong bảng anhsp
            DB::table('anhsp')
                ->where('IdAnh', $product->IdAnh)
                ->update(['HinhAnh' => $imageData]);
        }

        // 4. Cập nhật thông tin chính trong bảng sanpham
        DB::table('sanpham')
            ->where('IdSP', $id)
            ->update([
                'TenSP' => $request->name,
                'MoTa' => $request->shortDesc ?? '',
                // Tự tìm IdLoai đầu tiên nếu bạn chưa làm dropdown chọn loại
                'IdLoai' => DB::table('loaisp')->value('IdLoai') ?? $product->IdLoai
            ]);

        DB::commit();
        return response()->json(['success' => true]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);
