<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Shop Quần Áo</title>

    <style>
        body {
            font-family: Arial;
            background: #f5dede;
            margin: 0;
            padding: 0;
        }

        header {
            background: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
        }

        .product {
            border: 1px solid #ccc;
            background: white;
            padding: 15px;
            width: 220px;
            text-align: center;
            border-radius: 10px;
        }

        .product img {
            width: 150px;
            height: 150px;
            object-fit: cover;
        }

        .price {
            color: red;
            font-weight: bold;
        }

        .btn {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 15px;
            background: pink;
            text-decoration: none;
            border-radius: 5px;
            color: black;
        }

        .form-box {
            border: 1px solid black;
            padding: 20px;
            width: 300px;
            margin: 20px;
            background: white;
        }

        .empty {
            padding: 20px;
            font-size: 18px;
        }
    </style>

</head>

<body>

    <header>
        <h2>SHOP QUẦN ÁO A</h2>
    </header>

    {{-- LOGIN / REGISTER --}}

    @auth

        <p style="padding:20px;">Bạn đã đăng nhập thành công</p>

    @else

        <div class="form-box">

            <h2>Form đăng ký</h2>

            <form action="/register" method="POST">

                @csrf

                <input name="name" type="text" placeholder="Name"><br><br>

                <input name="email" type="text" placeholder="Email"><br><br>

                <input name="password" type="password" placeholder="Password"><br><br>

                <button>Đăng ký</button>

            </form>

        </div>

    @endauth

    <h2 style="padding-left:20px;">SẢN PHẨM MỚI NHẤT</h2>

    <div class="container">

        @if(isset($sanphams) && $sanphams->count() > 0)

            @foreach($sanphams as $sp)

                <div class="product">

                    {{-- ẢNH SẢN PHẨM --}}
                    @if($sp->AnhSP && $sp->AnhSP->HinhAnh)

                        <img src="data:image/jpeg;base64,{{ base64_encode($sp->AnhSP->HinhAnh) }}">

                    @else

                        <img src="https://via.placeholder.com/150">

                    @endif

                    <h3>{{ $sp->TenSP }}</h3>

                    {{-- LOẠI SẢN PHẨM --}}

                    <p>
                        Loại:
                        {{ optional($sp->LoaiSP)->TenLoai ?? 'Chưa có loại' }}
                    </p>

                    {{-- MÔ TẢ --}}

                    <p>
                        {{ $sp->MoTa ?? 'Chưa có mô tả' }}
                    </p>

                    {{-- GIÁ --}}
                    @if($sp->ChiTietSanPham)

                        <p class="price">
                            Giá: {{ number_format($sp->ChiTietSanPham->Gia) }} VNĐ
                        </p>

                    @else

                        <p class="price">Chưa có giá</p>

                    @endif

                    <a href="/sanpham/{{ $sp->IdSP }}" class="btn">
                        Xem chi tiết
                    </a>

                </div>

            @endforeach

        @else

            <p class="empty">Chưa có sản phẩm</p>

        @endif

    </div>

</body>

</html>