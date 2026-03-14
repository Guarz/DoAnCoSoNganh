<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; // Cần class này để kế thừa các tính năng của Laravel Model
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SanPham extends Model
{
    use HasFactory;
    protected $table = 'SanPham';
    protected $primaryKey = 'IdSP';
    protected $fillable = ['IdSP', 'IdLoai', 'TenSP', 'MoTa', 'NgayTao', 'IdCT', 'IdAnh'];

    public function ChiTietGioHang()
    {
        return $this->hasMany(ChiTietGioHang::class, 'IdSP', 'IdSP');
    }
    public function ChiTietDonHang()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdSP', 'IdSP');
    }
    public function ChiTietSanPham()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->belongsTo(ChiTietSanPham::class, 'IdCT', 'IdCT');
    }
    public function AnhSP()
    {
        return $this->belongsTo(AnhSP::class, 'IdAnh', 'IdAnh');
    }
    public function LoaiSP()
    {
        return $this->belongsTo(LoaiSP::class, 'IdLoai', 'IdLoai');
    }
}
