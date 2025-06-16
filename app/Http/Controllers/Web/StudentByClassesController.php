<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentByClassesController extends Controller
{
    public function index(Request $request)
    {
        $academicYear = $request->get('academic_year', '2024/2025');
        $sortByClass = $request->get('sort_by_class', 'asc');
        $perPage = $request->get('per_page', 10);

        $query = Student::query()
            ->with(['classes' => function ($query) use ($academicYear) {
                $query->where('academic_year', $academicYear)->with('teacher');
            }])
            ->whereHas('classes', function ($classQuery) use ($academicYear) {
                $classQuery->where('academic_year', $academicYear);
            });

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search, $academicYear) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('nisn', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhereHas('classes', function ($classQuery) use ($search, $academicYear) {
                        $classQuery->where('academic_year', $academicYear)
                            ->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        $query->withCount([
            'classes as class_name' => function ($q) use ($academicYear) {
                $q->select('m_classes.name')
                    ->where('academic_year', $academicYear);
            }
        ]);

        $students = $query->orderBy('class_name', $sortByClass)->paginate($perPage);
        $students->appends($request->query());

        $academicYears = Classes::select('academic_year')
            ->distinct()
            ->orderBy('academic_year', 'desc')
            ->pluck('academic_year')
            ->toArray();

        return Inertia::render('StudentByClass/Index', [
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
