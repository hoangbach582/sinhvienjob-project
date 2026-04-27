<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // HÀM ĐĂNG KÝ 
    public function register(Request $request)
{
    // 1. Khai báo luật kiểm tra chung
    $rules = [
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
        'role' => 'required|in:student,employer'
    ];

    // 2. Tùy biến luật theo từng role
    if ($request->role === 'student') {
        $rules['full_name'] = 'required|string|max:255';
    } else {
        $rules['company_name'] = 'required|string|max:255';
    }

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    // 3. Tạo User
    $user = User::create([
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role
    ]);

    // 4. Phân luồng tạo Profile tương ứng
    if ($request->role === 'student') {
        StudentProfile::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
        ]);
    } else {
        \App\Models\Employer::create([ // Thêm \App\Models\ vào đây
            'user_id' => $user->id,
            'company_name' => $request->company_name,
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Đăng ký tài khoản thành công!',
        'access_token' => $token,
        'user' => $user
    ], 201);
}

    // HÀM ĐĂNG NHẬP
    public function login(Request $request)
    {
        // 1. Kiểm tra định dạng đầu vào
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // 3. Kiểm tra user có tồn tại và mật khẩu có khớp không
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // 4. Lấy Tên hiển thị (NẾU KHÔNG TÌM THẤY TÊN, TRẢ VỀ EMAIL)
        $name = $user->email; 
        if ($user->role === 'student') {
            $profile = StudentProfile::where('user_id', $user->id)->first();
            if ($profile) {
                $name = $profile->full_name;
            }
        } elseif ($user->role === 'employer') {
            $employer = \App\Models\Employer::where('user_id', $user->id)->first();
            if ($employer) {
                $name = $employer->company_name;
            }
        }

        // 5. Cấp Token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'access_token' => $token,
            'user' => $user,
            'name' => $name // Dòng chữ vàng này quyết định việc hiện Tên trên Topbar
        ]);
    }
}