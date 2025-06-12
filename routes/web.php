<?php

use App\Http\Controllers\Web\StudentController;
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
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/create', [StudentController::class, 'create'])->name('create');
        Route::post('/', [StudentController::class, 'store'])->name('store');
        Route::delete('/{id}', [StudentController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/edit', [StudentController::class, 'edit'])->name('edit');
        Route::post('/{id}', [StudentController::class, 'update'])->name('update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
