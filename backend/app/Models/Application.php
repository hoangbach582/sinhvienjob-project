<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Application extends Model
{
    use HasUuids, SoftDeletes;// Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults()
            ->logOnly(['status', 'reject_reason'])
            ->logOnlyDirty();
    }

    protected $fillable = [
        'job_id',
        'student_id', // Dùng đúng student_id của bạn
        'cv_url',     // Bắt buộc phải có
        'cover_letter',// thư ngỏ
        'status',
        'employer_notes',
        'reject_reason'
    ];

    // Móc nối với bảng Jobs
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }
}
