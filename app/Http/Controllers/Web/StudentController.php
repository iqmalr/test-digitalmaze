<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        // $student = Student::get();
        // return Inertia::render('Student/Index', compact('student'));
        $query = Student::query();
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('nisn', 'like', '%' . $search . '%');
            });
        }
        $perPage = $request->get('per_page', 10);
        $students = $query->orderBy('created_at', 'desc')->paginate($perPage);
        $students->appends($request->query());
        return Inertia::render('Student/Index', [
            'students' => $students,
            'filters' => [
                'search' => $request->get('search', ''),
                'per_page' => $perPage,
            ]
        ]);
    }
    public function create()
    {
        return Inertia::render('Student/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'nullable|string|max:255',
            'date_of_birth' => 'required|string|date',
            'address' => 'required|string|max:255',
        ]);
        Student::create($validated);
        return redirect()->route('students.index')->with('success', 'Student berhasil ditambahkan');
    }
    public function destroy($id)
    {
        $students = Student::findOrFail($id);
        $students->delete();

        return redirect()->route('students.index')->with('success', 'Student deleted successfully.');
    }
    public function edit($id)
    {
        $student = Student::findOrFail($id);
        return Inertia::render('Student/Edit', [
            'student' => $student
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'nullable|string|max:255',
            'date_of_birth' => 'required|string|date',
            'address' => 'required|string|max:255',
        ]);

        $student->update($validated);

        return redirect()->route('students.index')->with('success', 'Student berhasil diupdate');
    }
}
