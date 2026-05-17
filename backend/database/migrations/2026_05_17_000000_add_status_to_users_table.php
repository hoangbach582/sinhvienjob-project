<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Thêm cột 'status' và 'name' vào bảng users
 * - status: active | pending | locked | rejected (mặc định: active)
 * - name: tên hiển thị (nếu chưa có)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Thêm cột status để admin quản lý
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'pending', 'locked', 'rejected'])
                      ->default('active')
                      ->after('role');
            }

            // Thêm cột name nếu chưa có (một số flow cần name)
            if (!Schema::hasColumn('users', 'name')) {
                $table->string('name')->nullable()->after('id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status']);
            // Không drop name vì có thể đã tồn tại trước đó
        });
    }
};
