<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    protected $table = 'DonHang';
    protected $primaryKey = 'IdDH';

    // 🔥 QUAN TRỌNG (Laravel cần)
    public $timestamps = false;

    protected $fillable = [
        'IdUser',
        'IdTT',
        'TongTien'
    ];

    /*
    =========================
    RELATIONSHIPS
    =========================
    */

    // 1 đơn thuộc về 1 user
    public function user()
    {
        return $this->belongsTo(User::class, 'IdUser', 'IdUser');
    }

    // 1 đơn có 1 trạng thái
    public function trangThai()
    {
        return $this->belongsTo(TrangThai::class, 'IdTT', 'IdTT');
    }

    // 1 đơn có nhiều sản phẩm
    public function chiTiet()
    {
        return $this->hasMany(ChiTietDonHang::class, 'IdDH', 'IdDH');
    }
}