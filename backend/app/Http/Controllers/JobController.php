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
    /**
     * LẤY DANH SÁCH CÔNG VIỆC MỚI NHẤT (Cho Trang Chủ)
     * API: GET /api/jobs/latest
     */
    public function getLatestJobs()
    {
        // with('employer') giúp join bảng (Eager Loading) để lấy luôn thông tin công ty thay vì chỉ lấy ID khô khan
        $jobs = Job::with('employer')
                    ->where('status', 'approved') // Chỉ lấy những bài đăng đã được Admin duyệt
                    ->orderBy('created_at', 'desc') // Sắp xếp theo thời gian tạo, mới nhất lên đầu
                    ->take(10) // Lấy tối đa 10 công việc để hiển thị trên trang chủ
                    ->get();

        return response()->json($jobs);
    }

    /**
     * LẤY CHI TIẾT 1 CÔNG VIỆC
     * API: GET /api/jobs/{id}
     */
    public function getJobDetail(\Illuminate\Http\Request $request, $id)
    {
        // Tìm công việc theo ID kèm thông tin công ty
        $job = Job::with('employer')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Không tìm thấy công việc'], 404);
        }

        // Cờ trạng thái: Đã ứng tuyển chưa? Đã lưu chưa?
        $hasApplied = false;
        $isSaved = false;

        // 1. Đọc Token (nếu có) để biết ai đang xem trang này (kiểm tra âm thầm không bắt buộc đăng nhập)
        $user = auth('sanctum')->user();

        // 2. Nếu người xem là Sinh viên thì mới đi kiểm tra đơn ứng tuyển & việc làm đã lưu
        if ($user && $user->role === 'student') {
            $studentProfile = StudentProfile::where('user_id', $user->id)->first();
            
            if ($studentProfile) {
                // Kiểm tra xem sinh viên này đã nộp đơn cho job này chưa (chỉ tính đơn active)
                $hasApplied = Application::where('job_id', $id)
                                         ->where('student_id', $studentProfile->id)
                                         ->where(function ($q) {
                                             $thirtyDaysAgo = now()->subDays(30);
                                             $q->whereNotIn('status', ['withdrawn', 'rejected'])
                                               ->orWhere(function ($q2) use ($thirtyDaysAgo) {
                                                   $q2->where('status', 'rejected')
                                                      ->where('updated_at', '>=', $thirtyDaysAgo);
                                               });
                                         })
                                         ->exists();
                
                // Kiểm tra xem sinh viên này có lưu job này vào danh sách yêu thích chưa
                $isSaved = SavedJob::where('job_id', $id)
                                         ->where('student_id', $studentProfile->id)
                                         ->exists();
            }
        }

        // 3. Gắn kết quả vào dữ liệu công việc để trả về cho Frontend React hiển thị nút phù hợp
        $job->has_applied = $hasApplied;
        $job->is_saved = $isSaved;

        return response()->json($job);
    }

    /**
     * LẤY DANH SÁCH CÔNG VIỆC VÀ TÌM KIẾM CÓ LỌC (Trang Tìm Kiếm)
     * API: GET /api/jobs
     */
    public function index(\Illuminate\Http\Request $request)
    {
        // Bắt đầu câu truy vấn: Chỉ lấy các công việc đã được duyệt, kèm thông tin công ty
        $query = Job::with('employer')->where('status', 'approved');

        // 1. Lọc theo TỪ KHÓA (Tìm trong Tên công việc hoặc Tên công ty)
        if ($request->has('keyword') && $request->keyword != '') {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'LIKE', '%' . $keyword . '%') // Tìm theo tên công việc
                  ->orWhereHas('employer', function($q2) use ($keyword) { // Tìm theo tên công ty thông qua relationship
                      $q2->where('company_name', 'LIKE', '%' . $keyword . '%');
                  });
            });
        }

        // 2. Lọc theo ĐỊA ĐIỂM (Ví dụ: Hà Nội, Hồ Chí Minh)
        if ($request->has('location') && $request->location != '') {
            $query->where('location', 'LIKE', '%' . $request->location . '%');
        }

        // 3. Lọc theo HÌNH THỨC làm việc (Full-time, Part-time...)
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // 4. Lọc theo MỨC LƯƠNG (Logic kiểm tra khoảng giao nhau)
        if ($request->has('salary') && $request->salary != '') {
            $salary = $request->salary;
            if ($salary === 'under_3') {
                $query->where('salary_min', '<', 3000000); // Dưới 3 triệu
            } elseif ($salary === '3_to_5') {
                $query->where('salary_max', '>=', 3000000)->where('salary_min', '<=', 5000000); // Từ 3 đến 5 triệu
            } elseif ($salary === '5_to_10') {
                $query->where('salary_max', '>=', 5000000)->where('salary_min', '<=', 10000000); // Từ 5 đến 10 triệu
            }
        }

        // 5. Lọc theo NGÀNH NGHỀ (ID ngành nghề)
        if ($request->has('industry') && $request->industry != '') {
            $query->where('industry', $request->industry);
        }

        // 6. Lọc theo KINH NGHIỆM yêu cầu
        if ($request->has('experience') && $request->experience != '') {
            $query->where('experience', $request->experience);
        }
        
        // Trả về danh sách phân trang (Mặc định 4 kết quả 1 trang), sắp xếp việc mới nhất lên đầu
        $perPage = $request->input('per_page', 4);
        $jobs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // --- PHẦN LOGIC THÊM: GỢI Ý CÔNG VIỆC DỰA TRÊN KỸ NĂNG ---
        // Kiểm tra xem sinh viên có đang đăng nhập không
        $user = auth('sanctum')->user();
        if ($user && $user->role === 'student') {
            // Lấy hồ sơ và danh sách kỹ năng của sinh viên (Eager load 'skills')
            $studentProfile = StudentProfile::with('skills')->where('user_id', $user->id)->first();
            if ($studentProfile) {
                // Lấy mảng ID các công việc mà sinh viên đã lưu
                $savedJobIds = SavedJob::where('student_id', $studentProfile->id)
                                        ->pluck('job_id')
                                        ->toArray();
                
                // Chuẩn hóa danh sách kỹ năng của sinh viên (viết thường, bỏ khoảng trắng thừa)
                $studentSkills = $studentProfile->skills->pluck('name')->map(function($skill) {
                    return strtolower(trim($skill));
                })->toArray();
                
                // Lặp qua từng công việc trong kết quả truy vấn để chấm điểm
                $jobs->getCollection()->transform(function($job) use ($savedJobIds, $studentSkills) {
                    // Đánh dấu nếu job này nằm trong danh sách đã lưu
                    $job->is_saved = in_array($job->id, $savedJobIds);
                    
                    // Thuật toán Recommendation Engine (Chấm điểm phù hợp)
                    $score = 0;
                    if (!empty($studentSkills)) {
                        $jobTitle = strtolower($job->title);
                        $jobDesc = strtolower($job->description ?? '');
                        $jobReq = strtolower($job->requirements ?? '');
                        
                        foreach ($studentSkills as $skill) {
                            if (strpos($jobTitle, $skill) !== false) $score += 3; // Kỹ năng xuất hiện ở Tiêu đề -> Trọng số cao nhất (+3)
                            if (strpos($jobReq, $skill) !== false) $score += 2; // Kỹ năng xuất hiện ở Yêu cầu -> Trọng số vừa (+2)
                            if (strpos($jobDesc, $skill) !== false) $score += 1; // Kỹ năng xuất hiện ở Mô tả chung -> Trọng số thấp (+1)
                        }
                    }
                    $job->match_score = $score; // Gắn điểm vào Job
                    $job->is_recommended = $score > 0; // Đánh dấu là công việc được gợi ý nếu có điểm > 0
                    return $job;
                });

                // Nếu request yêu cầu sắp xếp theo độ phù hợp thay vì thời gian mới nhất
                if ($request->has('recommended') && $request->recommended == 'true') {
                    // Sắp xếp lại Collection theo điểm giảm dần
                    $sorted = $jobs->getCollection()->sortByDesc('match_score')->values();
                    $jobs->setCollection($sorted);
                }
            }
        }

        return response()->json($jobs);
    }

    /**
     * LẤY DANH SÁCH GỢI Ý CÔNG VIỆC TRÊN TRANG CHỦ (Dành riêng cho Sinh Viên)
     * API: GET /api/jobs/recommendations
     * Thuật toán: 
     * - Ưu tiên 1: Dựa trên kỹ năng sinh viên đã thêm vào hồ sơ.
     * - Ưu tiên 2 (fallback): Dựa trên lịch sử tìm kiếm được gửi lên từ Frontend (Local Storage).
     */
    public function getRecommendations(Request $request)
    {
        $user = auth('sanctum')->user();

        // Chỉ sinh viên mới xem được gợi ý cá nhân hóa
        if (!$user || $user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $studentProfile = StudentProfile::with('skills')->where('user_id', $user->id)->first();
        $studentSkills = [];
        $useSearchHistory = false;

        // Lấy danh sách kỹ năng thực tế của sinh viên
        if ($studentProfile) {
            $studentSkills = $studentProfile->skills->pluck('name')->map(function ($s) {
                return strtolower(trim($s));
            })->toArray();
        }

        // Nếu sinh viên chưa khai báo kỹ năng nào, dùng lịch sử tìm kiếm làm dự phòng (fallback)
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

        // Nếu không có cả kỹ năng lẫn lịch sử tìm kiếm -> trả về ngẫu nhiên các việc mới nhất
        if (empty($studentSkills) && empty($searchHistoryKeywords)) {
            $jobs = Job::with('employer')
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($job) {
                    $job->match_score = 0;
                    $job->match_reason = 'latest'; // Báo cho FE biết đây chỉ là việc mới nhất
                    return $job;
                });
            return response()->json(['data' => $jobs, 'mode' => 'latest']);
        }

        // Nếu có tiêu chí (kỹ năng hoặc lịch sử), lấy tất cả jobs ra để chấm điểm
        $allJobs = Job::with('employer')->where('status', 'approved')->get();

        // Chọn mảng từ khóa để chấm điểm (Ưu tiên kỹ năng, nếu không có mới dùng lịch sử)
        $keywords = !empty($studentSkills) ? $studentSkills : array_map('strtolower', $searchHistoryKeywords);

        // Chấm điểm từng job
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
        })->filter(fn($j) => $j->match_score > 0) // Lọc bỏ những job 0 điểm (không liên quan)
          ->sortByDesc('match_score') // Xếp hạng điểm cao xuống thấp
          ->take(10) // Lấy top 10 gợi ý tốt nhất
          ->values();

        return response()->json([
            'data' => $scored,
            'mode' => $useSearchHistory ? 'search_history' : 'skills', // Thông báo cho FE biết nguồn gợi ý
        ]);
    }

    // ==========================================
    // CÁC HÀM DÀNH CHO NHÀ TUYỂN DỤNG (EMPLOYER)
    // ==========================================

    /**
     * LẤY DANH SÁCH CÔNG VIỆC CỦA CHÍNH NHÀ TUYỂN DỤNG ĐÓ
     * API: GET /api/employer/jobs
     */
    public function employerIndex(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Lấy việc của đúng công ty này, kèm theo số lượng người đã ứng tuyển (withCount)
        $jobs = Job::where('employer_id', $user->employer->id)
                   ->withCount('applications')
                   ->orderBy('created_at', 'desc')
                   ->paginate(15);

        return response()->json($jobs);
    }

    /**
     * TẠO CÔNG VIỆC MỚI (Đăng tin tuyển dụng)
     * API: POST /api/jobs
     */
    public function store(JobRequest $request)
    {
        $user = $request->user();
        
        // Tạo job với status mặc định là 'pending' (Chờ Admin duyệt)
        $job = Job::create(array_merge(
            $request->validated(),
            ['employer_id' => $user->employer->id, 'status' => 'pending']
        ));

        // Thông báo cho tất cả Admin biết có tin mới cần duyệt (Gửi Notification)
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new AdminJobNotification($job, 'created', $user->employer->company_name));

        return response()->json(['message' => 'Tạo công việc thành công', 'job' => $job], 201);
    }

    /**
     * XEM CHI TIẾT CÔNG VIỆC TRONG DASHBOARD
     */
    public function show(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        // Dùng Policy để check quyền (nếu muốn nhà tuyển dụng chỉ xem đc bài của họ)
        // Gate::authorize('update', $job); // Comment lại nếu muốn ai cũng xem đc

        return response()->json($job);
    }

    /**
     * CẬP NHẬT CÔNG VIỆC
     * API: PUT /api/jobs/{id}
     */
    public function update(JobRequest $request, $id)
    {
        $job = Job::findOrFail($id);
        
        // Kiểm tra quyền: Chỉ chủ sở hữu bài đăng mới được sửa
        Gate::authorize('update', $job);

        $data = $request->validated();
        // Sau khi sửa, bài đăng sẽ quay về trạng thái 'pending' chờ duyệt lại
        $data['status'] = 'pending';

        $job->update($data);

        // Báo cho Admin biết bài đăng vừa bị sửa đổi
        $user = $request->user();
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new AdminJobNotification($job, 'updated', $user->employer->company_name));

        return response()->json(['message' => 'Cập nhật công việc thành công', 'job' => $job]);
    }

    /**
     * XÓA CÔNG VIỆC
     * API: DELETE /api/jobs/{id}
     */
    public function destroy($id)
    {
        $job = Job::findOrFail($id);

        // Kiểm tra quyền xóa
        Gate::authorize('delete', $job);

        $job->delete();

        return response()->json(['message' => 'Đã xóa công việc thành công']);
    }

    /**
     * LẤY SỐ LIỆU THỐNG KÊ NHANH CHO DASHBOARD NHÀ TUYỂN DỤNG
     */
    public function employerStats(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employerId = $user->employer->id;
        
        // Đếm tổng số việc làm đã đăng
        $totalJobs = Job::where('employer_id', $employerId)->count();
        // Đếm tổng số CV đã nộp vào tất cả các việc làm của công ty này
        $totalApplications = Application::whereHas('job', function($q) use ($employerId) {
            $q->where('employer_id', $employerId);
        })->count();

        return response()->json([
            'total_jobs' => $totalJobs,
            'total_applications' => $totalApplications
        ]);
    }

    /**
     * XEM DANH SÁCH ỨNG VIÊN ĐÃ NỘP VÀO 1 CÔNG VIỆC CỤ THỂ
     */
    public function getJobApplicants(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        // Kiểm tra quyền xem danh sách (phải là chủ job)
        Gate::authorize('viewApplications', $job);

        // Lấy danh sách CV và map thông tin ứng viên từ bảng StudentProfile và User
        $applications = Application::where('job_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()->map(function($app) {
                $studentProfile = StudentProfile::find($app->student_id);
                $user = \App\Models\User::find($studentProfile->user_id);
                // Lấy tên sinh viên, nếu profile chưa có tên thì lấy tên mặc định từ User
                $app->student_name = $studentProfile->full_name ?? $user->name;
                $app->student_email = $user->email;
                return $app;
            });

        return response()->json($applications);
    }

    /**
     * TỪ ĐIỂN DANH MỤC HÌNH THỨC LÀM VIỆC (Dùng cho Dropdown)
     */
    public function getCategories()
    {
        return response()->json([
            'internship' => 'Thực tập sinh (Internship)',
            'part_time' => 'Bán thời gian (Part-time)',
            'full_time' => 'Toàn thời gian (Full-time)',
            'collaborator' => 'Cộng tác viên (CTV)'
        ]);
    }

    /**
     * TỪ ĐIỂN NGÀNH NGHỀ TỪ DATABASE (Dùng cho Dropdown)
     */
    public function getIndustries()
    {
        $industries = \App\Models\Industry::where('is_active', true)
                        ->orderBy('name', 'asc')
                        ->get(['id', 'name']);
        return response()->json($industries);
    }
}
