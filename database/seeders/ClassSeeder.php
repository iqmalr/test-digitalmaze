<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = DB::table('m_teachers')->pluck('id')->toArray();
        $students = DB::table('m_students')->pluck('id')->toArray();

        $academicYears = ['2023/2024', '2024/2025'];
        $classNames = ['1', '2', '3', '4', '5', '6'];

        $teacherIndex = 0;

        foreach ($academicYears as $yearIndex => $year) {
            foreach ($classNames as $i => $className) {
                $classId = Str::uuid();
                $teacherId = $teachers[$teacherIndex++];

                DB::table('m_classes')->insert([
                    'id' => $classId,
                    'name' => 'Kelas ' . $className,
                    // 'teacher_id' => $teacherId,
                    'academic_year' => $year,
                    'semester' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                for ($j = 0; $j < 5; $j++) {
                    if ($yearIndex === 0) {
                        $studentOffset = ($i * 5) + $j;
                    } else {
                        if ((int)$className === 1) {
                            $studentOffset = 30 + $j;
                        } else {
                            $studentOffset = (($i - 1) * 5) + $j;
                        }
                    }

                    if (!isset($students[$studentOffset])) {
                        continue;
                    }

                    DB::table('t_class_student')->insert([
                        'id' => Str::uuid(),
                        'class_id' => $classId,
                        'student_id' => $students[$studentOffset],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
