<?php

namespace App\Listeners;

use App\Events\NewNotification;
use Illuminate\Notifications\Events\NotificationSent;

class SendNewNotificationBroadcast
{
    /**
     * Handle the event.
     */
    public function handle(NotificationSent $event): void
    {
        // Only broadcast if it's stored in the database
        if ($event->channel === 'database') {
            try {
                event(new NewNotification($event->response));
            } catch (\Exception $e) {
                // Log warning and continue instead of crashing the application
                \Illuminate\Support\Facades\Log::warning("Could not broadcast notification: " . $e->getMessage());
            }
        }
    }
}
