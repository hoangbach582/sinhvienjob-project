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
        Schema::create('jobs', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->foreignUuid('employer_id')->constrained('employers')->cascadeOnDelete();
        
        $table->string('title'); // Tiêu đề công việc
        $table->string('location')->nullable(); // Địa điểm
        $table->enum('type', ['internship', 'part_time', 'full_time']); // Loại hình
        $table->decimal('salary_min', 15, 2)->nullable();
        $table->decimal('salary_max', 15, 2)->nullable();
        $table->text('description'); // Mô tả
        $table->text('requirements')->nullable(); // Yêu cầu
        $table->date('deadline')->nullable(); // Hạn nộp
        
        // Trạng thái tin: chờ duyệt, đã duyệt, từ chối, đã đóng
        $table->enum('status', ['pending', 'approved', 'rejected', 'closed'])->default('pending');
        
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
