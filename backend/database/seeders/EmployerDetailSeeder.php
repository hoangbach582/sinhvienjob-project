<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employer;

class EmployerDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employersData = [
            'Techcombank' => [
                'industry' => 'Tài chính - Ngân hàng',
                'description' => 'Techcombank không ngừng đổi mới, tiên phong trong chuyển đổi số và mang đến trải nghiệm tài chính vượt trội cho khách hàng.',
                'address' => 'Hà Nội, Việt Nam',
                'employee_count' => '5000+ nhân viên',
                'founded_year' => 1993,
                'about' => "Techcombank là một trong những ngân hàng thương mại cổ phần hàng đầu Việt Nam với tầm nhìn trở thành ngân hàng số 1 tại Việt Nam, dẫn đầu về hiệu quả và công nghệ.\n\nChúng tôi xây dựng môi trường làm việc chuyên nghiệp, sáng tạo, đề cao sự phát triển cá nhân và mang đến cơ hội thăng tiến rộng mở cho mọi nhân viên.",
                'benefits' => [
                    'Thu nhập hấp dẫn: Lương cạnh tranh, thưởng hiệu quả công việc',
                    'Bảo hiểm toàn diện: BHXH, BHYT, BHTN và bảo hiểm sức khỏe cao cấp',
                    'Đào tạo & phát triển: Chương trình đào tạo và phát triển kỹ năng',
                    'Work-life balance: Linh hoạt thời gian, nghỉ phép và hoạt động nội bộ'
                ],
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
                ],
                'is_approved' => true
            ],
            'Youtube' => [
                'industry' => 'Giải trí / Truyền thông',
                'description' => 'Nền tảng chia sẻ video trực tuyến lớn nhất thế giới, thúc đẩy sự sáng tạo và kết nối mọi người.',
                'address' => 'Hà Nội, Việt Nam',
                'employee_count' => '2000+ nhân viên',
                'founded_year' => 2005,
                'about' => "YouTube là nền tảng chia sẻ và lưu trữ video lớn nhất thế giới do Google sở hữu.\n\nSứ mệnh của chúng tôi là tạo cơ hội cho mọi người được lên tiếng và khám phá thế giới. Chúng tôi mang đến không gian sáng tạo tự do cùng văn hóa chia sẻ đa dạng.",
                'benefits' => [
                    'Môi trường quốc tế',
                    'Giờ làm linh hoạt',
                    'Trà chiều miễn phí'
                ],
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
                ],
                'is_approved' => true
            ],
            'Swagbucks' => [
                'industry' => 'Marketing / Công nghệ',
                'description' => 'Nền tảng khảo sát trực tuyến và hoàn tiền uy tín hàng đầu trên toàn cầu.',
                'address' => 'Remote',
                'employee_count' => '500+ nhân viên',
                'founded_year' => 2008,
                'about' => "Swagbucks là một trong những nền tảng phần thưởng và khảo sát trực tuyến phổ biến nhất thế giới.\n\nChúng tôi giúp người dùng kiếm thẻ quà tặng và tiền mặt cho những việc họ làm hàng ngày trên mạng như mua sắm, tìm kiếm, xem video và tham gia khảo sát.",
                'benefits' => [
                    'Làm việc từ xa',
                    'Thưởng năng suất',
                    'Đồng nghiệp thân thiện'
                ],
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
                ],
                'is_approved' => true
            ],
            'Shopee' => [
                'industry' => 'Thương mại điện tử',
                'description' => 'Nền tảng mua sắm trực tuyến hàng đầu Đông Nam Á và Đài Loan.',
                'address' => 'Tòa nhà Capital Place, Hà Nội',
                'employee_count' => '5000+ nhân viên',
                'founded_year' => 2015,
                'about' => "Shopee là nền tảng thương mại điện tử hàng đầu tại Đông Nam Á và Đài Loan.\n\nShopee kết nối người tiêu dùng, người bán và doanh nghiệp, tạo điều kiện thuận lợi cho việc mua bán diễn ra an toàn, tin cậy và tiện lợi.",
                'benefits' => [
                    'Môi trường năng động',
                    'Shopee Orange Day',
                    'Lộ trình thăng tiến',
                    'Chăm sóc sức khỏe'
                ],
                'gallery_images' => [
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
                ],
                'is_approved' => true
            ]
        ];

        // Default data for companies not specifically defined above
        $defaultData = [
            'industry' => 'Công nghệ thông tin',
            'description' => 'Công ty công nghệ hàng đầu, tập trung vào sáng tạo và phát triển.',
            'address' => 'Hà Nội, Việt Nam',
            'employee_count' => '1000+ nhân viên',
            'founded_year' => 2010,
            'about' => "Chúng tôi là môi trường năng động với đội ngũ chuyên gia giàu kinh nghiệm.\n\nSứ mệnh của công ty là mang đến sản phẩm, dịch vụ chất lượng cao nhất cho khách hàng, đồng thời tạo ra môi trường phát triển toàn diện cho nhân viên.",
            'benefits' => [
                'Lương thưởng cạnh tranh',
                'Chăm sóc sức khỏe toàn diện',
                'Môi trường làm việc linh hoạt'
            ],
            'gallery_images' => [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80'
            ],
            'is_approved' => true
        ];

        $employers = Employer::all();

        foreach ($employers as $employer) {
            $data = $employersData[$employer->company_name] ?? $defaultData;
            
            // Only update fields if they are empty, except for new JSON fields which we'll just set
            $updateData = [];
            
            if (empty($employer->industry)) $updateData['industry'] = $data['industry'];
            if (empty($employer->description)) $updateData['description'] = $data['description'];
            if (empty($employer->address)) $updateData['address'] = $data['address'];
            if (empty($employer->employee_count)) $updateData['employee_count'] = $data['employee_count'];
            if (empty($employer->founded_year)) $updateData['founded_year'] = $data['founded_year'];
            if (empty($employer->about)) $updateData['about'] = $data['about'];
            
            $updateData['benefits'] = $data['benefits'];
            $updateData['gallery_images'] = $data['gallery_images'];
            $updateData['is_approved'] = true; // Make sure all existing seed companies are approved so they show up

            $employer->update($updateData);
        }
    }
}
