<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\StudentProfile;

class AccountController extends Controller
{
    /**
     * Đổi mật khẩu tài khoản
     * Yêu cầu: mật khẩu hiện tại phải đúng, mật khẩu mới phải >= 6 ký tự và khớp xác nhận
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed', // cần trường new_password_confirmation
        ], [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
            'new_password.required' => 'Vui lòng nhập mật khẩu mới.',
            'new_password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            'new_password.confirmed' => 'Xác nhận mật khẩu mới không khớp.',
        ]);

        $user = $request->user();

        // Kiểm tra mật khẩu hiện tại có đúng không
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không chính xác.',
                'errors' => ['current_password' => ['Mật khẩu hiện tại không chính xác.']]
            ], 422);
        }

        // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu mới không được trùng với mật khẩu cũ.',
                'errors' => ['new_password' => ['Mật khẩu mới không được trùng với mật khẩu cũ.']]
            ], 422);
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công!'
        ]);
    }

    /**
     * Xóa tài khoản vĩnh viễn
     * Xóa profile liên kết, revoke tokens, xóa user
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Xóa StudentProfile liên kết (nếu có)
        StudentProfile::where('user_id', $user->id)->delete();

        // Xóa Employer profile liên kết (nếu có)
        \App\Models\Employer::where('user_id', $user->id)->delete();

        // Revoke tất cả tokens
        $user->tokens()->delete();

        // Xóa user
        $user->delete();

        return response()->json([
            'message' => 'Tài khoản đã được xóa thành công.'
        ]);
    }
}
