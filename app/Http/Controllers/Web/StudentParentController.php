<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentParent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentParentController extends Controller
{
    public function index(Request $request)
    {
        $parents = StudentParent::with(['students' => function ($query) {
            $query->select('m_students.id', 'm_students.name');
        }])
            ->get()
            ->map(function ($parent) {
                return [
                    'id' => $parent->id,
                    'name' => $parent->name,
                    'students' => $parent->students->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'name' => $student->name,
                        ];
                    }),
                    'students_names' => $parent->students->pluck('name')->join(', '),
                ];
            });

        return Inertia::render('Parent/Index', [
            'parents' => $parents,
            // 'filters' => [
            //     'search' => $search,
            //     'per_page' => (int) $perPage,
            // ],
        ]);
    }
    public function create()
    {
        $students = Student::select('id', 'name')->get();
        return Inertia::render('Parent/Create', ['students' => $students]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:m_students,id',
        ]);
        $parent = StudentParent::create([
            'name' => $validated['name'],
        ]);
        if (!empty($validated['student_ids'])) {
            $parent->students()->attach($validated['student_ids']);
        }
        return redirect()->route('parents.index');
        // $parent_student = StudentParent::create([
        //     'name' => $validated['name']
        // ]);
    }
    public function destroy($id)
    {
        $student_parent = StudentParent::findOrFail($id);
        $student_parent->delete();

        return redirect()->route('parents.index')->with('success', 'Student deleted successfully.');
    }
    public function edit($id)
    {
        $student_parent = StudentParent::with('students')->findOrFail($id);
        $students = Student::select('id', 'name')->get();
        return Inertia::render('Parent/Edit', [
            'student_parent' => $student_parent,
            'students' => $students,
        ]);
    }

    public function update(Request $request, $id)
    {
        $student_parent = StudentParent::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $student_parent->update($validated);

        return redirect()->route('parents.index')->with('success', 'Parent berhasil diupdate');
    }
}
