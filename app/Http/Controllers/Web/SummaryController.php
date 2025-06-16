<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SummaryController extends Controller
{
    public function index(Request $request)
    {
        $academicYear = $request->get('academic_year', '2024/2025');
        $sortByClass = $request->get('sort_by_class', 'asc');
        $perPage = $request->get('per_page', 10);
        // $query = Student::query()->with(['classes' => function ($query) use ($academicYear) {
        //     $query->where('academic_year', $academicYear)->with('teacher');
        // }]);

        // $query->whereHas('classes', function ($classQuery) use ($academicYear) {
        //     $classQuery->where('academic_year', $academicYear);
        // });

        // if ($request->filled('search')) {
        //     $search = $request->get('search');
        //     $query->where(function ($q) use ($search, $academicYear) {
        //         $q->where('name', 'like', '%' . $search . '%')
        //             ->orWhere('nisn', 'like', '%' . $search . '%')
        //             ->orWhere('address', 'like', '%' . $search . '%')
        //             ->orWhereHas('classes', function ($classQuery) use ($search, $academicYear) {
        //                 $classQuery->where('academic_year', $academicYear)
        //                     ->where('name', 'like', '%' . $search . '%');
        //             });
        //     });
        // }
        $query = Student::query()
            ->select('m_students.*')
            ->join('t_class_student', 'm_students.id', '=', 't_class_student.student_id')
            ->join('m_classes', 't_class_student.class_id', '=', 'm_classes.id')
            ->where('m_classes.academic_year', $academicYear)
            ->with(['classes' => function ($query) use ($academicYear) {
                $query->where('academic_year', $academicYear)->with('teachers');
            }])
            ->groupBy('m_students.id');

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search, $academicYear) {
                $q->where('m_students.name', 'like', '%' . $search . '%')
                    ->orWhere('m_students.nisn', 'like', '%' . $search . '%')
                    ->orWhere('m_students.address', 'like', '%' . $search . '%')
                    ->orWhereHas('classes', function ($classQuery) use ($search, $academicYear) {
                        $classQuery->where('academic_year', $academicYear)
                            ->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        $students = $query
            ->orderBy(DB::raw('MIN(m_classes.name)'), $sortByClass)
            ->paginate($perPage);
        $students->appends($request->query());
        // dd($students);
        $academicYears = Classes::select('academic_year')
            ->distinct()
            ->orderBy('academic_year', 'desc')
            ->pluck('academic_year')
            ->toArray();

        return Inertia::render('Summary/Index', [
            'students' => $students,
            'filters' => [
                'search' => $request->get('search', ''),
                'per_page' => $perPage,
                'academic_year' => $academicYear,
                'sort_by_class' => $sortByClass,
            ],
            'academic_years' => $academicYears
        ]);
    }
}
