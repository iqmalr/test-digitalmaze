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
}
