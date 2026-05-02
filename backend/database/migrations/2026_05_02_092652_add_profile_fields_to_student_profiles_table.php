<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            // Thêm các cột mới ngay sau cột full_name
            $table->string('phone', 20)->nullable()->after('full_name');
            $table->string('avatar')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('avatar');
            $table->string('cv_url')->nullable()->after('bio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn(['phone', 'avatar', 'bio', 'cv_url']);
        });
    }
};
