<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasUuids, SoftDeletes;
    protected $table = 'm_teachers';
    protected $fillable = ['nip', 'name', 'address', 'date_of_birth'];

    public function classes()
    {
        //     return $this->hasMany(Classes::class, 'teacher_id');
        return $this->belongsToMany(
            Classes::class,
            'class_teacher',
            'teacher_id',
            'class_id'
        )->withTimestamps();
    }
}
