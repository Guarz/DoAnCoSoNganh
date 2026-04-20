<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\GioHang;
use App\Models\DonHang;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    protected $table = 'user';
    protected $primaryKey = 'IdUser';
    public $incrementing = true;
    protected $fillable = [
        'Ten',
        'Email',
        'Password',
        'DiaChi',
        'DienThoai',
    ];
    protected $hidden = [
        'Password',
        'remember_token',
    ];
    public function GioHang()
    {
        return $this->hasOne(GioHang::class, 'IdUser', 'IdUser');
    }
    public function DonHang()
    {
        return $this->hasMany(DonHang::class, 'IdUser', 'IdUser');
    }
}