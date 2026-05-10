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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// NHÓM 1: KHÔNG CẦN ĐĂNG NHẬP VẪN GỌI ĐƯỢC
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
Route::get('/jobs/{id}', [JobController::class, 'getJobDetail']);
Route::get('/jobs', [JobController::class, 'index']);


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
    Route::post('/profile', [ProfileController::class, 'updateProfile']); 
    
    // 2. Nộp đơn ứng tuyển
    Route::post('/jobs/{jobId}/apply', [ApplicationController::class, 'apply']);
    
    // 3. Lịch sử ứng tuyển
    Route::get('/applications/me', [ApplicationController::class, 'getAppliedJobs']);

    // 4. Cài đặt tài khoản
    Route::put('/account/change-password', [AccountController::class, 'changePassword']);
    Route::delete('/account', [AccountController::class, 'deleteAccount']);
});