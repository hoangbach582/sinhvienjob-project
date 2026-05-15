<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DashboardSummaryExport;
use App\Exports\TopStudentsExport;
use App\Exports\ApplicationsByIndustryExport;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminReportController extends Controller
{
    /**
     * Lấy tất cả thông số và dữ liệu biểu đồ cho Dashboard
     */
    public function getDashboardStats(Request $request)
    {
        $range = $request->query('range', 'month'); // today, week, month, 3months, 6months, custom
        $startDate = $this->getStartDate($range, $request);
        $endDate = $request->query('end_date') ? Carbon::parse($request->query('end_date'))->endOfDay() : Carbon::now();

        // 1. Thẻ thống kê tổng quan (Cards)
        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_employers' => User::where('role', 'employer')->count(),
            'total_jobs' => Job::whereBetween('created_at', [$startDate, $endDate])->count(),
            'approved_jobs' => Job::where('status', 'approved')->whereBetween('created_at', [$startDate, $endDate])->count(),
            'total_applications' => Application::whereBetween('created_at', [$startDate, $endDate])->count(),
            'total_hired' => Application::where('status', 'accepted')->whereBetween('created_at', [$startDate, $endDate])->count(),
        ];

        // Tỷ lệ duyệt và tỷ lệ chuyển đổi
        $stats['approval_rate'] = $stats['total_jobs'] > 0 ? round(($stats['approved_jobs'] / $stats['total_jobs']) * 100, 2) : 0;
        $stats['conversion_rate'] = $stats['total_applications'] > 0 ? round(($stats['total_hired'] / $stats['total_applications']) * 100, 2) : 0;

        // 2. So sánh tháng này vs tháng trước
        $monthComparison = $this->getMonthComparisonData();

        // 3. Xu hướng 6-12 tháng gần nhất (Jobs & Applications)
        $trends = $this->getTrendsData();

        // 4. Phân tích theo ngành nghề & khu vực
        $byIndustry = $this->getApplicationsByIndustryData($startDate, $endDate);
        $byLocation = $this->getApplicationsByLocationData($startDate, $endDate);
        $byJobType = $this->getJobTypeDistribution($startDate, $endDate);

        // 5. Xếp hạng
        $topCompanies = $this->getTopCompaniesData(5);
        $topStudents = $this->getTopStudentsData(10);

        return response()->json([
            'success' => true,
            'data' => [
                'overview' => $stats,
                'month_comparison' => $monthComparison,
                'trends' => $trends,
                'by_industry' => $byIndustry,
                'by_location' => $byLocation,
                'by_job_type' => $byJobType,
                'top_companies' => $topCompanies,
                'top_students' => $topStudents
            ]
        ]);
    }

    private function getStartDate($range, $request)
    {
        switch ($range) {
            case 'today': return Carbon::today();
            case 'week': return Carbon::now()->startOfWeek();
            case 'month': return Carbon::now()->startOfMonth();
            case '3months': return Carbon::now()->subMonths(3)->startOfMonth();
            case '6months': return Carbon::now()->subMonths(6)->startOfMonth();
            case 'custom': return $request->query('start_date') ? Carbon::parse($request->query('start_date')) : Carbon::now()->subMonth();
            default: return Carbon::now()->startOfMonth();
        }
    }

    private function getMonthComparisonData()
    {
        $thisMonthStart = Carbon::now()->startOfMonth();
        $thisMonthEnd = Carbon::now()->endOfMonth();
        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $metrics = ['jobs', 'applications', 'approved', 'hired'];
        $data = [];

        foreach ($metrics as $metric) {
            $currentCount = 0;
            $lastCount = 0;

            switch ($metric) {
                case 'jobs':
                    $currentCount = Job::whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])->count();
                    $lastCount = Job::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
                    break;
                case 'applications':
                    $currentCount = Application::whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])->count();
                    $lastCount = Application::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
                    break;
                case 'approved':
                    $currentCount = Job::where('status', 'approved')->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])->count();
                    $lastCount = Job::where('status', 'approved')->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
                    break;
                case 'hired':
                    $currentCount = Application::where('status', 'accepted')->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])->count();
                    $lastCount = Application::where('status', 'accepted')->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
                    break;
            }

            $data[] = [
                'name' => ucfirst($metric),
                'current' => $currentCount,
                'previous' => $lastCount,
                'growth' => $lastCount > 0 ? round((($currentCount - $lastCount) / $lastCount) * 100, 2) : 100
            ];
        }

        return $data;
    }

    private function getTrendsData()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M Y'),
                'raw_month' => $date->format('Y-m'),
            ];
        }

        $trends = [];
        foreach ($months as $m) {
            $start = Carbon::parse($m['raw_month'])->startOfMonth();
            $end = Carbon::parse($m['raw_month'])->endOfMonth();

            $trends[] = [
                'name' => $m['month'],
                'jobs' => Job::whereBetween('created_at', [$start, $end])->count(),
                'applications' => Application::whereBetween('created_at', [$start, $end])->count(),
            ];
        }

        return $trends;
    }

    private function getApplicationsByIndustryData($startDate, $endDate)
    {
        return Job::select('industry', DB::raw('count(*) as count'))
            ->whereNotNull('industry')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('industry')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();
    }

    private function getApplicationsByLocationData($startDate, $endDate)
    {
        return Job::select('location', DB::raw('count(*) as count'))
            ->whereNotNull('location')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->limit(8)
            ->get();
    }

    private function getJobTypeDistribution($startDate, $endDate)
    {
        return Job::select('type', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $this->formatJobType($item->type),
                    'value' => $item->count
                ];
            });
    }

    private function formatJobType($type)
    {
        switch ($type) {
            case 'full_time': return 'Full-time';
            case 'part_time': return 'Part-time';
            case 'internship': return 'Internship';
            default: return $type;
        }
    }

    private function getTopCompaniesData($limit)
    {
        return Employer::select('employers.company_name', DB::raw('count(jobs.id) as jobs_count'))
            ->join('jobs', 'employers.id', '=', 'jobs.employer_id')
            ->groupBy('employers.id', 'employers.company_name')
            ->orderBy('jobs_count', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getTopStudentsData($limit)
    {
        return DB::table('student_profiles')
            ->join('users', 'student_profiles.user_id', '=', 'users.id')
            ->select(
                'student_profiles.id',
                'student_profiles.full_name',
                DB::raw('count(applications.id) as app_count'),
                DB::raw('sum(case when applications.status = "accepted" then 1 else 0 end) as hired_count')
            )
            ->leftJoin('applications', 'student_profiles.id', '=', 'applications.student_id')
            ->groupBy('student_profiles.id', 'student_profiles.full_name')
            ->orderBy('app_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($student) {
                $student->hired_rate = $student->app_count > 0 ? round(($student->hired_count / $student->app_count) * 100, 2) : 0;
                return $student;
            });
    }

    /**
     * Xuất báo cáo (Excel / PDF)
     */
    public function exportReport(Request $request)
    {
        $type = $request->query('type', 'excel'); // excel, pdf
        $reportName = $request->query('report', 'dashboard_summary'); // dashboard_summary, top_students, industry_analysis

        $range = $request->query('range', 'month');
        $startDate = $this->getStartDate($range, $request);
        $endDate = $request->query('end_date') ? Carbon::parse($request->query('end_date'))->endOfDay() : Carbon::now();

        if ($type === 'excel') {
            switch ($reportName) {
                case 'top_students':
                    return Excel::download(new TopStudentsExport($startDate, $endDate), 'top_students.xlsx');
                case 'industry_analysis':
                    return Excel::download(new ApplicationsByIndustryExport($startDate, $endDate), 'industry_analysis.xlsx');
                default:
                    return Excel::download(new DashboardSummaryExport($startDate, $endDate), 'dashboard_summary.xlsx');
            }
        } else {
            // PDF Export logic
            $data = $this->getDashboardStatsData($startDate, $endDate);
            $pdf = Pdf::loadView('reports.dashboard_pdf', $data);
            return $pdf->download('admin_report.pdf');
        }
    }

    private function getDashboardStatsData($startDate, $endDate)
    {
        // Similar to getDashboardStats but returns raw data for PDF view
        return [
            'overview' => [
                'total_jobs' => Job::whereBetween('created_at', [$startDate, $endDate])->count(),
                'total_applications' => Application::whereBetween('created_at', [$startDate, $endDate])->count(),
                'total_hired' => Application::where('status', 'accepted')->whereBetween('created_at', [$startDate, $endDate])->count(),
            ],
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'generated_at' => Carbon::now()->toDateTimeString()
        ];
    }
}
