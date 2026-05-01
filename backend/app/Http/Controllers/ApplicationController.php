<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application; // Import model Application
use App\Models\StudentProfile; // Import model StudentProfile

class ApplicationController extends Controller
{
    public function apply(Request $request, $jobId)
    {
        // 1. Lấy thông tin user hiện tại từ Token
        $user = $request->user();

        // 2. Chặn nếu không phải sinh viên
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ tài khoản Sinh viên mới có quyền ứng tuyển!'], 403);
        }

        // 3. Tìm hồ sơ sinh viên TRÙNG KHỚP với tài khoản đang đăng nhập
        $studentProfile = StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ sinh viên của bạn!'], 400);
        }

        // 4. Kiểm tra xem sinh viên này đã nộp đơn vào công việc này chưa?
        $exists = Application::where('job_id', $jobId)
                             ->where('student_id', $studentProfile->id)
                             ->first();

        if ($exists) {
            return response()->json(['message' => 'Bạn đã nộp CV cho công việc này rồi!'], 400);
        }

        // 5. Lưu vào Database với ĐÚNG id của sinh viên
        $application = Application::create([
            'job_id' => $jobId,
            'student_id' => $studentProfile->id,
            'cv_url' => 'https://example.com/cv-mac-dinh.pdf', 
            'status' => 'pending' 
        ]);

        return response()->json([
            'message' => '🎉 Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ với bạn.'
        ], 200);
    }

    // Lấy danh sách việc làm đã ứng tuyển của sinh viên đang đăng nhập
    public function getAppliedJobs(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ sinh viên mới xem được lịch sử ứng tuyển!'], 403);
        }

        $studentProfile = StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ sinh viên!'], 400);
        }

        // Lấy toàn bộ đơn ứng tuyển, kèm theo thông tin Job và Employer tương ứng
        $applications = Application::with(['job.employer'])
                                   ->where('student_id', $studentProfile->id)
                                   ->orderBy('applied_at', 'desc') // Sắp xếp cái mới nhất lên đầu
                                   ->get();

        return response()->json($applications);
    }
}