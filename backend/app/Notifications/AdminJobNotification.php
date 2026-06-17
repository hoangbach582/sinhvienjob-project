<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminJobNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $job;
    public $action;
    public $employerName;

    /**
     * Create a new notification instance.
     */
    public function __construct($job, $action, $employerName)
    {
        $this->job = $job;
        $this->action = $action; // 'created' or 'updated'
        $this->employerName = $employerName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // For admin notifications, typically we just need database unless an email is requested
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        if ($this->action === 'created') {
            $message = "Nhà tuyển dụng {$this->employerName} vừa đăng tin: \"{$this->job->title}\"";
        } else {
            $message = "Nhà tuyển dụng {$this->employerName} vừa cập nhật tin: \"{$this->job->title}\"";
        }

        return [
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'employer_name' => $this->employerName,
            'action' => $this->action,
            'message' => $message,
            'action_url' => "/admin/jobs",
        ];
    }
}
