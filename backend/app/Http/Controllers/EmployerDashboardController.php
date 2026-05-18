<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Application;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EmployerDashboardController extends Controller
{
    /**
     * Lấy các chỉ số thống kê tổng quan cho Dashboard
     */
    public function stats(Request $request)
    {
        $employerId = $request->user()->employer->id;
        
        // 1. Số tin đang hoạt động (Được duyệt và chưa hết hạn)
        $activeJobsCount = Job::where('employer_id', $employerId)
            ->where('status', 'approved')
            ->where(function ($query) {
                $query->whereNull('deadline')
                      ->orWhere('deadline', '>=', now());
            })->count();

        // 2. Số tin chờ phê duyệt
        $pendingJobsCount = Job::where('employer_id', $employerId)
            ->where('status', 'pending')
            ->count();

        // 3. Tổng hồ sơ nhận được
        $totalApplications = Application::whereHas('job', function($q) use ($employerId) {
            $q->where('employer_id', $employerId);
        })->count();

        // 4. Hồ sơ tháng này
        $monthlyApplications = Application::whereHas('job', function($q) use ($employerId) {
            $q->where('employer_id', $employerId);
        })->whereMonth('created_at', now()->month)
          ->whereYear('created_at', now()->year)
          ->count();

        // 5. Biểu đồ xu hướng (7 ngày gần nhất)
        $sevenDaysAgo = now()->subDays(6)->startOfDay();
        $applicationsTrend = Application::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->whereHas('job', function($q) use ($employerId) {
                $q->where('employer_id', $employerId);
            })
            ->where('created_at', '>=', $sevenDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get()
            ->keyBy('date');

        // Tạo mảng 7 ngày liên tục kể cả những ngày không có hồ sơ
        $chartTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateString = $date->format('Y-m-d');
            $label = "T" . ($date->dayOfWeek + 1 == 1 ? "CN" : ($date->dayOfWeek + 1)) . " " . $date->format('d/m');
            
            $chartTrend[] = [
                'label' => $label,
                'count' => isset($applicationsTrend[$dateString]) ? $applicationsTrend[$dateString]->count : 0
            ];
        }

        // 6. Biểu đồ loại hình công việc (Pie chart)
        $jobTypeBreakdown = Job::select('type', DB::raw('COUNT(applications.id) as count'))
            ->leftJoin('applications', 'jobs.id', '=', 'applications.job_id')
            ->where('jobs.employer_id', $employerId)
            ->groupBy('jobs.type')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'active_jobs' => [
                    'value' => $activeJobsCount,
                    'trend' => 0, // Trend sẽ được bổ sung sau nếu cần so sánh với tháng trước
                    'trendUp' => true
                ],
                'pending_jobs' => [
                    'value' => $pendingJobsCount,
                    'trend' => 0,
                    'trendUp' => false
                ],
                'total_applications' => [
                    'value' => $totalApplications,
                    'trend' => 0,
                    'trendUp' => true
                ],
                'monthly_applications' => [
                    'value' => $monthlyApplications,
                    'trend' => 0,
                    'trendUp' => true
                ],
                'chart_trend' => $chartTrend,
                'chart_job_type' => $jobTypeBreakdown
            ]
        ]);
    }

    /**
     * Lấy danh sách tin tuyển dụng gần đây (tối đa 5 tin)
     */
    public function recentJobs(Request $request)
    {
        $employerId = $request->user()->employer->id;

        $jobs = Job::where('employer_id', $employerId)
            ->withCount('applications')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    /**
     * Lấy danh sách các hoạt động ứng tuyển gần đây (tối đa 5 hoạt động)
     */
    public function recentApplications(Request $request)
    {
        $employerId = $request->user()->employer->id;

        $applications = Application::with(['job:id,title', 'student.user:id,name'])
            ->whereHas('job', function($q) use ($employerId) {
                $q->where('employer_id', $employerId);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Chuyển đổi định dạng cho phù hợp với ActivityFeed bên frontend
        $activities = $applications->map(function ($app) {
            $studentName = $app->student->user->name ?? 'Một ứng viên';
            $jobTitle = $app->job->title ?? 'vị trí không xác định';
            
            // Nếu status là pending -> mới nộp
            // Nếu status là hired -> đã tuyển
            // Các status khác như rejected
            $type = 'new_application';
            $message = "{$studentName} vừa nộp hồ sơ vào vị trí {$jobTitle}";

            if ($app->status == 'hired') {
                $type = 'application_hired';
                $message = "Bạn đã đánh dấu {$studentName} là \"Đã tuyển\" cho vị trí {$jobTitle}";
            } elseif ($app->status == 'rejected') {
                $type = 'default';
                $message = "Bạn đã từ chối hồ sơ của {$studentName} cho vị trí {$jobTitle}";
            }

            return [
                'id' => $app->id,
                'type' => $type,
                'message' => $message,
                'time' => $app->created_at->toISOString(),
            ];
        });

        // Bổ sung các hoạt động về tin tuyển dụng (nếu cần thiết, hoặc chỉ hiện ứng tuyển)
        // Hiện tại trả về danh sách ứng tuyển để làm activity
        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }
}
