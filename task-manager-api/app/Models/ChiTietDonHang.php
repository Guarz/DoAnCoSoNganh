<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietDonHang extends Model
{
    protected $table = 'ChiTietDonHang';
    public function DonHang()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->belongsTo(DonHang::class, 'IdDH', 'IdDH');
    }
    public function SanPham()
    {
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
}
