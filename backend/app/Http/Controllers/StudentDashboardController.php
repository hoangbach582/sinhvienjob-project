<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\SavedJob;
use App\Models\Job;

class StudentDashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();

        // Lấy profile của sinh viên
        $studentProfile = \App\Models\StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json([
                'total_applications' => 0,
                'accepted_applications' => 0,
                'acceptance_rate' => 0,
                'saved_jobs_count' => 0,
                'recent_applications' => [],
            ]);
        }

        // Lấy danh sách ứng tuyển
        $applications = Application::where('student_id', $studentProfile->id)->get();
        $totalApplications = $applications->count();
        $acceptedApplications = $applications->where('status', 'accepted')->count();

        // Lấy số lượng việc làm đã lưu
        $savedJobsCount = SavedJob::where('student_id', $studentProfile->id)->count();

        // Tính tỷ lệ chấp nhận
        $acceptanceRate = $totalApplications > 0 ? round(($acceptedApplications / $totalApplications) * 100) : 0;

        // Lấy 5 ứng tuyển gần nhất
        $recentApplications = Application::with('job.employer')
            ->where('student_id', $studentProfile->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'total_applications' => $totalApplications,
            'accepted_applications' => $acceptedApplications,
            'acceptance_rate' => $acceptanceRate,
            'saved_jobs_count' => $savedJobsCount,
            'recent_applications' => $recentApplications,
        ]);
    }
}
