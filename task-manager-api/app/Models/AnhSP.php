<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnhSP extends Model
{
    protected $table = 'AnhSP';
    protected $primaryKey = 'IdAnh';
    public function SanPham()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->hasMany(SanPham::class, 'IdAnh', 'IdAnh');
    }
}
