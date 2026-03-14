<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietSanPham extends Model
{
    protected $table = 'ChiTietSanPham';
    protected $primaryKey = 'IdCT';
    public function SizeSP()
    {
        // Một sản phẩm có 1 size, SizeSP đang là khóa phụ trong bảng ChiTietSanPham nên dùng belongsTo
        return $this->belongsTo(SizeSP::class, 'IdSize', 'IdSize');
    }
    public function SanPham()
    {
        // Bản này nối với bảng SanPham qua khóa chính IdCT
        // 1 sản phẩm có 1 chi tiết nên dùng hasOne
        return $this->hasOne(SanPham::class, 'IdCT', 'IdCT');
    }
}
