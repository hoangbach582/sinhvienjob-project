<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employer;
use App\Models\Job;

class JobTest extends TestCase
{
    use RefreshDatabase;

    public function test_employer_can_create_job()
    {
        $user = User::factory()->create(['role' => 'employer']);
        Employer::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->postJson('/api/employer/jobs', [
            'title' => 'Software Engineer',
            'type' => 'full_time',
            'vacancies' => 2,
            'industry' => 'IT',
            'location' => 'Hanoi',
            'experience' => '1-2 năm',
            'salary_min' => 5000000,
            'salary_max' => 9000000,
            'description' => 'Great job',
            'requirements' => 'Good skills',
            'benefits' => 'Insurance',
            'deadline' => '2027-12-31'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('jobs', [
            'title' => 'Software Engineer',
            'industry' => 'IT'
        ]);
    }

    public function test_public_can_view_approved_jobs()
    {
        $job = Job::factory()->create([
            'status' => 'approved',
            'title' => 'Public Job'
        ]);

        $response = $this->getJson('/api/jobs');
        
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'title' => 'Public Job'
                 ]);
    }
}
