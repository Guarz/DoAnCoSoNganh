<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietGioHang extends Model
{
    protected $table = 'ChiTietGioHang';
    protected $fillable = ['IdGH', 'IdSP', 'SoLuong'];
    public function GioHang()
    {
        return $this->belongsTo(GioHang::class, 'IdGH', 'IdGH');
    }
    public function SanPham()
    {
        return $this->belongsTo(SanPham::class, 'IdSP', 'IdSP');
    }
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;
}
