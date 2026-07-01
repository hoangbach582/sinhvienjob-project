<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application; // Import model Application
use App\Models\StudentProfile; // Import model StudentProfile
use Illuminate\Support\Facades\Storage; // Nếu bạn muốn lưu file CV vào storage của Laravel

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

        $job = \App\Models\Job::findOrFail($jobId);

        // 4. Kiểm tra xem sinh viên này đã nộp đơn vào công việc nào của công ty này chưa?
        $appliedToSameEmployer = Application::whereHas('job', function($q) use ($job) {
            $q->where('employer_id', $job->employer_id);
        })->where('student_id', $studentProfile->id)->first();

        if ($appliedToSameEmployer) {
            if ($appliedToSameEmployer->job_id == $jobId) {
                return response()->json(['message' => 'Bạn đã nộp CV cho công việc này rồi!'], 400);
            } else {
                return response()->json(['message' => 'Bạn đã nộp hồ sơ vào một vị trí khác của công ty này rồi! Mỗi ứng viên chỉ được ứng tuyển 1 vị trí tại cùng một công ty.'], 400);
            }
        }

        // 5. Validate dữ liệu gửi lên từ Modal (File CV và Thư ngỏ)
        $request->validate([
            'cover_letter' => 'nullable|string|max:1000',
            'cv_file' => 'nullable|mimes:pdf,doc,docx|max:5120', // Giới hạn PDF tối đa 5MB
        ]);

        $cvUrl = null;

        // 6. Xử lý CV: Ưu tiên CV tải lên trực tiếp, nếu không có thì lấy CV trong Profile
        if ($request->hasFile('cv_file')) {
            $file = $request->file('cv_file');
            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])) {
                return response()->json(['message' => 'File CV không hợp lệ. Vui lòng upload PDF hoặc Word.'], 422);
            }

            // Lưu file vào storage/app/public/cvs
            $path = $file->store('cvs', 'public');
            $cvUrl = asset('storage/' . $path);
        } else {
            // Nếu không upload file mới, kiểm tra xem đã có CV mặc định chưa
            if (!$studentProfile->cv_url) {
                return response()->json(['message' => 'Bạn chưa có CV! Vui lòng cập nhật CV trong Hồ sơ cá nhân hoặc tải lên file trực tiếp.'], 400);
            }
            $cvUrl = $studentProfile->cv_url;
        }

        // 7. Lưu vào Database với ĐÚNG id của sinh viên và thêm Thư ngỏ
        $application = Application::create([
            'job_id' => $jobId,
            'student_id' => $studentProfile->id,
            'cv_url' => $cvUrl, 
            'cover_letter' => $request->cover_letter,
            'status' => 'pending' 
        ]);

        // 8. Thông báo cho nhà tuyển dụng
        // Job đã được load ở trên
        $employerUser = $job->employer->user;
        $employerUser->notify(new \App\Notifications\JobAppliedNotification($application));

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
                                   ->paginate(10);

        return response()->json($applications);
    }

    // Dành cho nhà tuyển dụng: Cập nhật trạng thái hồ sơ ứng viên
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Chỉ nhà tuyển dụng mới có quyền này!'], 403);
        }

        $application = Application::with('job')->findOrFail($id);

        // Kiểm tra xem ứng tuyển này có thuộc về công việc của nhà tuyển dụng này không
        if ($application->job->employer_id !== $user->employer->id) {
            return response()->json(['message' => 'Bạn không có quyền cập nhật hồ sơ này!'], 403);
        }

        // Tối ưu: Nếu hồ sơ đã ở trạng thái "Được nhận" hoặc "Từ chối", không cho phép sửa trạng thái nữa
        if (in_array($application->status, ['accepted', 'rejected']) && $request->has('status') && $request->status !== $application->status) {
            return response()->json(['message' => 'Hồ sơ này đã được chốt (Được nhận/Từ chối), không thể thay đổi trạng thái khác!'], 400);
        }

        // Kiểm tra luồng chuyển đổi trạng thái hợp lệ (chặn chuyển lùi)
        if ($request->has('status')) {
            $newStatus = $request->status;
            $oldStatus = $application->status;
            
            if ($oldStatus === 'reviewing' && $newStatus === 'pending') {
                return response()->json(['message' => 'Không thể lùi trạng thái từ Đang xem xét về Chờ xét duyệt!'], 400);
            }
            if ($oldStatus === 'interview' && in_array($newStatus, ['pending', 'reviewing'])) {
                return response()->json(['message' => 'Không thể lùi trạng thái từ Mời phỏng vấn về trước đó!'], 400);
            }
        }

        $request->validate([
            'status' => 'nullable|in:pending,reviewing,interview,rejected,accepted',
            'employer_notes' => 'nullable|string|max:1000',
            'reject_reason' => 'nullable|string|max:1000',
        ]);

        $updateData = [];
        if ($request->has('status')) {
            $updateData['status'] = $request->status;
        }
        if ($request->has('employer_notes')) {
            $updateData['employer_notes'] = $request->employer_notes;
        }
        if ($request->has('reject_reason')) {
            $updateData['reject_reason'] = $request->reject_reason;
        }

        if (!empty($updateData)) {
            $application->update($updateData);

            // Tối ưu: Kiểm tra số lượng đã tuyển so với vacancies
            if (isset($updateData['status']) && $updateData['status'] === 'accepted') {
                $job = $application->job;
                $acceptedCount = \App\Models\Application::where('job_id', $job->id)
                                            ->where('status', 'accepted')
                                            ->count();
                // Nếu số lượng đã nhận >= số lượng cần tuyển, thì đóng job
                if ($acceptedCount >= ($job->vacancies ?: 1)) {
                    $job->update(['status' => 'closed']);
                }
            }
        }

        // Thông báo cho sinh viên
        if ($request->has('status')) {
            $studentUser = $application->student->user;
            $studentUser->notify(new \App\Notifications\JobStatusChangedNotification($application));
        }

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'application' => $application
        ]);
    }

    // Lấy danh sách tất cả hồ sơ ứng tuyển của nhà tuyển dụng
    public function getEmployerApplications(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Chỉ nhà tuyển dụng mới có quyền này!'], 403);
        }

        $employerId = $user->employer->id;

        $query = Application::with(['job:id,title', 'student', 'student.user:id,name,email'])
                            ->whereHas('job', function($q) use ($employerId) {
                                $q->where('employer_id', $employerId);
                            });

        // Filter theo job_id
        if ($request->has('job_id') && $request->job_id != '') {
            $query->where('job_id', $request->job_id);
        }

        // Filter theo status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter theo search (tên ứng viên)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('student.user', function($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%');
            });
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(15);

        // Định dạng lại dữ liệu trả về cho frontend
        $applications->getCollection()->transform(function($app) {
            $app->student_name = $app->student->full_name ?? $app->student->user->name ?? 'Ứng viên';
            $app->student_email = $app->student->user->email ?? 'Email';
            $app->student_avatar = $app->student->avatar ?? null;
            $app->student_phone = $app->student->phone ?? 'Chưa cập nhật';
            $app->student_bio = $app->student->bio ?? 'Chưa có giới thiệu';
            return $app;
        });

        return response()->json($applications);
    }
}