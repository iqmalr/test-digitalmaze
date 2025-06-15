<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            DB::table('m_teachers')->insert([
                'id' => Str::uuid(),
                'name' => "Guru $i",
                'nip' => '1980' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'address' => 'Alamat Guru ' . $i,
                'date_of_birth' => Carbon::parse('1980-01-01')->addYears($i),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
