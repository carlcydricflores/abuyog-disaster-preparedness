<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = ['user_id', 'title', 'type', 'severity', 'barangays', 'message', 'expires_at'];

    // This format drops straight into <input type="datetime-local">.
    protected $casts = ['expires_at' => 'datetime:Y-m-d\TH:i'];

    /** Alerts that have not expired yet (no expiry = stays active). */
    public function scopeActive($q)
    {
        return $q->where(fn ($w) => $w->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }
}
