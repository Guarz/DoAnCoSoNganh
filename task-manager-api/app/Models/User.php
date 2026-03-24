<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    public $timestamps = false;
    protected $fillable = [
        'Ten',
        'Email',
        'Password',
    ];
    protected $hidden = [
        'Password',
        'remember_token',
    ];
    protected $table = 'User';
    protected $primaryKey = 'IdUser';
    public function GioHang()
    {
        return $this->hasOne(GioHang::class, 'IdGH', 'IdGH');
    }
    public function DonHang()
    {
        return $this->hasMany(DonHang::class, 'IdDH', 'IdDH');
    }
}
