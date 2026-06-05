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
        Schema::table('employers', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->string('employee_count')->nullable();
            $table->integer('founded_year')->nullable();
            $table->text('about')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->json('benefits')->nullable();
            $table->json('gallery_images')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            $table->dropColumn([
                'address', 
                'employee_count', 
                'founded_year', 
                'about', 
                'cover_image_url', 
                'benefits', 
                'gallery_images'
            ]);
        });
    }
};
