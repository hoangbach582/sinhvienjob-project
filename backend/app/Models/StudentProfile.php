<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    use HasUuids;// Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    
    use HasFactory;

    // Khai báo các cột được phép thêm dữ liệu
    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'avatar',
        'bio',
        'cv_url',
        'education',
        'experience',
        'projects',
        'portfolio_url'
    ];

    protected $casts = [
        'education' => 'array',
        'experience' => 'array',
        'projects' => 'array',
    ];

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class, 'student_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'student_skills', 'student_id', 'skill_id')
                    ->withPivot('level');
    }
}
