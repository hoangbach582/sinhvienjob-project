<?php

namespace App\Notifications;

use App\Events\NewNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobAppliedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $application;
    public $job;
    public $student;

    /**
     * Create a new notification instance.
     */
    public function __construct($application)
    {
        $this->application = $application;
        $this->job = $application->job;
        $this->student = $application->student;
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
        return (new MailMessage)
                    ->subject('Ứng viên mới cho vị trí ' . $this->job->title)
                    ->greeting('Chào ' . $notifiable->name . '!')
                    ->line('Bạn có một ứng viên mới cho công việc: ' . $this->job->title)
                    ->line('Ứng viên: ' . $this->student->full_name)
                    ->action('Xem hồ sơ ứng viên', url('/employer/jobs/' . $this->job->id . '/applications'))
                    ->line('Cảm ơn bạn đã sử dụng SinhVienJob!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'job_id' => $this->job->id,
            'job_title' => $this->job->title,
            'student_name' => $this->student->full_name,
            'message' => "Ứng viên {$this->student->full_name} đã ứng tuyển vào vị trí {$this->job->title}",
            'action_url' => "/employer/jobs/{$this->job->id}/applications",
        ];
    }
}
