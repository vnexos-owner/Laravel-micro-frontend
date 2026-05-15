<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 */
#[Fillable(['name'])]
class Role extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }

    public static function addUser(string $roleName, User $user)
    {
        $role = Role::where('name', $roleName)->first();
        $user->roles()->attach($role->id);
    }

    public static function removeUser(string $roleName, User $user)
    {
        $role = Role::where('name', $roleName)->first();
        $user->roles()->detach($role->id);
    }
}
