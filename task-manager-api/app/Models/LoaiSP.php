<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SanPham;

class LoaiSP extends Model
{    protected $table = 'loaisp';
    protected $primaryKey = 'IdLoai';
    protected $fillable = [
        'TenLoai'
    ];
    public function SanPham()
    {
        return $this->hasMany(SanPham::class, 'IdLoai', 'IdLoai');
    }
}