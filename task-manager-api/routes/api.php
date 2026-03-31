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

    Route::delete('/{id}', function ($id) {

        DB::table("user")
            ->where("IdUser", $id)
            ->delete();

        return response()->json([
            "success" => true
        ]);
    });
});


// USER ROUTES Đm thằng nào Admin mà làm chỗ này t đánh chết >:( 

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/cart/{idUser}', [CartController::class, 'getCartByUserId']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::post('/cart/update', [CartController::class, 'updateQty']);
Route::post('/cart/remove', [CartController::class, 'removeItem']);