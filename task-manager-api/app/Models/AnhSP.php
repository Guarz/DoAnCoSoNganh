<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SanPham;

class AnhSP extends Model
{
    protected $table = 'anhsp';

    protected $primaryKey = 'IdAnh';

    public $timestamps = false;

    protected $fillable = [
        'HinhAnh'
    ];

    // Một sản phẩm có thể có nhiều ảnh
    public function sanpham()
    {
        return $this->belongsTo(SanPham::class, 'IdAnh', 'IdAnh');
    }
}
