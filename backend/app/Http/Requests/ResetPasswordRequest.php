<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    /**
     * Không cần đăng nhập để reset mật khẩu
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Quy tắc validation
     */
    public function rules(): array
    {
        return [
            'token'    => 'required|string',
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh bằng tiếng Việt
     */
    public function messages(): array
    {
        return [
            'token.required'     => 'Token không hợp lệ.',
            'email.required'     => 'Vui lòng nhập địa chỉ email.',
            'email.email'        => 'Địa chỉ email không hợp lệ.',
            'email.exists'       => 'Email này chưa được đăng ký trong hệ thống.',
            'password.required'  => 'Vui lòng nhập mật khẩu mới.',
            'password.min'       => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
        ];
    }
}
