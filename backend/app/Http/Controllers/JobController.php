<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;

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
}
