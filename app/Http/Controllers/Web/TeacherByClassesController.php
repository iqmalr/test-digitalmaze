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
                $q->where('m_teachers.name', 'like', '%' . $search . '%')
                    ->orWhere('nip', 'like', '%' . $search . '%')
                    ->orWhereHas('classes', function ($classQuery) use ($search, $academicYear) {
                        $classQuery->where('academic_year', $academicYear)
                            ->where('m_classes.name', 'like', '%' . $search . '%');
                    });
            });
        }

        $teachers = $query->orderBy('m_teachers.name', 'asc')->paginate($perPage);


        $teachers = $query->orderBy('m_teachers.name', 'asc')->paginate($perPage);
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
}
