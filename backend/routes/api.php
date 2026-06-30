<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ProfileController; // Import sẵn ProfileController cho gọn
use App\Http\Controllers\AccountController; // Import AccountController cho cài đặt tài khoản
use App\Http\Controllers\PasswordResetController; // Import controller quên mật khẩu
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\EmployerProfileController; // Import EmployerProfileController
use App\Http\Controllers\Admin\AdminJobController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\AdminActivityController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EmployerDashboardController; // Thêm import này
use App\Http\Controllers\StudentDashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ==========================================
// NHÓM 1: KHÔNG CẦN ĐĂNG NHẬP VẪN GỌI ĐƯỢC
// ==========================================
Route::middleware('throttle:register')->post('/register', [AuthController::class, 'register']);
Route::middleware('throttle:login')->post('/login', [AuthController::class, 'login']);

// Đăng nhập bằng Google (Socialite)
Route::get('/auth/google/url', [\App\Http\Controllers\SocialAuthController::class, 'getGoogleUrl']);
Route::post('/auth/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);

// Quên mật khẩu & Đặt lại mật khẩu
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Xác minh email
Route::post('/email/verification/verify', [EmailVerificationController::class, 'verify']);
Route::post('/email/verification/resend', [EmailVerificationController::class, 'resend']);

Route::get('/jobs/latest', [JobController::class, 'getLatestJobs']);
// Gợi ý việc làm cá nhân hóa (yêu cầu đăng nhập)
Route::middleware('auth:sanctum')->get('/jobs/recommendations', [JobController::class, 'getRecommendations']);
// Chi tiết công việc (Hỗ trợ check is_saved nếu có token)
Route::get('/jobs/{id}', [JobController::class, 'getJobDetail']);
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/categories/job-types', [JobController::class, 'getCategories']);
Route::get('/categories/industries', [JobController::class, 'getIndustries']);

Route::get('/employers', [EmployerProfileController::class, 'publicIndex']);
Route::get('/employers/{id}', [EmployerProfileController::class, 'publicShow']);
Route::get('/employers/{id}/reviews', [\App\Http\Controllers\CompanyReviewController::class, 'index']);
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index']);

// ==========================================
// NHÓM 2: YÊU CẦU PHẢI CÓ TOKEN (ĐÃ ĐĂNG NHẬP)
// ==========================================

// Lấy thông tin user hiện tại (Mặc định của Laravel)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Bọc TẤT CẢ các chức năng quan trọng vào chung 1 Group bảo vệ
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    
    // 1. Quản lý Hồ sơ sinh viên
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::middleware('throttle:upload')->post('/profile', [ProfileController::class, 'updateProfile']); 
    
    // 2. Nộp đơn ứng tuyển
    Route::middleware('throttle:upload')->post('/jobs/{jobId}/apply', [ApplicationController::class, 'apply']);
    
    // 3. Lịch sử ứng tuyển
    Route::get('/applications/me', [ApplicationController::class, 'getAppliedJobs']);

    // 4. Việc làm đã lưu
    Route::post('/jobs/{jobId}/save', [SavedJobController::class, 'toggle']);
    Route::get('/saved-jobs', [SavedJobController::class, 'index']);

    // 4.5 Student Dashboard
    Route::get('/dashboard/student/stats', [StudentDashboardController::class, 'getStats']);

    // 4.6 Đánh giá công ty
    Route::post('/employers/{id}/reviews', [\App\Http\Controllers\CompanyReviewController::class, 'store']);

    // 5. Cài đặt tài khoản
    Route::put('/account/change-password', [AccountController::class, 'changePassword']);
    Route::delete('/account', [AccountController::class, 'deleteAccount']);

    // 6. Quản lý tuyển dụng (Dành cho Employer)
    Route::prefix('employer')->group(function () {
        Route::get('/profile', [EmployerProfileController::class, 'show']);
        Route::middleware('throttle:upload')->post('/profile', [EmployerProfileController::class, 'update']);
        
        // Dashboard Stats & Recent Data
        Route::get('/dashboard/stats', [EmployerDashboardController::class, 'stats']);
        Route::get('/jobs/recent', [EmployerDashboardController::class, 'recentJobs']);
        Route::get('/applications/recent', [EmployerDashboardController::class, 'recentApplications']);
        
        Route::get('/jobs/stats', [JobController::class, 'employerStats']);
        Route::get('/jobs', [JobController::class, 'employerIndex']);
        Route::post('/jobs', [JobController::class, 'store']);
        Route::get('/jobs/{id}', [JobController::class, 'show']);
        Route::put('/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
        Route::get('/jobs/{id}/applications', [JobController::class, 'getJobApplicants']);
        Route::get('/applications', [ApplicationController::class, 'getEmployerApplications']);
        Route::patch('/applications/{id}', [ApplicationController::class, 'updateStatus']);
    });

    // 7. Quản lý Admin
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/jobs/pending', [AdminJobController::class, 'pending']);
        Route::get('/jobs', [AdminJobController::class, 'index']);
        Route::post('/jobs/{id}/approve', [AdminJobController::class, 'approve']);
        Route::post('/jobs/{id}/reject', [AdminJobController::class, 'reject']);

        // Quản lý Ngành nghề
        Route::patch('/industries/{industry}/toggle', [\App\Http\Controllers\Admin\AdminIndustryController::class, 'toggleStatus']);
        Route::apiResource('industries', \App\Http\Controllers\Admin\AdminIndustryController::class);

        // Báo cáo & Thống kê
        Route::get('/reports/stats', [AdminReportController::class, 'getDashboardStats']);
        Route::get('/reports/export', [AdminReportController::class, 'exportReport']);

        // Activity Logs
        Route::get('/activity-logs', [AdminActivityController::class, 'index']);

        // Quản lý Tài khoản (Employer & Student)
        Route::get('/accounts/export', [AdminAccountController::class, 'export']);
        Route::post('/accounts/bulk-action', [AdminAccountController::class, 'bulkAction']);
        Route::get('/accounts', [AdminAccountController::class, 'index']);
        Route::get('/accounts/{id}', [AdminAccountController::class, 'show']);
        Route::patch('/accounts/{id}/approve', [AdminAccountController::class, 'approve']);
        Route::patch('/accounts/{id}/status', [AdminAccountController::class, 'updateStatus']);
        Route::delete('/accounts/{id}', [AdminAccountController::class, 'destroy']);
    });

    // 8. Thông báo
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});