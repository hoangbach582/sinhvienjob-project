<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class SocialAuthController extends Controller
{
    /**
     * TẠO URL ĐĂNG NHẬP GOOGLE
     * Mục đích: Lấy URL từ dịch vụ Google OAuth để Frontend chuyển hướng người dùng tới trang đăng nhập Google.
     * Sử dụng thư viện Laravel Socialite.
     */
    public function getGoogleUrl()
    {
        try {
            /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
            $provider = Socialite::driver('google');
            // Lấy URL chuyển hướng ở chế độ stateless (không dùng session, phù hợp cho API RESTful)
            $url = $provider->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            // Ghi log nếu lỗi cấu hình Google Client ID / Secret
            Log::error('Error getting Google auth URL: ' . $e->getMessage());
            return response()->json(['message' => 'Cannot generate Google Auth URL'], 500);
        }
    }

    /**
     * XỬ LÝ CALLBACK TỪ GOOGLE
     * Mục đích: Nhận mã xác thực (code) từ Google trả về sau khi người dùng đồng ý đăng nhập.
     * Tự động đăng nhập nếu tài khoản đã tồn tại, hoặc tạo tài khoản mới nếu chưa có.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // 1. Nhận dữ liệu user từ Google
            // Frontend gửi mã xác thực lên, Socialite sẽ tự động đổi mã đó lấy thông tin người dùng từ Google
            /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->user();

            // 2. Tìm kiếm người dùng trong hệ thống qua email hoặc google_id
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // 3a. NẾU USER ĐÃ TỒN TẠI (Đã đăng ký bằng tài khoản thường trước đó)
                // Cập nhật google_id để liên kết tài khoản Google này vào tài khoản có sẵn
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                    // Đánh dấu email đã được xác minh (vì Google đã xác minh email này rồi)
                    if (!$user->email_verified_at) {
                        $user->email_verified_at = now();
                        $user->email_verified = true;
                    }
                    $user->save(); // Lưu thay đổi vào Database
                }
            } else {
                // 3b. NẾU USER CHƯA TỒN TẠI
                // Tự động tạo một tài khoản (User) mới bằng thông tin lấy từ Google
                $user = User::create([
                    'name' => $googleUser->getName() ?? 'User',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(), // Lưu lại ID định danh của Google
                    'password' => Hash::make(Str::random(24)), // Tạo mật khẩu ngẫu nhiên siêu bảo mật (vì đăng nhập qua Google không dùng tới nó)
                    'role' => 'student', // Mặc định tài khoản tạo qua Google sẽ là Sinh viên
                    'email_verified_at' => now(), // Mặc định đã xác minh email
                    'email_verified' => true,
                ]);

                // Tạo tự động Profile (Hồ sơ sinh viên) đi kèm với User mới
                StudentProfile::create([
                    'user_id' => $user->id,
                    'full_name' => $googleUser->getName() ?? 'User',
                    'avatar' => $googleUser->getAvatar(), // Lấy avatar từ Google Account
                ]);
            }

            // 4. Tạo Access Token cho phiên làm việc
            // Cấp mã Token sử dụng Laravel Sanctum để xác thực các API sau này
            $token = $user->createToken('auth_token')->plainTextToken;

            // 5. Tải thông tin Profile nếu là sinh viên để trả về hiển thị trên giao diện
            $profile = null;
            if ($user->role === 'student') {
                $profile = StudentProfile::where('user_id', $user->id)->first();
            } elseif ($user->role === 'employer') {
                $employer = \App\Models\Employer::where('user_id', $user->id)->first();
                if ($employer) {
                    $profile = [
                        'full_name' => $employer->company_name,
                        'avatar' => $employer->logo_url
                    ];
                }
            }

            // 6. Trả về thông tin đăng nhập thành công
            return response()->json([
                'access_token' => $token, // Token gắn vào Header Authorization
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'profile' => $profile // Dữ liệu hồ sơ (tên, avatar...)
            ]);

        } catch (\Exception $e) {
            // Bắt lỗi hệ thống (ví dụ: Google từ chối token, cấu hình sai)
            Log::error('Google Auth Callback Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Authentication failed', 'error' => $e->getMessage()], 401);
        }
    }
}
