<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    // status/admin_notes are excluded: only admins change them, via explicit assignment in the controller.
    protected $fillable = ['user_id', 'type', 'barangay', 'description', 'latitude', 'longitude', 'photo_path', 'photos', 'allow_name_publication'];

    protected function casts(): array
    {
        return [
            'allow_name_publication' => 'boolean',
            'photos' => 'array', // saved as JSON text, read back as a list of file paths
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function alert()
    {
        return $this->hasOne(Alert::class);
    }
}