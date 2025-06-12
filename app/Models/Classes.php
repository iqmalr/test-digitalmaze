<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classes extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'm_classes';

    protected $fillable = ['name', 'teacher_id', 'semester', 'academic_year'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            't_class_student',
            'class_id',
            'student_id'
        )->withTimestamps();
    }
}
