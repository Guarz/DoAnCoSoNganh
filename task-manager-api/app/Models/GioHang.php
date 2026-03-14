<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GioHang extends Model
{
    protected $table = 'GioHang';
    protected $primaryKey = 'IdGH';
    public $timestamps = false;
    public function ChiTietGioHang()
    {
        return $this->hasOne(ChiTietGioHang::class, 'IdGH', 'IdGH');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
}
