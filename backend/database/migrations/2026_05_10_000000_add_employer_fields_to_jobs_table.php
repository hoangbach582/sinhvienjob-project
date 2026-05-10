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
        Schema::table('jobs', function (Blueprint $table) {
            $table->string('industry')->nullable()->after('type'); // Ngành nghề
            $table->string('experience')->nullable()->after('location'); // Kinh nghiệm
            $table->text('benefits')->nullable()->after('requirements'); // Quyền lợi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['industry', 'experience', 'benefits']);
        });
    }
};
