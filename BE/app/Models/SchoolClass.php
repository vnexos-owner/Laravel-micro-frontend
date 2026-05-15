<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $name
 * @property string $semester_id
 * @property string $homeroom_teacher_id
 */
class SchoolClass extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = "classes";
    protected $primaryKey = "id";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        'id', 'name', 'semester_id', 'homeroom_teacher_id', 'created_at',
        'updated_at', 'deleted_at'
    ];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'class_courses', 'class_id', 'course_id');
    }

    public function homeroomTeacher()
    {
        return $this->belongsTo(User::class,'homeroom_teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'class_students', 'class_id', 'student_id');
    }

    public function addStudent(string $userId): void
    {
        $this->students()->attach($userId);
    }

    public function removeStudent(string $userId): void
    {
        $this->students()->detach($userId);
    }

    public function addCourse(string $courseId): void
    {
        $this->courses()->attach($courseId);
    }

    public function removeCourse(string $courseId): void
    {
        $this->courses()->detach($courseId);
    }
}
