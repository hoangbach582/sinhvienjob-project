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
            event(new NewNotification($event->response));
        }
    }
}
