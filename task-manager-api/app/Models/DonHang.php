<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    protected $table = 'DonHang';
    protected $primaryKey = 'IdDH';

    public $timestamps = false;

    // App\Models\DonHang.php
    protected $fillable = ['IdUser', 'DiaChiDat', 'IdTT', 'NgayDat'];

    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
    public function trangThai()
    {
        return $this->belongsTo(TrangThai::class, 'IdTT', 'IdTT');
    }
    public function chiTiet()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdDH', 'IdDH');
    }
}
