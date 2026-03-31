<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| 1. AUTHENTICATION (ĐĂNG NHẬP & ĐĂNG KÝ)
|--------------------------------------------------------------------------
*/

// Đăng nhập cho Khách hàng (Bảng user)
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

// Đăng nhập cho Quản trị viên (Bảng admin)
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
| 2. ADMIN DASHBOARD & MANAGEMENT
|--------------------------------------------------------------------------
*/

// Thống kê Dashboard
Route::get('/admin/dashboard', function () {
    return response()->json([
        "totalProducts" => DB::table("sanpham")->count(),
        "totalCategories" => DB::table("loaisp")->count(),
        "totalOrders" => DB::table("donhang")->count(),
        "totalUsers" => DB::table("user")->count()
    ]);
});

// Quản lý Danh mục
Route::prefix('admin/categories')->group(function () {
    Route::get('/', function () {
        return DB::table("loaisp")
            ->select("IdLoai as id", "TenLoai as name")
            ->orderBy("IdLoai", "desc")
            ->get();
    });

    Route::post('/', function (Request $request) {
        $id = DB::table("loaisp")->insertGetId(["TenLoai" => $request->name]);
        return response()->json(["success" => true, "id" => $id]);
    });

    Route::put('/{id}', function (Request $request, $id) {
        DB::table("loaisp")->where("IdLoai", $id)->update(["TenLoai" => $request->name]);
        return response()->json(["success" => true]);
    });

    Route::delete('/{id}', function ($id) {
        DB::table("loaisp")->where("IdLoai", $id)->delete();
        return response()->json(["success" => true]);
    });
});

// Quản lý Sản phẩm
Route::prefix('admin/products')->group(function () {
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

    Route::post('/', function (Request $request) {
        try {
            DB::beginTransaction();
            $imageId = null;
            if ($request->hasFile("image")) {
                $imageData = file_get_contents($request->file("image"));
                $imageId = DB::table("anhsp")->insertGetId(["HinhAnh" => $imageData]);
            }

            $detailId = DB::table("chitietsanpham")->insertGetId([
                "Gia" => $request->price,
                "IdSize" => DB::table("sizesp")->value("IdSize") ?? 1
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
            return response()->json(["success" => true, "id" => $productId]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["success" => false, "error" => $e->getMessage()]);
        }
    });

    Route::delete('/{id}', function ($id) {
        DB::table("sanpham")->where("IdSP", $id)->delete();
        return response()->json(["success" => true]);
    });
});

<<<<<<< HEAD
// Quản lý Đơn hàng
Route::prefix('admin/orders')->group(function () {
=======

/*
|--------------------------------------------------------------------------
| ADMIN ORDERS (FULL CHUẨN)
|--------------------------------------------------------------------------
*/

Route::prefix('admin/orders')->group(function () {

    /*
    🧾 LẤY DANH SÁCH ĐƠN HÀNG
    */
>>>>>>> f6be6630efb1f4d73cc14d36f9610585c2ba86c3
    Route::get('/', function () {
        return DB::table("donhang")
            ->join("user", "donhang.IdUser", "=", "user.IdUser")
<<<<<<< HEAD
            ->select(
                "donhang.IdDonHang as id",
                "user.Ten as customer",
                "donhang.TongTien as total",
                "donhang.TrangThai as status",
                "donhang.NgayDat as date"
=======

            ->leftJoin("chitietdonhang", "donhang.IdDonHang", "=", "chitietdonhang.IdDonHang")

            ->leftJoin("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")

            ->select(
                "donhang.IdDonHang as id",
                "user.Ten as customer",
                DB::raw("GROUP_CONCAT(sanpham.TenSP SEPARATOR ', ') as products"),
                "donhang.TongTien as total",
                "donhang.TrangThai as status",
                "donhang.NgayTao as created_at"
            )

            ->groupBy(
                "donhang.IdDonHang",
                "user.Ten",
                "donhang.TongTien",
                "donhang.TrangThai",
                "donhang.NgayTao"
>>>>>>> f6be6630efb1f4d73cc14d36f9610585c2ba86c3
            )
            ->orderBy("donhang.IdDonHang", "desc")
            ->get();
    });

<<<<<<< HEAD
=======

    /*
    🔍 CHI TIẾT 1 ĐƠN HÀNG
    */
    Route::get('/{id}', function ($id) {

        $order = DB::table("donhang")
            ->join("user", "donhang.IdUser", "=", "user.IdUser")
            ->where("donhang.IdDonHang", $id)
            ->select(
                "donhang.IdDonHang as id",
                "user.Ten as customer",
                "user.Email as email",
                "user.DienThoai as phone",
                "donhang.TongTien as total",
                "donhang.TrangThai as status",
                "donhang.NgayTao as created_at"
            )
            ->first();

        $items = DB::table("chitietdonhang")
            ->leftJoin("sanpham", "chitietdonhang.IdSP", "=", "sanpham.IdSP")
            ->where("chitietdonhang.IdDonHang", $id)
            ->select(
                "sanpham.TenSP as product",
                "chitietdonhang.SoLuong as quantity"
            )
            ->get();

        return response()->json([
            "order" => $order,
            "items" => $items
        ]);
    });


    /*
    ✏️ CẬP NHẬT TRẠNG THÁI
    */
>>>>>>> f6be6630efb1f4d73cc14d36f9610585c2ba86c3
    Route::put('/{id}', function (Request $request, $id) {
        DB::table("donhang")->where("IdDonHang", $id)->update(["TrangThai" => $request->status]);
        return response()->json(["success" => true]);
    });

<<<<<<< HEAD
    Route::delete('/{id}', function ($id) {
        DB::table("donhang")->where("IdDonHang", $id)->delete();
        return response()->json(["success" => true]);
=======

    /*
    ❌ XOÁ ĐƠN HÀNG
    */
    Route::delete('/{id}', function ($id) {

        DB::beginTransaction();

        try {

            DB::table("chitietdonhang")
                ->where("IdDonHang", $id)
                ->delete();

            DB::table("donhang")
                ->where("IdDonHang", $id)
                ->delete();

            DB::commit();

            return response()->json([
                "success" => true
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
>>>>>>> f6be6630efb1f4d73cc14d36f9610585c2ba86c3
    });
});
<<<<<<< HEAD

// Quản lý Người dùng
Route::prefix('admin/users')->group(function () {
    Route::get('/', function () {
        return DB::table("user")
            ->select("IdUser as id", "Ten as name", "Email as email", "DienThoai as phone", "DiaChi as address")
            ->orderBy("IdUser", "desc")
            ->get();
    });

    Route::delete('/{id}', function ($id) {
        DB::table("user")->where("IdUser", $id)->delete();
        return response()->json(["success" => true, "message" => "Xóa thành công"]);
    });
});

=======
    
>>>>>>> f6be6630efb1f4d73cc14d36f9610585c2ba86c3
/*
|--------------------------------------------------------------------------
| 3. USER & PUBLIC API (CHO APP/WEB KHÁCH HÀNG)
|--------------------------------------------------------------------------
*/

Route::prefix('user')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
});

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/user/{id}', [OrderController::class, 'getOrdersByUser']);