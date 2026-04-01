<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;



Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = DB::table('user')
        ->where('Email', $request->email)
        ->first();

    if (!$user || $user->Password != $request->password) {
        return response()->json([
            "success" => false,
            "message" => "Email hoặc mật khẩu không đúng"
        ], 401);
    }

    return response()->json([
        "success" => true,
        "message" => "Đăng nhập thành công",
        "user" => [
            "id" => $user->IdUser,
            "name" => $user->Ten,
            "email" => $user->Email,
            "role" => "user"
        ]
    ]);
});


Route::post('/admin-login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $admin = DB::table('admin')
        ->where('Email', $request->email)
        ->first();

    if (!$admin || $admin->Password != $request->password) {

        return response()->json([
            "success" => false,
            "message" => "Tài khoản quản trị không chính xác"
        ], 401);
    }

    return response()->json([
        "success" => true,
        "message" => "Chào mừng Admin quay trở lại",
        "user" => [
            "id" => $admin->idAdmin,
            "name" => $admin->TenAdmin,
            "email" => $admin->Email,
            "role" => "admin"
        ]
    ]);
});


Route::post('/register', [AuthController::class, 'register']);
Route::put('/user/update/{id}', [AuthController::class, 'updateProfile']);


/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

Route::get('/admin/dashboard', function () {

    $revenue = DB::table("chitietdonhang")->sum("TongTien");

    return response()->json([
        "totalProducts" => DB::table("sanpham")->count(),
        "totalCategories" => DB::table("loaisp")->count(),
        "totalOrders" => DB::table("donhang")->count(),
        "totalUsers" => DB::table("user")->count(),
        "totalRevenue" => $revenue
    ]);

});


/*
|--------------------------------------------------------------------------
| ADMIN CATEGORY
|--------------------------------------------------------------------------
*/

Route::prefix('admin/categories')->group(function () {

    Route::get('/', function () {

        return DB::table("loaisp")
            ->select("IdLoai as id", "TenLoai as name")
            ->orderBy("IdLoai", "desc")
            ->get();
    });

    Route::post('/', function (Request $request) {

        $id = DB::table("loaisp")->insertGetId([
            "TenLoai" => $request->name
        ]);

        return response()->json([
            "success" => true,
            "id" => $id
        ]);
    });

    Route::put('/{id}', function (Request $request, $id) {

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->update([
                "TenLoai" => $request->name
            ]);

        return response()->json(["success" => true]);
    });

    Route::delete('/{id}', function ($id) {

        DB::table("loaisp")
            ->where("IdLoai", $id)
            ->delete();

        return response()->json(["success" => true]);
    });
});


/*
|--------------------------------------------------------------------------
| ADMIN PRODUCTS
|--------------------------------------------------------------------------
*/

Route::prefix('admin/products')->group(function () {

    // =========================
    // GET PRODUCTS
    // =========================
    Route::get('/', function () {

        $products = DB::table("sanpham")

            ->join("chitietsanpham", "sanpham.IdCT", "=", "chitietsanpham.IdCT")

            ->leftJoin("anhsp", "sanpham.IdAnh", "=", "anhsp.IdAnh")

            ->leftJoin("loaisp", "sanpham.IdLoai", "=", "loaisp.IdLoai")

            ->select(
                "sanpham.IdSP as id",
                "sanpham.TenSP as name",
                "sanpham.MoTa as description",
                "sanpham.IdLoai as categoryId",
                "chitietsanpham.Gia as price",
                "loaisp.TenLoai as category_name",
                "anhsp.HinhAnh as image"
            )

            ->orderBy("sanpham.IdSP", "desc")

            ->get();

        foreach ($products as $p) {
            if ($p->image) {
                $p->image = base64_encode($p->image);
            }
        }

        return response()->json($products);
    });


    // =========================
    // ADD PRODUCT
    // =========================
    Route::post('/', function (Request $request) {

        try {

            DB::beginTransaction();

            if (!$request->name || !$request->price) {
                return response()->json([
                    "success" => false,
                    "message" => "Thiếu tên hoặc giá"
                ]);
            }

            $imageId = null;

            if ($request->hasFile("image")) {

                $imageData = file_get_contents($request->file("image"));

                $imageId = DB::table("anhsp")->insertGetId([
                    "HinhAnh" => $imageData
                ]);
            }

            $sizeId = DB::table("sizesp")->value("IdSize") ?? 1;

            $detailId = DB::table("chitietsanpham")->insertGetId([
                "Gia" => $request->price,
                "IdSize" => $sizeId
            ]);

            $productId = DB::table("sanpham")->insertGetId([
                "TenSP" => $request->name,
                "MoTa" => $request->description ?? "",
                "NgayTao" => now(),
                "IdLoai" => $request->categoryId,
                "IdCT" => $detailId,
                "IdAnh" => $imageId
            ]);

            DB::commit();

            return response()->json([
                "success" => true,
                "id" => $productId
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    });


    // =========================
    // DELETE PRODUCT
    // =========================
    Route::delete('/{id}', function ($id) {

        DB::table("sanpham")
            ->where("IdSP", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    });

});

Route::prefix('admin/orders')->group(function () {

    // ==============================
    // DANH SÁCH ĐƠN HÀNG
    // ==============================
    Route::get('/', function () {

        $orders = DB::table("donhang")
            ->join("user", "donhang.IdUser", "=", "user.IdUser")
            ->leftJoin("chitietdonhang", "donhang.IdDH", "=", "chitietdonhang.IdDH")
            ->leftJoin("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

            ->select(
                "donhang.IdDH as id",
                "user.Ten as customer",
                DB::raw("GROUP_CONCAT(sanpham.TenSP SEPARATOR ', ') as products"),
                DB::raw("SUM(chitietdonhang.TongTien) as total"),
                "donhang.IdTT as status",
                "donhang.NgayDat as date"
            )

            ->groupBy(
                "donhang.IdDH",
                "user.Ten",
                "donhang.IdTT",
                "donhang.NgayDat"
            )

            ->orderBy("donhang.IdDH", "desc")

            ->get();

        return response()->json($orders);
    });

});
Route::get('/admin/orders/{id}', function ($id) {

    $items = DB::table("chitietdonhang")

        ->join("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

        ->select(
            "sanpham.TenSP as product",
            "chitietdonhang.SoLuong as qty",
            "chitietdonhang.TongTien as total"
        )

        ->where("chitietdonhang.IdDH", $id)

        ->get();

    return response()->json($items);
});
Route::put('/admin/orders/{id}/status', function (Request $request, $id) {

    DB::table("donhang")
        ->where("IdDH", $id)
        ->update([
            "IdTT" => $request->status
        ]);

    return response()->json([
        "success" => true
    ]);
});
Route::delete('/admin/orders/{id}', function ($id) {

    DB::table("donhang")
        ->where("IdDH", $id)
        ->delete();

    return response()->json([
        "success" => true
    ]);
});

/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

Route::prefix('admin/users')->group(function () {

    Route::get('/', function () {
        return DB::table("user")
            ->select(
                "IdUser as id",
                "Ten as name",
                "Email as email",
                "NgayTao as created_at"
            )
            ->orderBy("IdUser", "desc")
            ->get();
    });

    // --- THÊM ĐOẠN NÀY VÀO ---
    Route::put('/{id}', function (Request $request, $id) {
        // Kiểm tra dữ liệu gửi lên (optional nhưng nên có)
        if (!$request->name || !$request->email) {
            return response()->json(["success" => false, "message" => "Thiếu thông tin"], 400);
        }

        DB::table("user")
            ->where("IdUser", $id)
            ->update([
                "Ten" => $request->name,
                "Email" => $request->email
                // Nếu DB của bạn dùng tên cột khác thì hãy sửa lại cho đúng nhé
            ]);

        return response()->json([
            "success" => true,
            "message" => "Cập nhật thành công"
        ]);
    });
    // ------------------------

    Route::delete('/{id}', function ($id) {
        DB::table("user")
            ->where("IdUser", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    });
});
Route::get('/admin/revenue-chart', function () {

    $data = DB::table("donhang")
        ->join("chitietdonhang", "donhang.IdDH", "=", "chitietdonhang.IdDH")
        ->select(
            DB::raw("MONTH(donhang.NgayDat) as month"),
            DB::raw("SUM(chitietdonhang.TongTien) as revenue")
        )
        ->groupBy(DB::raw("MONTH(donhang.NgayDat)"))
        ->get();

    $result = [];

    for ($i = 1; $i <= 12; $i++) {

        $found = $data->firstWhere('month', $i);

        $result[] = [
            "month" => $i,
            "revenue" => $found ? $found->revenue : 0
        ];
    }

    return response()->json($result);

});
// USER ROUTES Đm thằng nào Admin mà làm chỗ này t đánh chết >:( 

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/cart/{idUser}', [CartController::class, 'getCartByUserId']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::post('/cart/update', [CartController::class, 'updateQty']);
Route::post('/cart/remove', [CartController::class, 'removeItem']);
