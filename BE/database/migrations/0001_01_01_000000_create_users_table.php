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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            // Base information
            $table->string('avatar')->nullable();
            $table->string('banner')->nullable();
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->uuid('id')->primary(); // the generated token itself is id
            
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');

            // IP address
            $table->string('ip_address', 45)->nullable();

            // User's machine info
            $table->text('device_type')->nullable();
            $table->text('browser_name')->nullable();
            $table->text('operating_system')->nullable();

            $table->timestamp('expires_at')->index();
            $table->timestamp('last_used_at')->nullable();

            $table->timestamps(); // created_at will tell we when users logged in
            $table->softDeletes();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');

            $table->primary(['user_id','role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('refresh_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
    }
};
