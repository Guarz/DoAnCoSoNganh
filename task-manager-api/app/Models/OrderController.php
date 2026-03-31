public function index()
{
    $orders = DonHang::with(['user', 'trangThai', 'chiTiet'])->get();

    $result = $orders->map(function ($order) {

        return [
            "id" => $order->IdDH,
            "customer" => $order->user->name ?? "Không rõ",
            "status" => $order->trangThai->TenTT ?? "Chờ xử lý",
            "total" => $order->TongTien,

            // 🔥 CHI TIẾT SẢN PHẨM
            "items" => $order->chiTiet->map(function ($item) {
                return [
                    "name" => $item->TenSP ?? "Sản phẩm",
                    "quantity" => $item->SoLuong,
                    "price" => $item->Gia
                ];
            })
        ];
    });

    return response()->json($result);
}