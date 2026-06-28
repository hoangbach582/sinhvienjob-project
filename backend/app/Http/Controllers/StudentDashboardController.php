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

        // Lấy danh sách ứng tuyển
        $applications = Application::where('student_id', $user->id)->get();
        $totalApplications = $applications->count();
        $acceptedApplications = $applications->where('status', 'accepted')->count();

        // Lấy số lượng việc làm đã lưu
        $savedJobsCount = SavedJob::where('student_id', $user->id)->count();

        // Tính tỷ lệ chấp nhận
        $acceptanceRate = $totalApplications > 0 ? round(($acceptedApplications / $totalApplications) * 100) : 0;

        // Lấy 5 ứng tuyển gần nhất
        $recentApplications = Application::with('job.employer.company')
            ->where('student_id', $user->id)
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
