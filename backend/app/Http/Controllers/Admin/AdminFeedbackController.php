<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;

class AdminFeedbackController extends Controller
{
    /**
     * Danh sách feedback
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Feedback::with('user:id,name,email,role');

        if ($status) {
            $query->where('status', $status);
        }

        $feedbacks = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($feedbacks);
    }

    /**
     * Cập nhật trạng thái đã giải quyết
     */
    public function resolve(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $feedback->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'resolved_by' => $request->user()->id,
        ]);

        Log::info("Admin {$request->user()->email} đã đánh dấu xử lý feedback: {$feedback->id}");

        return response()->json([
            'message' => 'Đã đánh dấu xử lý thành công.',
            'feedback' => $feedback
        ]);
    }
}
