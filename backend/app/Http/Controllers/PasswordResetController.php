<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;

class PasswordResetController extends Controller
{
    /**
     * Gửi email chứa link đặt lại mật khẩu
     * POST /api/forgot-password
     */
    public function sendResetLink(ForgotPasswordRequest $request)
    {
        // Gửi link reset qua email (dùng Password Broker của Laravel)
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Chúng tôi đã gửi link đặt lại mật khẩu vào email của bạn!'
            ], 200);
        }

        return response()->json([
            'message' => 'Không thể gửi email. Vui lòng thử lại sau.',
            'error'   => __($status)
        ], 400);
    }

    /**
     * Đặt lại mật khẩu mới
     * POST /api/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                // Cập nhật mật khẩu mới
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                // Xóa tất cả Sanctum token cũ (buộc đăng nhập lại)
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Mật khẩu đã được thay đổi thành công!'
            ], 200);
        }

        return response()->json([
            'message' => 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.',
            'error'   => __($status)
        ], 400);
    }
}
