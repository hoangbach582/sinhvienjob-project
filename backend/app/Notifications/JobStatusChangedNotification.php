<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $application;
    public $job;
    public $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($application)
    {
        $this->application = $application;
        $this->job = $application->job;
        $this->status = $application->status;
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
        $statusLabels = [
            'pending' => 'Đang chờ',
            'reviewing' => 'Đang xem xét',
            'interview' => 'Mời phỏng vấn',
            'rejected' => 'Bị từ chối',
            'accepted' => 'Được nhận',
        ];

        $statusText = $statusLabels[$this->status] ?? $this->status;
        $message = (new MailMessage)
                    ->subject('Cập nhật trạng thái ứng tuyển: ' . $this->job->title)
                    ->greeting('Chào ' . $notifiable->name . '!')
                    ->line('Trạng thái hồ sơ của bạn cho vị trí "' . $this->job->title . '" đã được cập nhật thành: ' . $statusText);
                    
        if ($this->status === 'rejected' && $this->application->reject_reason) {
            $message->line('Lý do: ' . $this->application->reject_reason);
        }

        return $message->action('Xem chi tiết', url('/applications/me'))
                       ->line('Chúc bạn may mắn!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusLabels = [
            'pending' => 'Đang chờ',
            'reviewing' => 'Đang xem xét',
            'interview' => 'Mời phỏng vấn',
            'rejected' => 'Bị từ chối',
            'accepted' => 'Được nhận',
        ];

        $statusText = $statusLabels[$this->status] ?? $this->status;
        $message = "Hồ sơ ứng tuyển vị trí {$this->job->title} đã chuyển sang trạng thái: {$statusText}";
        
        if ($this->status === 'rejected' && $this->application->reject_reason) {
            $message .= ". Lý do: {$this->application->reject_reason}";
        }

        return [
            'application_id' => $this->application->id,
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'status' => $this->status,
            'message' => $message,
            'action_url' => "/applications/me",
        ];
    }
}
