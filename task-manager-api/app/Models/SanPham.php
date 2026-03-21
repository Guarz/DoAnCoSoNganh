<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// Import các model liên quan
use App\Models\LoaiSP;
use App\Models\AnhSP;
use App\Models\ChiTietSanPham;
use App\Models\ChiTietGioHang;
use App\Models\ChiTietDonHang;

class SanPham extends Model
{
    use HasFactory;

    protected $table = 'sanpham';
    protected $primaryKey = 'IdSP';

    public $timestamps = false;

    protected $fillable = [
        'IdLoai',
        'TenSP',
        'MoTa',
        'NgayTao',
        'IdCT',
        'IdAnh'
    ];

    // =============================
    // Quan hệ loại sản phẩm
    // =============================
    public function LoaiSP()
    {
        return $this->belongsTo(LoaiSP::class, 'IdLoai', 'IdLoai');
    }

    // =============================
    // Quan hệ ảnh sản phẩm
    // =============================
    public function AnhSP()
    {
        return $this->belongsTo(AnhSP::class, 'IdAnh', 'IdAnh');
    }

    // =============================
    // Quan hệ chi tiết sản phẩm (giá, size)
    // =============================
    public function ChiTietSanPham()
    {
        return $this->belongsTo(ChiTietSanPham::class, 'IdCT', 'IdCT');
    }

    // =============================
    // Quan hệ chi tiết giỏ hàng
    // =============================
    public function ChiTietGioHang()
    {
        return $this->hasMany(ChiTietGioHang::class, 'IdSP', 'IdSP');
    }

    // =============================
    // Quan hệ chi tiết đơn hàng
    // =============================
    public function ChiTietDonHang()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdSP', 'IdSP');
    }
}
