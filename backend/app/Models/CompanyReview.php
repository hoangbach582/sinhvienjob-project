<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CompanyReview extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'employer_id',
        'student_id',
        'rating',
        'review',
    ];

    public function employer()
    {
        return $this->belongsTo(Employer::class, 'employer_id');
    }

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }
}
