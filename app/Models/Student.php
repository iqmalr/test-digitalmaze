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
}
