<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employer extends Model
{
    use HasUuids;// Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'logo_url',
        'website',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Một nhà tuyển dụng có thể đăng nhiều tin tuyển dụng
    public function jobs()
    {
        return $this->hasMany(\App\Models\Job::class, 'employer_id');
    }
}
