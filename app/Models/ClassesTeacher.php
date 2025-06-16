<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ClassesTeacher extends Model
{
    use HasUuids;

    protected $table = 'class_teacher';
    protected $fillable = ['class_id', 'teacher_id'];
}
