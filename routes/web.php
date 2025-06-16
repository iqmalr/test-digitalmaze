<?php

use App\Http\Controllers\Web\ClassesController;
use App\Http\Controllers\Web\StudentByClassesController;
use App\Http\Controllers\Web\StudentController;
use App\Http\Controllers\Web\SummaryController;
use App\Http\Controllers\Web\TeacherByClassesController;
use App\Http\Controllers\Web\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::prefix('students')->name('students.')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/create', [StudentController::class, 'create'])->name('create');
        Route::post('/', [StudentController::class, 'store'])->name('store');
        Route::delete('/{id}', [StudentController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [StudentController::class, 'edit'])->name('edit');
        Route::post('/{id}', [StudentController::class, 'update'])->name('update');
    });
    Route::prefix('teachers')->name('teachers.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');
        Route::get('/create', [TeacherController::class, 'create'])->name('create');
        Route::post('/', [TeacherController::class, 'store'])->name('store');
        Route::delete('/{id}', [TeacherController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [TeacherController::class, 'edit'])->name('edit');
        Route::post('/{id}', [TeacherController::class, 'update'])->name('update');
    });
    Route::prefix('classes')->name('classes.')->group(function () {
        Route::get('/', [ClassesController::class, 'index'])->name('index');
        Route::get('/create', [ClassesController::class, 'create'])->name('create');
        Route::post('/', [ClassesController::class, 'store'])->name('store');
        Route::get('/{id}', [ClassesController::class, 'show'])->name('show');
        // Route::delete('/{id}', [ClassesController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [ClassesController::class, 'edit'])->name('edit');
        Route::post('/{id}', [ClassesController::class, 'update'])->name('update');
        Route::get('/{class}/detail', [ClassesController::class, 'show'])->name('detail');
        Route::post('/{class}/assign-student', [ClassesController::class, 'assignStudent'])->name('assign-student');
    });
    Route::prefix('student-by-classes')->name('student-by-classes.')->group(function () {
        Route::get('/', [StudentByClassesController::class, 'index'])->name('index');
        // Route::get('/{id}', [StudentByClassesController::class, 'show'])->name('show');
        // Route::get('/{class}/detail', [StudentByClassesController::class, 'show'])->name('detail');
    });
    Route::prefix('teacher-by-classes')->name('teacher-by-classes.')->group(function () {
        Route::get('/', [TeacherByClassesController::class, 'index'])->name('index');
    });
    // Route::get('/{id}', [TeacherByClassesController::class, 'show'])->name('show');
    // Route::get('/{class}/detail', [TeacherByClassesController::class, 'show'])->name('detail');
    Route::prefix('summary')->name('summary.')->group(function () {
        Route::get('/', [SummaryController::class, 'index'])->name('index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
