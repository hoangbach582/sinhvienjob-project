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
        'industry',
        'location',
        'experience',
        'salary_min',
        'salary_max',
        'description',
        'requirements',
        'benefits',
        'deadline',
        'status',
        'rejected_reason',
        'reviewed_at',
        'reviewed_by'
    ];

    // Rất quan trọng: Báo cho Laravel biết Job này thuộc về Employer nào
    public function employer()
    {
        // Tạo mối liên kết: 1 công việc thuộc về 1 công ty
        return $this->belongsTo(Employer::class, 'employer_id');
    }

    // Một công việc có thể có nhiều đơn ứng tuyển
    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    // Người duyệt tin (Admin)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
