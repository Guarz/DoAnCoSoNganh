<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * 1. Tắt timestamps vì bảng users của bạn không có created_at/updated_at
     */
    public $timestamps = false;

    /**
     * 2. Nếu bảng users của bạn KHÔNG CÓ cột tên là 'id', 
     * bạn phải bỏ dấu // ở dòng dưới và điền đúng tên cột khóa chính vào.
     * (Ví dụ nếu cột đó tên là user_id)
     */
    // protected $primaryKey = 'user_id'; 

    /**
     * 3. Các cột cho phép nhập dữ liệu
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * 4. Ẩn mật khẩu khi xuất API
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
}