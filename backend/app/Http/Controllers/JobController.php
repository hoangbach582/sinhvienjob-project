<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Application;
use App\Models\StudentProfile;

class JobController extends Controller
{
    // Hàm lấy danh sách công việc mới nhất cho Trang Chủ
    public function getLatestJobs()
    {
        // with('employer') giúp lấy luôn tên công ty thay vì chỉ lấy cái ID khô khan
        $jobs = Job::with('employer')
                    ->where('status', 'approved') // Chỉ lấy job đã duyệt
                    ->orderBy('created_at', 'desc') // Sắp xếp mới nhất lên đầu
                    ->take(10) // Lấy tối đa 10 job
                    ->get();

        return response()->json($jobs);
    }

    // Lấy chi tiết 1 công việc theo ID
    // Thêm chữ Request $request vào trong ngoặc
    public function getJobDetail(\Illuminate\Http\Request $request, $id)
    {
        $job = Job::with('employer')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Không tìm thấy công việc'], 404);
        }

        $hasApplied = false;

        // 1. Đọc Token (nếu có) để biết ai đang xem trang này (âm thầm kiểm tra)
        $user = auth('sanctum')->user();

        // 2. Nếu người xem là Sinh viên thì mới đi kiểm tra đơn ứng tuyển
        if ($user && $user->role === 'student') {
            $studentProfile = \App\Models\StudentProfile::where('user_id', $user->id)->first();
            
            if ($studentProfile) {
                $hasApplied = \App\Models\Application::where('job_id', $id)
                                         ->where('student_id', $studentProfile->id)
                                         ->exists();
            }
        }

        // 3. Gắn kết quả vào dữ liệu công việc để trả về cho React
        $job->has_applied = $hasApplied;

        return response()->json($job);
    }

    public function index(\Illuminate\Http\Request $request)
    {
        // Bắt đầu câu truy vấn: Lấy các công việc đã được duyệt, kèm thông tin công ty
        $query = Job::with('employer')->where('status', 'approved');

        // 1. Lọc theo TỪ KHÓA (Tìm trong Tên công việc hoặc Tên công ty)
        if ($request->has('keyword') && $request->keyword != '') {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'LIKE', '%' . $keyword . '%')
                  ->orWhereHas('employer', function($q2) use ($keyword) {
                      $q2->where('company_name', 'LIKE', '%' . $keyword . '%');
                  });
            });
        }

        // 2. Lọc theo ĐỊA ĐIỂM
        if ($request->has('location') && $request->location != '') {
            $query->where('location', 'LIKE', '%' . $request->location . '%');
        }

        // 3. Lọc theo HÌNH THỨC
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // 4. Lọc theo MỨC LƯƠNG (Logic kiểm tra khoảng giao nhau)
        if ($request->has('salary') && $request->salary != '') {
            $salary = $request->salary;
            if ($salary === 'under_3') {
                $query->where('salary_min', '<', 3000000);
            } elseif ($salary === '3_to_5') {
                $query->where('salary_max', '>=', 3000000)->where('salary_min', '<=', 5000000);
            } elseif ($salary === '5_to_10') {
                $query->where('salary_max', '>=', 5000000)->where('salary_min', '<=', 10000000);
            } elseif ($salary === 'over_10') {
                $query->where('salary_min', '>', 10000000);
            }
        }
        // Trả về danh sách, sắp xếp việc mới nhất lên đầu
        $jobs = $query->orderBy('created_at', 'desc')->get();

        return response()->json($jobs);
    }
}
