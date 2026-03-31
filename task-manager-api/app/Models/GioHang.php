<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GioHang extends Model
{
    protected $table = 'GioHang';
    protected $primaryKey = 'IdGH';
    public $timestamps = false;
    protected $fillable = ['IdUser'];
    public function ChiTietGioHang()
    {
        return $this->hasMany(ChiTietGioHang::class, 'IdGH', 'IdGH');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
}
