<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::query();
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')->orWhere('nip', 'like', '%', $search . '%');
            });
        }
        $perPage = $request->get('per_page', 10);
        $teachers = $query->orderBy('created_at', 'desc')->paginate($perPage);
        $teachers->appends($request->query());
        return Inertia::render('Teacher/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $request->get('search', ''),
                'per_page' => $perPage,
            ]
        ]);
    }
    public function create()
    {
        return Inertia::render('Teacher/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'date_of_birth' => 'required|string|date',
            'address' => 'required|string|max:255',
        ]);
        Teacher::create($validated);
        return redirect()->route('teachers.index')->with('success', 'Teacher berhasil ditambahkan');
    }
    public function destroy($id)
    {
        $teachers = Teacher::findOrFail($id);
        $teachers->delete();

        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully.');
    }
    public function edit($id)
    {
        $teacher = Teacher::findOrFail($id);
        return Inertia::render('Teacher/Edit', [
            'teacher' => $teacher
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'date_of_birth' => 'required|string|date',
            'address' => 'required|string|max:255',
        ]);

        $teacher->update($validated);

        return redirect()->route('teachers.index')->with('success', 'Teacher berhasil diupdate');
    }
}
