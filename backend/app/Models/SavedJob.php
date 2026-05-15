<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SavedJob extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'job_id',
    ];

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
