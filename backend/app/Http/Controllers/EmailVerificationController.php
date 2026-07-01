<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\EmailVerificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EmailVerificationController extends Controller
{
    /**
     * Send or resend the verification email.
     */
    public function resend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng với email này'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email này đã được xác minh. Bạn có thể đăng nhập.'], 400);
        }

        // Rate limiting: Check if an email was sent recently
        $recentToken = EmailVerification::where('email', $user->email)
            ->where('created_at', '>=', Carbon::now()->subMinutes(2))
            ->first();

        if ($recentToken) {
            return response()->json(['message' => 'Vui lòng đợi vài phút trước khi yêu cầu gửi lại.'], 429);
        }

        // Delete old tokens
        EmailVerification::where('email', $user->email)->delete();

        // Create new token
        $token = Str::random(64);
        EmailVerification::create([
            'email' => $user->email,
            'token' => $token,
            'expires_at' => Carbon::now()->addHours(24)
        ]);

        // Send email
        try {
            Mail::to($user->email)->send(new EmailVerificationMail($token, $user->email));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Lỗi gửi email xác minh: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi kết nối email. Vui lòng cấu hình SMTP trên Render.'], 500);
        }

        return response()->json(['message' => 'Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư của bạn.']);
    }

    /**
     * Verify the email using the token.
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $verification = EmailVerification::where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Liên kết xác minh không hợp lệ.'], 400);
        }

        if (Carbon::now()->isAfter($verification->expires_at)) {
            return response()->json(['message' => 'Liên kết xác minh đã hết hạn. Vui lòng yêu cầu gửi lại.'], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        // Clean up the tokens
        EmailVerification::where('email', $request->email)->delete();

        return response()->json(['message' => 'Xác minh email thành công. Bạn có thể đăng nhập ngay bây giờ.']);
    }
}
