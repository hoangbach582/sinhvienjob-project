<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasUuids;// Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    
    use HasFactory;

    // Các cột được phép tương tác
    protected $fillable = [
        'employer_id',
        'title',
        'type',
        'location',
        'salary_min',
        'salary_max',
        'description',
        'requirements',
        'deadline',
        'status'
    ];

    // Rất quan trọng: Báo cho Laravel biết Job này thuộc về Employer nào
    public function employer()
    {
        // Tạo mối liên kết: 1 công việc thuộc về 1 công ty
        return $this->belongsTo(Employer::class, 'employer_id');
    }
}
