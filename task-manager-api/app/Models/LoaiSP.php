<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoaiSP extends Model
{
    protected $table = 'LoaiSP'; // Tên bảng trong DB
    protected $primaryKey = 'IdLoai'; // Khóa chính
    public function SanPham()
    {
        // Một loại có nhiều sản phẩm, liên kết qua IdLoai
        return $this->hasMany(SanPham::class, 'IdLoai', 'IdLoai');
    }
}
