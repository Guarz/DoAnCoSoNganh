<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietGioHang extends Model
{
    protected $table = 'ChiTietGioHang';
    public function GioHang()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->belongsTo(GioHang::class, 'IdGH', 'IdGH');
    }
    public function SanPham()
    {
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
}
