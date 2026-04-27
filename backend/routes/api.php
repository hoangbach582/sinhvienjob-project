<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Import Controller
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