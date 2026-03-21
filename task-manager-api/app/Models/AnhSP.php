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

    // Một ảnh có thể thuộc nhiều sản phẩm
    public function sanpham()
    {
        return $this->hasMany(SanPham::class, 'IdAnh', 'IdAnh');
    }
}
