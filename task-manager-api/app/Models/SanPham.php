<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function LoaiSP()
    {
        return $this->belongsTo(LoaiSP::class, 'IdLoai', 'IdLoai');
    }
    public function ChiTietSanPham()
    {
        return $this->belongsTo(ChiTietSanPham::class, 'IdCT', 'IdCT');
    }
    public function AnhSP()
    {
        return $this->hasMany(AnhSP::class, 'IdAnh', 'IdAnh');
    }

    public function ChiTietGioHang()
    {
        return $this->hasMany(ChiTietGioHang::class, 'IdSP', 'IdSP');
    }

    public function ChiTietDonHang()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdSP', 'IdSP');
    }
}
