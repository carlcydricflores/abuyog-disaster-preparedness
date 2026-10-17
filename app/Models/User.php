<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 'role' is intentionally NOT fillable: it can't be set via mass assignment (privilege-escalation guard).
    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    /** True when the user holds the admin role. */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }
}
