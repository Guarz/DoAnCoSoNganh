<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrangThai extends Model
{
    protected $table = 'TrangThai';
    protected $primaryKey = 'IdTT';
    public function TrangThai()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->hasOne(TrangThai::class, 'IdTT', 'IdTT');
    }
}
