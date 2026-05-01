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
}
