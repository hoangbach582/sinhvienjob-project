<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyReview;
use App\Models\Employer;
use App\Models\StudentProfile;

class CompanyReviewController extends Controller
{
    // Lấy danh sách review của một công ty
    public function index($employerId)
    {
        $reviews = CompanyReview::with('student.user')
            ->where('employer_id', $employerId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->count();

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating ? round($averageRating, 1) : 0,
            'total_reviews' => $totalReviews
        ]);
    }

    // Đăng một review mới
    public function store(Request $request, $employerId)
    {
        $user = $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Chỉ sinh viên mới có thể đánh giá công ty.'], 403);
        }

        $studentProfile = StudentProfile::where('user_id', $user->id)->first();
        if (!$studentProfile) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ sinh viên.'], 404);
        }

        // Validate
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        // Check if already reviewed
        $existingReview = CompanyReview::where('employer_id', $employerId)
            ->where('student_id', $studentProfile->id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Bạn đã đánh giá công ty này rồi.'], 400);
        }

        $review = CompanyReview::create([
            'employer_id' => $employerId,
            'student_id' => $studentProfile->id,
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json(['message' => 'Đánh giá thành công', 'review' => $review], 201);
    }
}
