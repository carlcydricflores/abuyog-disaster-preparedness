<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->boolean('allow_name_publication')->nullable()->default(false);
        });

        Schema::table('alerts', function (Blueprint $table) {
            $table->foreignId('incident_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->boolean('is_published')->nullable()->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->dropUnique(['incident_id']);
            $table->dropConstrainedForeignId('incident_id');
            $table->dropColumn('is_published');
        });

        Schema::table('incidents', function (Blueprint $table) {
            $table->dropColumn('allow_name_publication');
        });
    }
};
