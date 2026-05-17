<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Vì chúng ta dùng UUID (một chuỗi ngẫu nhiên dài) cần báo cho các Model biết điều này

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasUuids;// Thêm trait này để tự động sinh UUID khi tạo mới bản ghi
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Ghi đè notification mặc định để dùng email tiếng Việt
     * và link trỏ về frontend React thay vì backend Laravel
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',           // Cực kỳ quan trọng
        'status',         // active | pending | locked | rejected
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Determine if the user has verified their email address.
     *
     * @return bool
     */
    public function hasVerifiedEmail()
    {
        return ! is_null($this->email_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     *
     * @return bool
     */
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    public function employer()
    {
        return $this->hasOne(Employer::class, 'user_id');
    }

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class, 'user_id');
    }

    // Quan hệ với bảng ứng tuyển (applications)
    public function applications()
    {
        return $this->hasMany(\App\Models\Application::class, 'student_id');
    }
}
