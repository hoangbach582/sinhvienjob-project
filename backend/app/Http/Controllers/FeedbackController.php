<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    /**
     * Submit new feedback
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:feedback,report,bug',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $feedback = Feedback::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        Log::info("New feedback submitted by User ID {$request->user()->id}: {$request->subject}");

        return response()->json([
            'message' => 'Phản hồi của bạn đã được gửi thành công. Cảm ơn bạn!',
            'feedback' => $feedback
        ], 201);
    }
}
