<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employer>
 */
class EmployerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'company_name' => $this->faker->company(),
            'employee_count' => $this->faker->randomElement(['1-50', '51-200', '201-500', '500+']),
            'website' => $this->faker->url(),
            'address' => $this->faker->address(),
            'about' => $this->faker->paragraph(),
            'logo_url' => null,
        ];
    }
}
