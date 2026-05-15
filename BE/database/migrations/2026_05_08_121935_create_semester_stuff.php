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
        Schema::create('semesters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->boolean('is_current')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('prerequisite')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('classes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->foreignUuid('semester_id')->constrained()->onDelete('cascade');
            // Teacher will create this class
            // Admin is also able to create classes but must choose teacher
            $table->foreignUuid('homeroom_teacher_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('class_students', function (Blueprint $table) {
            $table->foreignUuid('class_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('student_id')->constrained('users')->onDelete('cascade');

            $table->primary(['class_id','student_id']);
            $table->timestamps();
        });
        Schema::create('class_courses', function (Blueprint $table) {
            $table->foreignUuid('class_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('course_id')->constrained()->onDelete('cascade');

            $table->primary(['class_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_courses');
        Schema::dropIfExists('class_students');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('semesters');
    }
};
