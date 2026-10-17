<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // RBAC: 'admin' or 'user'. Default is 'user' so public registration can never create admins.
        Schema::table('users', fn (Blueprint $t) => $t->string('role', 10)->default('user')->index()->after('email'));

        Schema::create('alerts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete(); // admin who posted it
            $t->string('title', 150);
            $t->string('type', 30);
            $t->string('severity', 20)->index();    // advisory|watch|warning|critical
            $t->string('barangays')->nullable();
            $t->text('message');
            $t->dateTime('expires_at')->nullable()->index();
            $t->timestamps();
        });

        Schema::create('evacuation_centers', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('barangay')->index();
            $t->string('address')->nullable();
            $t->unsignedInteger('capacity');
            $t->unsignedInteger('occupied')->default(0);
            $t->string('status', 10)->default('open')->index(); // open|full|closed
            $t->string('contact')->nullable();
            $t->decimal('latitude', 10, 7)->nullable();
            $t->decimal('longitude', 10, 7)->nullable();
            $t->timestamps();
        });

        Schema::create('hotlines', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('category', 30)->index();
            $t->string('number', 40);
            $t->timestamps();
        });

        Schema::create('guidelines', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('category', 10)->index(); // before|during|after
            $t->text('body');
            $t->timestamps();
        });

        Schema::create('incidents', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('type', 30)->index();
            $t->string('barangay', 100)->index();
            $t->text('description');
            $t->decimal('latitude', 10, 7)->nullable();
            $t->decimal('longitude', 10, 7)->nullable();
            $t->string('photo_path')->nullable();
            $t->string('status', 15)->default('pending')->index(); // pending|verified|in_progress|resolved|rejected
            $t->text('admin_notes')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['incidents', 'guidelines', 'hotlines', 'evacuation_centers', 'alerts'] as $tbl) {
            Schema::dropIfExists($tbl);
        }
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('role'));
    }
};
