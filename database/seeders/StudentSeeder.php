<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 20; $i++) {
            Student::create([
                'nisn' => fake()->unique()->numerify('############'),
                'name' => fake()->name(),
                'address' => fake()->address(),
                'date_of_birth' => fake()->dateTimeBetween('1999-01-01', '2001-12-31')->format('Y-m-d'),
            ]);
        }
    }
}
