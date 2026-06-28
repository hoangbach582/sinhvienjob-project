<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasUuids; // Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    use HasFactory;

    protected $fillable = [
        'name',
    ];
}
