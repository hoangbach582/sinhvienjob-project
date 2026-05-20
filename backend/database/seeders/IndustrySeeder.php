<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Industry;
use Illuminate\Support\Str;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            [
                'name' => 'IT & Phần mềm',
                'description' => 'Công nghệ thông tin, Lập trình, Quản trị mạng, Devops,...',
            ],
            [
                'name' => 'Thiết kế',
                'description' => 'Thiết kế đồ họa, UI/UX, Thiết kế nội thất, Mỹ thuật,...',
            ],
            [
                'name' => 'Kinh doanh',
                'description' => 'Bán hàng, Phát triển thị trường, Chăm sóc khách hàng,...',
            ],
            [
                'name' => 'Marketing',
                'description' => 'Quảng cáo, SEO, Content Creator, Digital Marketing,...',
            ],
        ];

        foreach ($industries as $item) {
            Industry::firstOrCreate(
                ['name' => $item['name']],
                [
                    'slug' => Str::slug($item['name']),
                    'description' => $item['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
