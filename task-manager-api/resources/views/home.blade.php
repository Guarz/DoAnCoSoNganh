<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doc</title>
</head>

<body>

    @auth
    <p>Bạn đã đăng nhập thành công</p>
    @else
    <div style="border: 1px black solid;">
        <h1>Form test</h1>
        <form action="/register" method="POST">
            @csrf
            <input name="name" type="text" placeholder="Name">
            <input name="email" type="text" placeholder="Email">
            <input name="password" type="password" placeholder="Password">
            <button>Click</button>
        </form>
    </div>
    @endauth
</body>

</html>