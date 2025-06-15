<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentByClassesController extends Controller
{
    public function index(Request $request, Classes $class)
    {
        $query = Classes::with('teacher');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhereHas('teacher', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
        }
        if ($request->filled('class_names') && is_array($request->class_names)) {
            $query->whereIn('name', $request->class_names);
        }
        if ($request->filled('semesters') && is_array($request->semesters)) {
            $query->whereIn('semester', $request->semesters);
        }
        if ($request->filled('academic_years') && is_array($request->academic_years)) {
            $query->whereIn('academic_year', $request->academic_years);
        }
        $filterOptions = [
            'class_names' => Classes::distinct()->pluck('name')->filter()->sort()->values(),
            'academic_years' => Classes::distinct()->pluck('academic_year')->filter()->sort()->values(),
            'semesters' => Classes::distinct()->pluck('semester')->filter()->sort()->values()
        ];
        $perPage = $request->input('per_page', 10);

        $classes = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('StudentByClass/Index', [
            'classes' => $classes,
            'filters' => [
                'search' => $request->search,
                'per_page' => $perPage,
                'class_names' => $request->class_names ?? [],
                'academic_years' => $request->academic_years ?? [],
                'semesters' => $request->semesters ?? []
            ],
            'filterOptions' => $filterOptions
        ]);
    }
    public function show(Classes $class)
    {
        $students = $class->students;
        $teacher = $class->teacher;

        $allStudents = Student::select('id', 'name')->get();
        return Inertia::render('StudentByClass/Detail', [
            'classItem' => $class,
            'students' => $students,
            'teacher' => $teacher,
            'allStudents' => $allStudents,
        ]);
    }
}
