<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AdminJobController extends Controller
{
    /**
     * Lấy danh sách tất cả các job (có lọc theo status)
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Job::with('employer')
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'approved', 'rejected', 'closed'])) {
            $query->where('status', $status);
        }

        $jobs = $query->paginate(15);

        return response()->json($jobs);
    }

    /**
     * Lấy danh sách job đang chờ duyệt
     */
    public function pending()
    {
        $jobs = Job::with('employer')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($jobs);
    }

    /**
     * Duyệt job
     */
    public function approve(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        Gate::authorize('approve', $job);

        $job->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
            'rejected_reason' => null
        ]);

        // Sử dụng email thay vì name vì database hiện tại không có cột name trong bảng users
        Log::info("Admin {$request->user()->email} đã duyệt job: {$job->title} (ID: {$job->id})");

        // Thông báo cho nhà tuyển dụng
        $employerUser = $job->employer->user;
        $employerUser->notify(new \App\Notifications\JobApprovedNotification($job, 'approved'));

        return response()->json([
            'message' => 'Duyệt tin tuyển dụng thành công.',
            'job' => $job
        ]);
    }

    /**
     * Từ chối job
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $job = Job::findOrFail($id);

        Gate::authorize('reject', $job);

        $job->update([
            'status' => 'rejected',
            'rejected_reason' => $request->reason,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id
        ]);

        // Sử dụng email thay vì name
        Log::info("Admin {$request->user()->email} đã từ chối job: {$job->title} (ID: {$job->id}). Lý do: {$request->reason}");

        // Thông báo cho nhà tuyển dụng
        $employerUser = $job->employer->user;
        $employerUser->notify(new \App\Notifications\JobApprovedNotification($job, 'rejected'));

        return response()->json([
            'message' => 'Đã từ chối tin tuyển dụng.',
            'job' => $job
        ]);
    }
}
