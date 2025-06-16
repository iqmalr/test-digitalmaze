<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClassesController extends Controller
{
    public function index(Request $request, Classes $class)
    {
        $query = Classes::with('teachers');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhereHas('teacher', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }

        $perPage = $request->input('per_page', 10);

        $classes = $query->latest()->paginate($perPage)->withQueryString();
        $classes->getCollection()->transform(function ($class) {
            $class->teachers_names = $class->teachers->pluck('name')->join(', ');
            $class->primary_teacher = $class->teachers->first();
            return $class;
        });
        return Inertia::render('Class/Index', [
            'classes' => $classes,
            'filters' => [
                'search' => $request->search,
                'per_page' => $perPage,
            ],
        ]);
    }
    //     public function show(Classes $class)
    // {
    //     $students = $class->students;
    //     $teacher = $class->teacher;

    //     $allStudents = Student::select('id', 'name')->get();
    //     return Inertia::render('Class/Detail', [
    //         'classItem' => $class,
    //         'students' => $students,
    //         'teacher' => $teacher,
    //         'allStudents' => $allStudents,
    //     ]);
    // }
    public function create()
    {
        $teachers = Teacher::select('id', 'name')->get();

        return Inertia::render('Class/Create', [
            'teachers' => $teachers
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'teacher_id' => 'nullable|exists:m_teachers,id',
            // 'semester' => 'required|in:1,2',
            'academic_year' => 'required|string|max:20',
            'teacher_ids' => 'array',
            'teacher_ids.*' => 'exists:m_teachers,id',
        ]);

        $class = Classes::create([
            'name' => $validated['name'],
            'academic_year' => $validated['academic_year'],
        ]);
        if (!empty($validated['teacher_ids'])) {
            // $class->teachers()->attach($validated['teacher_ids']);
            $teacherData = collect($validated['teacher_ids'])->mapWithKeys(function ($teacherId) {
                return [
                    $teacherId => [
                        'id' => Str::uuid(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ];
            });
            $class->teachers()->attach($teacherData);
        }

        return redirect()->route('classes.index')->with('success', 'Kelas berhasil ditambahkan.');
    }
    public function show(Classes $class)
    {
        $students = $class->students;
        $teachers = $class->teachers;

        $allStudents = Student::select('id', 'name')->get();
        return Inertia::render('Class/Detail', [
            'classItem' => $class,
            'students' => $students,
            'teachers' => $teachers,
            'allStudents' => $allStudents,
        ]);
    }
    public function assignStudent(Request $request, $id)
    {
        try {
            $request->validate([
                'student_id' => 'required|exists:m_students,id',
            ]);

            $class = Classes::findOrFail($id);
            if (!$class->students()->where('student_id', $request->student_id)->exists()) {
                $class->students()->attach($request->student_id, [
                    'id' => Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return redirect()->back()->with('success', 'Siswa berhasil ditambahkan ke kelas.');
            } else {
                return redirect()->back()->with('error', 'Siswa sudah terdaftar di kelas ini.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan siswa ke kelas.');
        }
    }
    public function edit($id)
    {
        $class = Classes::findOrFail($id);
        $teachers = Teacher::select('id', 'name')->get();
        $class->selected_teacher_ids = $class->teachers->pluck('id')->toArray();
        return Inertia::render('Class/Edit', [
            'class' => $class,
            'teachers' => $teachers
        ]);
    }

    public function update(Request $request, $id)
    {
        $class = Classes::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'teacher_id' => 'nullable|exists:m_teachers,id',
            // 'semester' => 'required|in:1,2',
            'academic_year' => 'required|string|max:20',
            'teacher_ids' => 'array',
            'teacher_ids.*' => 'exists:m_teachers,id',
        ]);

        $class->update([
            'name' => $validated['name'],
            'academic_year' => $validated['academic_year'],
        ]);
        // $class->teachers()->sync($validated['teacher_ids'] ?? []);
        $teacherData = collect($validated['teacher_ids'] ?? [])->mapWithKeys(function ($teacherId) {
            return [
                $teacherId => [
                    'id' => Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];
        });

        $class->teachers()->sync($teacherData);
        return redirect()->route('classes.index')->with('message', 'Kelas berhasil diperbarui.');
    }
}
