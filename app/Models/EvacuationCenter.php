<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvacuationCenter extends Model
{
    protected $fillable = ['name', 'barangay', 'address', 'capacity', 'occupied', 'status', 'contact', 'latitude', 'longitude'];
}
