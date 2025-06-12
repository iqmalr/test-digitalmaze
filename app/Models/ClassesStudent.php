<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ClassesStudent extends Model
{
    use HasUuids;
    protected $table = 't_class_student';
    protected $fillable = ['class_id', 'student_id'];
}
