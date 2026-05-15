<?php

namespace App\Models;

use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $ip_address
 * @property string $device_type
 * @property string $browser_name
 * @property string $operating_system
 * @property Carbon $expires_at
 */
class RefreshToken extends Model
{
    use SoftDeletes, HasUuids;

    protected $primaryKey = "id";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        'id', 'user_id', 'ip_address', 'device_type', 'browser_name',
        'operating_system', 'expires_at', 'last_used_at'
    ];

    protected $casts = [
        'expires_at'=> 'datetime',
        'last_used_at'=> 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired() : bool
    {
        return $this->expires_at->isPast();
    }
}
