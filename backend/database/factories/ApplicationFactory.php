<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_id' => \App\Models\Job::factory(),
            'student_id' => \App\Models\StudentProfile::factory(),
            'cv_url' => $this->faker->url(),
            'cover_letter' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'reviewing', 'accepted', 'rejected']),
            'employer_notes' => null,
            'reject_reason' => null,
        ];
    }
}
