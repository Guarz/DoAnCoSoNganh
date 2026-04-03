<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    protected $table = 'DonHang';
    protected $primaryKey = 'IdDH';

    public $timestamps = false;

    protected $fillable = [
        'IdUser',
        'IdTT',
        'TongTien'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }
    public function trangThai()
    {
        return $this->hasOne(TrangThai::class, 'IdTT', 'IdTT');
    }
    public function chiTiet()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdDH', 'IdDH');
    }

}
