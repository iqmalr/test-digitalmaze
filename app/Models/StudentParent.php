<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentParent extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'student_parents';
    protected $fillable = ['name'];
    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'student_parent_student',
            'parent_id',
            'student_id'
        )->withTimestamps();
    }
}
