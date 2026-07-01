<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kiểm tra xem đã có admin nào chưa, nếu chưa thì tạo
        if (!User::where('role', 'admin')->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('12345678'), // Mật khẩu mặc định
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(), // Đã xác thực
            ]);
            
            $this->command->info('Đã tạo tài khoản Admin: admin@gmail.com / 12345678');
        } else {
            $this->command->info('Tài khoản Admin đã tồn tại, bỏ qua bước tạo mới.');
        }
    }
}
