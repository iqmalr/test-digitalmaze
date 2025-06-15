<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SummaryController extends Controller
{
    public function index(Request $request)
    {
        $academicYear = $request->get('academic_year', '2024/2025');

        $query = Student::query()->with(['classes' => function ($query) use ($academicYear) {
            $query->where('academic_year', $academicYear)->with('teacher');
        }]);

        $query->whereHas('classes', function ($classQuery) use ($academicYear) {
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

        $perPage = $request->get('per_page', 10);
        $students = $query->orderBy('created_at', 'desc')->paginate($perPage);
        $students->appends($request->query());

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
            ],
            'academic_years' => $academicYears
        ]);
    }
}
