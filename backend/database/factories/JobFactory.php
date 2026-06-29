<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employer_id' => \App\Models\Employer::factory(),
            'title' => $this->faker->jobTitle(),
            'type' => $this->faker->randomElement(['full_time', 'part_time', 'internship', 'remote']),
            'vacancies' => $this->faker->numberBetween(1, 10),
            'industry' => $this->faker->word(),
            'location' => $this->faker->city(),
            'experience' => $this->faker->randomElement(['Không yêu cầu', 'Dưới 1 năm', '1-2 năm']),
            'salary_min' => $this->faker->numberBetween(1000000, 3000000),
            'salary_max' => $this->faker->numberBetween(3000000, 9000000),
            'description' => $this->faker->paragraph(),
            'requirements' => $this->faker->paragraph(),
            'benefits' => $this->faker->paragraph(),
            'deadline' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => 'approved',
        ];
    }
}
