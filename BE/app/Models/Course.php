<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $name
 * @property string $code
 */
class Course extends Model
{
    use HasUuids, SoftDeletes;

    protected $primaryKey = "id";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        "id", "name", "code", "prerequisite", "created_at", "updated_at", "deleted_at"
    ];

    public function classes()
    {
        return $this->belongsToMany(SchoolClass::class, "class_courses", 'course_id', 'class_id');
    }
}
