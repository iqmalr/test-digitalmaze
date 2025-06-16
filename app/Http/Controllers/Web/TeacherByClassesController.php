<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherByClassesController extends Controller
{
    public function index(Request $request)
    {
        $academicYear = $request->get('academic_year', '2024/2025');
        $sortByClass = $request->get('sort_by_class', 'asc');

        $perPage = $request->get('per_page', 10);

        // $query = Teacher::query()
        //     ->with(['classes' => function ($query) use ($academicYear) {
        //         $query->where('academic_year', $academicYear);
        //     }])
        //     ->whereHas('classes', function ($query) use ($academicYear) {
        //         $query->where('academic_year', $academicYear);
        //     });
        $query = Teacher::query()
            ->select('m_teachers.*')
            ->join('class_teacher', 'm_teachers.id', '=', 'class_teacher.teacher_id')
            ->join('m_classes', 'class_teacher.class_id', '=', 'm_classes.id')
            ->where('m_classes.academic_year', $academicYear)
            ->with(['classes' => function ($query) use ($academicYear) {
                $query->where('academic_year', $academicYear);
            }])
            ->groupBy('m_teachers.id');

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search, $academicYear) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('nip', 'like', '%' . $search . '%')
                    ->orWhereHas('classes', function ($classQuery) use ($search, $academicYear) {
                        $classQuery->where('academic_year', $academicYear)
                            ->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        $teachers = $query->orderBy('name', 'asc')->paginate($perPage);
        $teachers->appends($request->query());

        $academicYears = Classes::select('academic_year')
            ->distinct()
            ->orderBy('academic_year', 'desc')
            ->pluck('academic_year')
            ->toArray();

        return Inertia::render('TeacherByClass/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $request->get('search', ''),
                'per_page' => $perPage,
                'academic_year' => $academicYear,
            ],
            'academic_years' => $academicYears
        ]);
    }
    // public function index(Request $request)
    // {
    //     $query = Classes::with('teacher');

    //     if ($request->filled('search')) {
    //         $query->where('name', 'like', '%' . $request->search . '%')
    //             ->orWhereHas('teacher', function ($q) use ($request) {
    //                 $q->where('name', 'like', '%' . $request->search . '%');
    //             });
    //     }
    //     if ($request->filled('class_names') && is_array($request->class_names)) {
    //         $query->whereIn('name', $request->class_names);
    //     }
    //     // if ($request->filled('semesters') && is_array($request->semesters)) {
    //     //     $query->whereIn('semester', $request->semesters);
    //     // }
    //     if ($request->filled('academic_years') && is_array($request->academic_years)) {
    //         $query->whereIn('academic_year', $request->academic_years);
    //     }
    //     $filterOptions = [
    //         'class_names' => Classes::distinct()->pluck('name')->filter()->sort()->values(),
    //         'academic_years' => Classes::distinct()->pluck('academic_year')->filter()->sort()->values(),
    //         // 'semesters' => Classes::distinct()->pluck('semester')->filter()->sort()->values()
    //     ];
    //     $perPage = $request->input('per_page', 10);

    //     $classes = $query->latest()->paginate($perPage)->withQueryString();

    //     return Inertia::render('TeacherByClass/Index', [
    //         'classes' => $classes,
    //         'filters' => [
    //             'search' => $request->search,
    //             'per_page' => $perPage,
    //             'class_names' => $request->class_names ?? [],
    //             'academic_years' => $request->academic_years ?? [],
    //             // 'semesters' => $request->semesters ?? []
    //         ],
    //         'filterOptions' => $filterOptions
    //     ]);
    // }
}
