<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ProfileController; // Import sẵn ProfileController cho gọn

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
Route::middleware('auth:sanctum')->group(function () {
    
    // 1. Quản lý Hồ sơ sinh viên
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::post('/profile', [ProfileController::class, 'updateProfile']); 
    
    // 2. Nộp đơn ứng tuyển
    Route::post('/jobs/{jobId}/apply', [ApplicationController::class, 'apply']);
    
    // 3. Lịch sử ứng tuyển
    Route::get('/applications/me', [ApplicationController::class, 'getAppliedJobs']);
});