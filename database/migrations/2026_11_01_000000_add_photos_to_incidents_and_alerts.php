<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Additive and safe: nullable JSON columns holding a list of photo paths. Existing rows are untouched.
return new class extends Migration {
    public function up(): void
    {
        Schema::table('incidents', fn (Blueprint $t) => $t->json('photos')->nullable()->after('photo_path'));
        Schema::table('alerts', fn (Blueprint $t) => $t->json('photos')->nullable());
    }

    public function down(): void
    {
        Schema::table('incidents', fn (Blueprint $t) => $t->dropColumn('photos'));
        Schema::table('alerts', fn (Blueprint $t) => $t->dropColumn('photos'));
    }
};