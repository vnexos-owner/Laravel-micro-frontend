<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'code'=> 'MAE101',
                'name'=> 'Toán học cho Kỹ thuật',
            ],
            [
                'code'=> 'PRF192',
                'name'=> 'Cơ sở lập trình',
            ],
            [
                'code'=> 'CEA201',
                'name'=> 'Tổ chức và Kiến trúc máy tính',
            ],
            [
                'code'=> 'CSI104',
                'name'=> 'Nhập môn Khoa học máy tính',
            ],
            [
                'code'=> 'SSL101c',
                'name'=> 'Kỹ năng học tập đại học thành công',
            ],
            [
                'code'=> 'NWC203c',
                'name'=> 'Mạng máy tính',
            ],
            [
                'code'=> 'MAD101',
                'name'=> 'Toán rời rạc',
            ],
            [
                'code'=> 'OSG202',
                'name'=> 'Hệ điều hành',
            ],
            [
                'code'=> 'PRO192',
                'name'=> 'Lập trình hướng đối tượng',
                'prerequisite' => 'PRF192',
            ],
            [
                'code'=> 'SSG104',
                'name'=> 'Kỹ năng giao tiếp và làm việc nhóm',
            ],
            [
                'code'=> 'WED201c',
                'name'=> 'Thiết kế Web',
            ],
            [
                'code'=> 'JPD113',
                'name'=> 'Tiếng Nhật sơ cấp 1-A1.1',
            ],
            [
                'code'=> 'DBI202',
                'name'=> 'Hệ quản trị cơ sở dữ liệu',
            ],
            [
                'code'=> 'CSD201',
                'name'=> 'Cấu trúc dữ liệu và Giải thuật',
                'prerequisite'=> 'PRO192',
            ],
            [
                'code'=> 'LAB211',
                'name'=> 'Thực hành lập trình Java hướng đối tượng',
                'prerequisite'=> 'PRO192',
            ],
            [
                'code'=> 'PRJ201',
                'name'=> 'Phát triển ứng dụng Web với Java',
                'prerequisite'=> 'PRO192 & DBI202',
            ],
            [
                'code'=> 'SWE201c',
                'name'=> 'Nhập môn Kỹ thuật phần mềm',
                'prerequisite'=> 'PRO192',
            ],
            [
                'code'=> 'MAS291',
                'name'=> 'Xác suất Thống kê',
                'prerequisite'=> 'MAE101',
            ],
            [
                'code'=> 'JPD123',
                'name'=> 'Tiếng Nhật sơ cấp 1-A1.2',
                'prerequisite'=> 'JPD113'
            ],
            [
                'code'=> 'IOT102',
                'name'=> 'Internet vạn vật',
            ],
            [
                'code'=> 'ITE302c',
                'name'=> 'Đạo đức trong Công nghệ thông tin',
            ],
            [
                'code'=> 'SWP391',
                'name'=> 'Dự án phát triển phần mềm',
                'prerequisite'=> 'LAB211 & SWE201c',
            ],
            [
                'code'=> 'SWR302',
                'name'=> 'Quản lý yêu cầu phần mềm',
                'prerequisite'=> 'SWE201c',
            ],
            [
                'code'=> 'SWT301',
                'name'=> 'Kiểm thử phần mềm',
                'prerequisite'=> 'SWE201c',
            ],
            [
                'code'=> 'FER201m',
                'name'=> 'Phát triển Front-End với React'
            ],
            [
                'code'=> 'OJT202',
                'name'=> 'Thực tập thực tế tại doanh nghiệp',
            ],
            [
                'code'=> 'ENW492c',
                'name'=> 'Kỹ năng viết tiếng Anh học thuật',
            ],
            [
                'code'=> 'PMG201c',
                'name'=> 'Quản trị dự án',
            ],
            [
                'code'=> 'ISC301',
                'name'=> 'Thương mại điện tử',
            ],
            [
                'code'=> 'SDN301m',
                'name'=> 'Phát triển phía Server với NodeJS, Express và MongoDB',
            ],
            [
                'code'=> 'SWD392',
                'name'=> 'Kiến trúc và Thiết kế phần mềm',
                'prerequisite'=> 'PRO192 & SWE201c',
            ],
            [
                'code'=> 'EXE101',
                'name'=> 'Trải nghiệm khởi nghiệp 1',
            ],
            [
                'code'=> 'EXE201',
                'name'=> 'Trải nghiệm khởi nghiệp 2',
                'prerequisite'=> 'EXE101',
            ],
            [
                'code'=> 'WDP301',
                'name'=> 'Dự án phát triển Web',
                'prerequisite'=> 'FER201m & SDN301m'
            ],
            [
                'code'=> 'PRM392',
                'name'=> 'Lập trình di động',
            ],
            [
                'code'=> 'WDU203c',
                'name'=> 'Thiết kế giao diện và trải nghiệm người dùng (UI/UX)',
            ],
            [
                'code'=> 'MLN111',
                'name'=> 'Triết học Mác - Lênin',
            ],
            [
                'code'=> 'MLN122',
                'name'=> 'Kinh tế chính trị Mác - Lênin',
            ],
            [
                'code'=> 'VNR202',
                'name'=> 'Lịch sử Đảng Cộng sản Việt Nam',
                'prerequisite'=> 'MLN111 & MLN122',
            ],
            [
                'code'=> 'SEP490',
                'name'=> 'Đồ án tốt nghiệp ngành Kỹ thuật phần mềm',
            ],
            [
                'code'=> 'MLN131',
                'name'=> 'Chủ nghĩa xã hội khoa học',
                'prerequisite'=> 'MLN111 & MLN122',
            ],
            [
                'code'=> 'HCM202',
                'name'=> 'Tư tưởng Hồ Chí Minh',
                'prerequisite'=> 'MLN111 & MLN122',
            ]
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate($course);
        }
    }
}
