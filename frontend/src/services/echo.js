import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY || 'local';
const PUSHER_HOST = import.meta.env.VITE_PUSHER_HOST || '127.0.0.1';
const PUSHER_PORT = import.meta.env.VITE_PUSHER_PORT || 6001;
const PUSHER_SCHEME = import.meta.env.VITE_PUSHER_SCHEME || 'http';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1';

const createEchoInstance = (token) => {
  if (!token) return null;

  return new Echo({
    broadcaster: 'pusher',
    key: PUSHER_KEY,
    wsHost: PUSHER_HOST,
    wsPort: PUSHER_PORT,
    forceTLS: PUSHER_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: PUSHER_CLUSTER,
    authEndpoint: `${API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });
};

export default createEchoInstance;
