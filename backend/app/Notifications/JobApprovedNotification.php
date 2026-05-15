<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $job;
    public $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($job, $status = 'approved')
    {
        $this->job = $job;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->status === 'approved' ? 'Tin tuyển dụng đã được duyệt' : 'Tin tuyển dụng bị từ chối';
        $message = $this->status === 'approved' 
            ? 'Tin tuyển dụng "' . $this->job->title . '" của bạn đã được quản trị viên phê duyệt và hiển thị trên hệ thống.'
            : 'Tin tuyển dụng "' . $this->job->title . '" của bạn đã bị từ chối.';

        return (new MailMessage)
                    ->subject($subject)
                    ->greeting('Chào ' . $notifiable->name . '!')
                    ->line($message)
                    ->action('Quản lý tin tuyển dụng', url('/employer/jobs'))
                    ->line('Cảm ơn bạn đã sử dụng SinhVienJob!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $message = $this->status === 'approved' 
            ? "Tin tuyển dụng \"{$this->job->title}\" đã được duyệt."
            : "Tin tuyển dụng \"{$this->job->title}\" đã bị từ chối.";

        return [
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'status' => $this->status,
            'message' => $message,
            'action_url' => "/employer/jobs",
        ];
    }
}
