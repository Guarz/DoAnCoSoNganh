<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Thêm dòng này: Cho phép React ghi dữ liệu vào 2 cột này
    protected $fillable = ['title', 'is_completed'];
}