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
        Schema::create('employers', function (Blueprint $table) {
        $table->uuid('id')->primary();
        
        // Khóa ngoại trỏ về bảng users
        $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();

        $table->string('company_name'); // Tên công ty
        $table->string('industry')->nullable(); // Ngành nghề / Lĩnh vực
        $table->string('website')->nullable();
        $table->string('logo_url')->nullable(); // Logo công ty
        $table->text('description')->nullable(); // Giới thiệu công ty
        $table->boolean('is_approved')->default(false); // Admin duyệt công ty
        
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employers');
    }
};
