<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'Role';
    protected $primaryKey = 'IdRole';
    public function User()
    {
        // Một sản phẩm có nhiều chi tiết 
        return $this->hasOne(User::class, 'IdRole', 'IdRole');
    }
}
