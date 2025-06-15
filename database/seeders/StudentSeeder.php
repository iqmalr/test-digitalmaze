<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 35; $i++) {
            DB::table('m_students')->insert([
                'id' => Str::uuid(),
                'nisn' => '2023' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name' => "Siswa $i",
                'address' => "Alamat Siswa $i",
                'date_of_birth' => Carbon::parse('2010-01-01')->addYears($i % 5),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
