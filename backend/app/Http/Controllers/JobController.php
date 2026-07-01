<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Application;
use App\Models\StudentProfile;
use App\Models\SavedJob;
use App\Models\User;
use App\Http\Requests\JobRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AdminJobNotification;
use Illuminate\Support\Facades\Auth;

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
    public function getJobDetail(\Illuminate\Http\Request $request, $id)
    {
        $job = Job::with('employer')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Không tìm thấy công việc'], 404);
        }

        $hasApplied = false;
        $isSaved = false;

        // 1. Đọc Token (nếu có) để biết ai đang xem trang này (âm thầm kiểm tra)
        $user = auth('sanctum')->user();

        // 2. Nếu người xem là Sinh viên thì mới đi kiểm tra đơn ứng tuyển & việc làm đã lưu
        if ($user && $user->role === 'student') {
            $studentProfile = StudentProfile::where('user_id', $user->id)->first();
            
            if ($studentProfile) {
                $hasApplied = Application::where('job_id', $id)
                                         ->where('student_id', $studentProfile->id)
                                         ->exists();
                
                $isSaved = SavedJob::where('job_id', $id)
                                         ->where('student_id', $studentProfile->id)
                                         ->exists();
            }
        }

        // 3. Gắn kết quả vào dữ liệu công việc để trả về cho React
        $job->has_applied = $hasApplied;
        $job->is_saved = $isSaved;

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
            }
        }

        // 5. Lọc theo NGÀNH NGHỀ
        if ($request->has('industry') && $request->industry != '') {
            $query->where('industry', $request->industry);
        }

        // 6. Lọc theo KINH NGHIỆM
        if ($request->has('experience') && $request->experience != '') {
            $query->where('experience', $request->experience);
        }
        
        // Trả về danh sách, sắp xếp việc mới nhất lên đầu
        $perPage = $request->input('per_page', 4);
        $jobs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Kiểm tra xem student đã lưu job nào chưa và tính điểm gợi ý
        $user = auth('sanctum')->user();
        if ($user && $user->role === 'student') {
            $studentProfile = StudentProfile::with('skills')->where('user_id', $user->id)->first();
            if ($studentProfile) {
                $savedJobIds = SavedJob::where('student_id', $studentProfile->id)
                                        ->pluck('job_id')
                                        ->toArray();
                
                $studentSkills = $studentProfile->skills->pluck('name')->map(function($skill) {
                    return strtolower(trim($skill));
                })->toArray();
                
                $jobs->getCollection()->transform(function($job) use ($savedJobIds, $studentSkills) {
                    $job->is_saved = in_array($job->id, $savedJobIds);
                    
                    // Recommendation Engine: Tính điểm phù hợp dựa trên kỹ năng
                    $score = 0;
                    if (!empty($studentSkills)) {
                        $jobTitle = strtolower($job->title);
                        $jobDesc = strtolower($job->description ?? '');
                        $jobReq = strtolower($job->requirements ?? '');
                        
                        foreach ($studentSkills as $skill) {
                            if (strpos($jobTitle, $skill) !== false) $score += 3; // Kỹ năng có trong tiêu đề -> điểm cao
                            if (strpos($jobReq, $skill) !== false) $score += 2; // Kỹ năng có trong yêu cầu -> điểm vừa
                            if (strpos($jobDesc, $skill) !== false) $score += 1; // Kỹ năng có trong mô tả -> điểm thấp
                        }
                    }
                    $job->match_score = $score;
                    $job->is_recommended = $score > 0;
                    return $job;
                });

                // Nếu request yêu cầu ưu tiên gợi ý, ta sắp xếp lại danh sách
                if ($request->has('recommended') && $request->recommended == 'true') {
                    $sorted = $jobs->getCollection()->sortByDesc('match_score')->values();
                    $jobs->setCollection($sorted);
                }
            }
        }

        return response()->json($jobs);
    }

    /**
     * GET /api/jobs/recommendations
     * Trả về tối đa 10 việc làm gợi ý cho sinh viên đang đăng nhập.
     * Ưu tiên 1: Dựa trên kỹ năng sinh viên đã thêm vào hồ sơ.
     * Ưu tiên 2 (fallback): Dựa trên lịch sử tìm kiếm được gửi lên từ frontend.
     */
    public function getRecommendations(Request $request)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $studentProfile = StudentProfile::with('skills')->where('user_id', $user->id)->first();
        $studentSkills = [];
        $useSearchHistory = false;

        if ($studentProfile) {
            $studentSkills = $studentProfile->skills->pluck('name')->map(function ($s) {
                return strtolower(trim($s));
            })->toArray();
        }

        // Nếu chưa có kỹ năng, dùng lịch sử tìm kiếm làm fallback
        $searchHistoryKeywords = [];
        if (empty($studentSkills)) {
            $historyRaw = $request->query('search_history', '');
            if (!empty($historyRaw)) {
                $searchHistoryKeywords = array_filter(
                    array_map('trim', explode(',', $historyRaw))
                );
                $useSearchHistory = !empty($searchHistoryKeywords);
            }
        }

        // Nếu không có cả hai -> trả về jobs mới nhất
        if (empty($studentSkills) && empty($searchHistoryKeywords)) {
            $jobs = Job::with('employer')
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($job) {
                    $job->match_score = 0;
                    $job->match_reason = 'latest';
                    return $job;
                });
            return response()->json(['data' => $jobs, 'mode' => 'latest']);
        }

        // Lấy tất cả jobs đang hoạt động
        $allJobs = Job::with('employer')->where('status', 'approved')->get();

        $keywords = !empty($studentSkills) ? $studentSkills : array_map('strtolower', $searchHistoryKeywords);

        $scored = $allJobs->map(function ($job) use ($keywords) {
            $score = 0;
            $jobTitle = strtolower($job->title ?? '');
            $jobDesc  = strtolower($job->description ?? '');
            $jobReq   = strtolower($job->requirements ?? '');

            foreach ($keywords as $kw) {
                if (empty($kw)) continue;
                if (strpos($jobTitle, $kw) !== false) $score += 3;
                if (strpos($jobReq,   $kw) !== false) $score += 2;
                if (strpos($jobDesc,  $kw) !== false) $score += 1;
            }
            $job->match_score = $score;
            return $job;
        })->filter(fn($j) => $j->match_score > 0)
          ->sortByDesc('match_score')
          ->take(10)
          ->values();

        return response()->json([
            'data' => $scored,
            'mode' => $useSearchHistory ? 'search_history' : 'skills',
        ]);
    }

    // ==========================================
    // CÁC HÀM DÀNH CHO NHÀ TUYỂN DỤNG (EMPLOYER)
    // ==========================================

    public function employerIndex(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jobs = Job::where('employer_id', $user->employer->id)
                   ->withCount('applications')
                   ->orderBy('created_at', 'desc')
                   ->paginate(15);

        return response()->json($jobs);
    }

    public function store(JobRequest $request)
    {
        $user = $request->user();
        
        $job = Job::create(array_merge(
            $request->validated(),
            ['employer_id' => $user->employer->id, 'status' => 'pending']
        ));

        // Notify admins
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new AdminJobNotification($job, 'created', $user->employer->company_name));

        return response()->json(['message' => 'Tạo công việc thành công', 'job' => $job], 201);
    }

    public function show(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        // Dùng Policy để check quyền (nếu muốn nhà tuyển dụng chỉ xem đc bài của họ)
        // Gate::authorize('update', $job); // Comment lại nếu muốn ai cũng xem đc

        return response()->json($job);
    }

    public function update(JobRequest $request, $id)
    {
        $job = Job::findOrFail($id);
        
        Gate::authorize('update', $job);

        $data = $request->validated();
        $data['status'] = 'pending';

        $job->update($data);

        // Notify admins
        $user = $request->user();
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new AdminJobNotification($job, 'updated', $user->employer->company_name));

        return response()->json(['message' => 'Cập nhật công việc thành công', 'job' => $job]);
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);

        Gate::authorize('delete', $job);

        $job->delete();

        return response()->json(['message' => 'Đã xóa công việc thành công']);
    }

    public function employerStats(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employerId = $user->employer->id;
        
        $totalJobs = Job::where('employer_id', $employerId)->count();
        $totalApplications = Application::whereHas('job', function($q) use ($employerId) {
            $q->where('employer_id', $employerId);
        })->count();

        return response()->json([
            'total_jobs' => $totalJobs,
            'total_applications' => $totalApplications
        ]);
    }

    public function getJobApplicants(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        Gate::authorize('viewApplications', $job);

        $applications = Application::where('job_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()->map(function($app) {
                $studentProfile = StudentProfile::find($app->student_id);
                $user = \App\Models\User::find($studentProfile->user_id);
                $app->student_name = $studentProfile->full_name ?? $user->name;
                $app->student_email = $user->email;
                return $app;
            });

        return response()->json($applications);
    }

    public function getCategories()
    {
        return response()->json([
            'internship' => 'Thực tập sinh (Internship)',
            'part_time' => 'Bán thời gian (Part-time)',
            'full_time' => 'Toàn thời gian (Full-time)',
            'collaborator' => 'Cộng tác viên (CTV)'
        ]);
    }

    public function getIndustries()
    {
        $industries = \App\Models\Industry::where('is_active', true)
                        ->orderBy('name', 'asc')
                        ->get(['id', 'name']);
        return response()->json($industries);
    }
}
