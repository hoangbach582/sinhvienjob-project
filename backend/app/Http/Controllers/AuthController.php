<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * HÀM ĐĂNG KÝ TÀI KHOẢN (REGISTER)
     * Mục đích: Tạo tài khoản mới cho Sinh viên hoặc Nhà tuyển dụng.
     * Đầu vào (Request): email, password, role (student/employer) và thông tin bổ sung (full_name hoặc company_name).
     * Đầu ra: Trả về JSON thông báo thành công và bắt buộc người dùng phải xác minh email.
     */
    public function register(Request $request)
    {
        // 1. Khai báo luật kiểm tra chung (Validation rules) cho tất cả các tài khoản
        $rules = [
            'email' => 'required|string|email|max:255|unique:users', // Email bắt buộc, đúng định dạng, không được trùng lặp
            'password' => 'required|string|min:6',                    // Mật khẩu bắt buộc, ít nhất 6 ký tự
            'role' => 'required|in:student,employer'                  // Role bắt buộc, chỉ nhận giá trị student hoặc employer
        ];

        // 2. Tùy biến luật kiểm tra theo từng nhóm quyền (role)
        if ($request->role === 'student') {
            // Nếu là sinh viên, bắt buộc nhập họ tên
            $rules['full_name'] = 'required|string|max:255';
        } else {
            // Nếu là nhà tuyển dụng, bắt buộc nhập tên công ty
            $rules['company_name'] = 'required|string|max:255';
        }

        // Thực thi kiểm tra dữ liệu đầu vào theo bộ luật đã định nghĩa
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            // Nếu dữ liệu không hợp lệ, trả về lỗi HTTP 400 (Bad Request)
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // 3. Tạo bản ghi User (tài khoản đăng nhập) trong bảng `users`
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu (Bcrypt) trước khi lưu vào DB
            'role' => $request->role
        ]);

        // 4. Phân luồng tạo Profile tương ứng dựa vào role
        if ($request->role === 'student') {
            // Tạo hồ sơ cá nhân cho Sinh viên trong bảng `student_profiles`
            StudentProfile::create([
                'user_id' => $user->id,
                'full_name' => $request->full_name,
            ]);
        } else {
            // Tạo hồ sơ doanh nghiệp cho Nhà tuyển dụng trong bảng `employers`
            \App\Models\Employer::create([ 
                'user_id' => $user->id,
                'company_name' => $request->company_name,
            ]);
        }

        // 5. Khởi tạo quy trình Gửi email xác minh (Email Verification)
        // Tạo một chuỗi ngẫu nhiên 64 ký tự làm Token xác minh
        $verificationToken = \Illuminate\Support\Str::random(64);
        
        // Lưu Token này vào DB để đối chiếu khi người dùng click vào link trong email
        \App\Models\EmailVerification::create([
            'email' => $user->email,
            'token' => $verificationToken,
            'expires_at' => \Carbon\Carbon::now()->addHours(24) // Token có hiệu lực trong 24 giờ
        ]);
        
        // Thực hiện gửi email xác minh
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\EmailVerificationMail($verificationToken, $user->email));
        } catch (\Exception $e) {
            // Ghi log nếu có lỗi khi gửi email (ví dụ: cấu hình SMTP sai, rớt mạng)
            \Illuminate\Support\Facades\Log::error('Error sending verification email: ' . $e->getMessage());
            // Lưu ý: Vẫn cho phép quy trình tạo tài khoản thành công để tránh lỗi hệ thống,
            // người dùng có thể bấm nút "Gửi lại email xác minh" sau đó.
        }

        // Trả về kết quả báo đăng ký thành công
        return response()->json([
            'message' => 'Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
            'user' => $user,
            'requires_verification' => true // Cờ báo cho Frontend biết tài khoản này cần xác minh email
        ], 201); // HTTP Status 201: Created
    }

    /**
     * HÀM ĐĂNG NHẬP TÀI KHOẢN (LOGIN)
     * Mục đích: Kiểm tra thông tin đăng nhập và cấp Access Token.
     * Đầu vào: email, password.
     * Đầu ra: Access Token, Thông tin user, Tên hiển thị và Avatar.
     */
    public function login(Request $request)
    {
        // 1. Kiểm tra định dạng dữ liệu đầu vào
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Tìm user theo email trong CSDL
        $user = User::where('email', $request->email)->first();

        // 3. Kiểm tra thông tin xác thực
        // Nếu không tìm thấy user hoặc mật khẩu (đã hash) không khớp với dữ liệu gửi lên
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401); // HTTP Status 401: Unauthorized
        }

        // 3.5 Kiểm tra trạng thái xác minh email
        // Nếu tài khoản chưa xác minh email (trường email_verified_at bị null)
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'status' => false,
                'message' => 'Email chưa được xác minh.',
                'requires_verification' => true,
                'email' => $user->email
            ], 403); // HTTP Status 403: Forbidden (tài khoản bị khóa quyền truy cập cho đến khi xác minh)
        }

        // 4. Lấy Tên hiển thị và Ảnh đại diện (Avatar/Logo) trả về cho Frontend
        $name = $user->email; // Mặc định hiển thị tên là email nếu không tìm thấy profile
        $avatar = null;
        
        if ($user->role === 'student') {
            // Lấy thông tin từ bảng sinh viên
            $profile = StudentProfile::where('user_id', $user->id)->first();
            if ($profile) {
                $name = $profile->full_name;
                $avatar = $profile->avatar ?? null;
            }
        } elseif ($user->role === 'employer') {
            // Lấy thông tin từ bảng nhà tuyển dụng
            $employer = \App\Models\Employer::where('user_id', $user->id)->first();
            if ($employer) {
                $name = $employer->company_name;
                $avatar = $employer->logo_url ?? null;
            }
        }

        // 5. Cấp Token truy cập mới (Sử dụng Laravel Sanctum)
        // Frontend sẽ lưu Token này (ví dụ trong localStorage) và gắn vào Header cho mỗi Request tiếp theo
        $token = $user->createToken('auth_token')->plainTextToken;

        // Trả về JSON dữ liệu đăng nhập thành công
        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'access_token' => $token, // Token xác thực API
            'user' => $user,          // Chứa thông tin gốc của user (email, role, id)
            'name' => $name,          // Tên hiển thị trên thanh điều hướng (Topbar)
            'avatar' => $avatar       // Ảnh đại diện
        ]);
    }
}