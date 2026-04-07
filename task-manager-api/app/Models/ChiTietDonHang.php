<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietDonHang extends Model
{
    protected $table = 'ChiTietDonHang';
    protected $fillable = [
        'IdDH', 
        'IdSP', 
        'SoLuong', 
        'TongTien'
    ];
    public function DonHang()
    {
        return $this->belongsTo(DonHang::class, 'IdDH', 'IdDH');
    }
    public function SanPham()
    {
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
}