<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = ['user_id', 'title', 'type', 'severity', 'barangays', 'message', 'expires_at', 'photos'];

    // This format drops straight into <input type="datetime-local">.
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime:Y-m-d\\TH:i',
            'is_published' => 'boolean',
            'photos' => 'array', // saved as JSON text, read back as a list of file paths
        ];
    }

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }

    /** Alerts that have not expired yet (no expiry = stays active). */
    public function scopeActive($q)
    {
        return $q
            ->where(fn ($w) => $w->whereNull('is_published')->orWhere('is_published', true))
            ->where(fn ($w) => $w->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }
}