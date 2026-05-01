<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Import Controller
use App\Http\Controllers\ApplicationController; // Import Controller
use App\Http\Controllers\JobController; // Import Controller 
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Nhóm route không cần đăng nhập vẫn gọi được
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Nhóm route yêu cầu phải có Token (Đã đăng nhập) mới gọi được
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Nhóm route không cần đăng nhập
Route::get('/jobs/latest', [JobController::class, 'getLatestJobs']);
Route::get('/jobs/{id}', [JobController::class, 'getJobDetail']);
// Bọc các route cần đăng nhập vào trong nhóm bảo vệ này
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/jobs/{jobId}/apply', [ApplicationController::class, 'apply']);
    // Lấy danh sách việc làm đã ứng tuyển của sinh viên đang đăng nhập
    Route::get('/applications/me', [ApplicationController::class, 'getAppliedJobs']);
});

