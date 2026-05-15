<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\SavedJob;
use App\Models\StudentProfile;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    /**
     * Get list of saved jobs for the authenticated student.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a student
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ sinh viên mới có thể xem danh sách việc làm đã lưu.'], 403);
        }

        $student = StudentProfile::where('user_id', $user->id)->first();
        
        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ sinh viên.'], 404);
        }

        $savedJobs = SavedJob::where('student_id', $student->id)
            ->with(['job' => function($query) {
                $query->with('employer');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($savedJobs);
    }

    /**
     * Toggle save/unsave a job.
     */
    public function toggle(Request $request, $jobId)
    {
        $user = $request->user();

        // Ensure user is a student
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ sinh viên mới có thể lưu việc làm.'], 403);
        }

        $student = StudentProfile::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ sinh viên.'], 404);
        }

        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['message' => 'Không tìm thấy việc làm.'], 404);
        }

        $savedJob = SavedJob::where('student_id', $student->id)
            ->where('job_id', $jobId)
            ->first();

        if ($savedJob) {
            $savedJob->delete();
            return response()->json([
                'message' => 'Đã bỏ lưu việc làm.',
                'is_saved' => false
            ]);
        } else {
            SavedJob::create([
                'student_id' => $student->id,
                'job_id' => $jobId
            ]);
            return response()->json([
                'message' => 'Đã lưu việc làm thành công.',
                'is_saved' => true
            ]);
        }
    }
}
