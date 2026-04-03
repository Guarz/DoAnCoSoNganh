<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietGioHang extends Model
{
    protected $table = 'ChiTietGioHang';
    protected $fillable = ['IdGH', 'IdSP', 'SoLuong'];
    public function GioHang()
    {
        // Một chi tiết thuộc 1 giỏ hàng 
        return $this->belongsTo(GioHang::class, 'IdGH', 'IdGH');
    }
    public function SanPham()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
}
