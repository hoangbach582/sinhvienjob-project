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
        Schema::create('applications', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->foreignUuid('job_id')->constrained('jobs')->cascadeOnDelete();
        $table->foreignUuid('student_id')->constrained('student_profiles')->cascadeOnDelete();
        
        $table->string('cv_url'); // Link file CV
        $table->text('cover_letter')->nullable(); // Thư xin việc
        
        // Trạng thái đơn: chờ xử lý, đang xem xét, phỏng vấn, từ chối, chấp nhận
        $table->enum('status', ['pending', 'reviewing', 'interview', 'rejected', 'accepted'])->default('pending');
        
        $table->timestamp('applied_at')->useCurrent(); // Thời gian nộp
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
