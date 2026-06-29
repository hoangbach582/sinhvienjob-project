<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\StudentProfile;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_apply_for_job()
    {
        $user = User::factory()->create(['role' => 'student']);
        StudentProfile::factory()->create(['user_id' => $user->id, 'cv_url' => 'http://example.com/cv.pdf']);
        
        $job = Job::factory()->create(['status' => 'approved']);

        $response = $this->actingAs($user)->postJson("/api/jobs/{$job->id}/apply", [
            'cover_letter' => 'I am very interested in this position.',
            'use_profile_cv' => true
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('applications', [
            'job_id' => $job->id,
            'student_id' => $user->studentProfile->id,
            'status' => 'pending'
        ]);
    }

    public function test_student_cannot_apply_twice()
    {
        $user = User::factory()->create(['role' => 'student']);
        $profile = StudentProfile::factory()->create(['user_id' => $user->id, 'cv_url' => 'http://example.com/cv.pdf']);
        
        $job = Job::factory()->create(['status' => 'approved']);

        \App\Models\Application::factory()->create([
            'job_id' => $job->id,
            'student_id' => $profile->id
        ]);

        $response = $this->actingAs($user)->postJson("/api/jobs/{$job->id}/apply", [
            'cover_letter' => 'Trying to apply again.',
            'use_profile_cv' => true
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'Bạn đã nộp CV cho công việc này rồi!'
                 ]);
    }
}
