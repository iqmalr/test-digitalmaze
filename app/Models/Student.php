<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'm_students';
    protected $fillable = ['nisn', 'name', 'address', 'date_of_birth'];
    public function classes()
    {
        return $this->belongsToMany(Classes::class, 't_class_student', 'student_id', 'class_id');
    }
}
