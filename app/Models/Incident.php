<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    // status/admin_notes are excluded: only admins change them, via explicit assignment in the controller.
    protected $fillable = ['user_id', 'type', 'barangay', 'description', 'latitude', 'longitude', 'photo_path'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
