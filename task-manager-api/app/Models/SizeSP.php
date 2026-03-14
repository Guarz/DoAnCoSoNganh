<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SizeSP extends Model
{
    protected $table = 'AnhSP';
    protected $primaryKey = 'IdSize';
    public function ChiTietSP()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->hasOne(ChiTietSanPham::class, 'IdSize', 'IdSize');
    }
}
