<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    /**
     * Không cần đăng nhập để gửi yêu cầu quên mật khẩu
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
            'email' => 'required|email|exists:users,email',
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh bằng tiếng Việt
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email'    => 'Địa chỉ email không hợp lệ.',
            'email.exists'   => 'Email này chưa được đăng ký trong hệ thống.',
        ];
    }
}
