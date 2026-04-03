<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietSanPham extends Model
{
    protected $table = 'ChiTietSanPham';
    protected $primaryKey = 'IdCT';
    public function SizeSP()
    {
        return $this->belongsTo(SizeSP::class, 'IdSize', 'IdSize');
    }
    public function SanPham()
    {
        return $this->hasOne(SanPham::class, 'IdCT', 'IdCT');
    }
}
