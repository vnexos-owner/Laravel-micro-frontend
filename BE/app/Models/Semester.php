<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 */
class Semester extends Model
{
    use HasUuids, SoftDeletes;

    protected $primaryKey = "id";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        'id', 'name', 'start_time', 'end_time', 'is_current',
        'created_at', 'updated_at', 'deleted_at'
    ];

    protected $casts = [
        'start_time'=> 'datetime',
        'end_time'=> 'datetime',
        'is_current' => 'boolean',
    ];

    public function setCurrentSemester()
    {
        \DB::transaction(function () {
            static::where("id", "<>", $this->id)->update(["is_current" => 0]);
            $this->update(["is_current" => 1]);
        });
    }

    public function getClasses()
    {
        return $this->belongsToMany(SchoolClass::class);
    }
}
