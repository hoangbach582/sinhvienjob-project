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
            $table->text('rejected_reason')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('rejected_reason');
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete()->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['rejected_reason', 'reviewed_at', 'reviewed_by']);
        });
    }
};
