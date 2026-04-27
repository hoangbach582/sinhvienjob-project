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
        Schema::create('student_skills', function (Blueprint $table) {
        $table->foreignUuid('student_id')->constrained('student_profiles')->cascadeOnDelete();
        $table->foreignUuid('skill_id')->constrained('skills')->cascadeOnDelete();
        $table->enum('level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
        
        // Khóa chính kép
        $table->primary(['student_id', 'skill_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_skills');
    }
};
