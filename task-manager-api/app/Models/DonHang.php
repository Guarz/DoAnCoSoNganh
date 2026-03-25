<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    protected $table = 'DonHang';
    protected $primaryKey = 'IdDH';
    public function User()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
    public function TrangThai()
    {
        return $this->belongsTo(TrangThai::class, 'IdTT', 'IdTT');
    }
    public function chiTiet()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdDH', 'IdDH');
    }
}

