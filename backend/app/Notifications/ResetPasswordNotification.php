<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * Token dùng để reset mật khẩu
     */
    protected string $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Gửi qua kênh email
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Nội dung email — Link trỏ về frontend React (không phải backend Laravel)
     */
    public function toMail(object $notifiable): MailMessage
    {
        // URL trỏ về trang ResetPassword của React frontend
        $frontendUrl = 'http://localhost:5173/reset-password?token='
            . $this->token
            . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('SinhVienJob - Đặt lại mật khẩu')
            ->greeting('Xin chào!')
            ->line('Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.')
            ->action('Đặt lại mật khẩu', $frontendUrl)
            ->line('Link này sẽ hết hạn sau 60 phút.')
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.')
            ->salutation('Trân trọng, SinhVienJob');
    }
}
