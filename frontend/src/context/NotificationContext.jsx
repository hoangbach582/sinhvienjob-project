import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import createEchoInstance from '../services/echo';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const echoRef = useRef(null);
  const pollingRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(page);
      if (page === 1) {
        setNotifications(data.data);
      } else {
        setNotifications(prev => [...prev, ...data.data]);
      }
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Lấy user ID từ nhiều nguồn khác nhau (object user từ context hoặc localStorage)
  const getUserId = useCallback(() => {
    if (user && user.id) return user.id;
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (stored && stored.id) return stored.id;
    } catch (_) { /* ignore */ }
    return null;
  }, [user]);

  // Setup: Fetch ban đầu + Real-time Echo + Polling fallback
  useEffect(() => {
    if (!isLoggedIn) {
      // Cleanup khi logout
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return;

    // Fetch dữ liệu ban đầu
    fetchUnreadCount();
    fetchNotifications();

    // Thử setup Real-time Echo
    const userId = getUserId();
    let echoConnected = false;

    if (userId) {
      try {
        const echoInstance = createEchoInstance(token);
        if (echoInstance) {
          echoRef.current = echoInstance;
          const channel = echoInstance.private(`App.Models.User.${userId}`);
          
          channel.listen('.NewNotification', (notification) => {
            console.log('New notification received:', notification);
            
            // Add to list
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast with icon based on type
            const icon = notification.data?.status === 'approved' ? '✅' 
                       : notification.data?.status === 'rejected' ? '❌' 
                       : '🔔';
            toast(notification.data?.message || 'Bạn có thông báo mới', {
              icon,
              duration: 5000,
              style: {
                borderRadius: '12px',
                background: '#1F2937',
                color: '#fff',
                padding: '12px 16px',
              },
            });
          });

          echoConnected = true;
        }
      } catch (error) {
        console.log('Echo connection failed, using polling fallback:', error);
      }
    }

    // Polling fallback: Kiểm tra thông báo mới mỗi 30 giây nếu không có Echo
    // Hoặc mỗi 60 giây nếu có Echo (để đảm bảo đồng bộ)
    const pollInterval = echoConnected ? 60000 : 30000;
    pollingRef.current = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, pollInterval);

    return () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isLoggedIn, getUserId, fetchUnreadCount, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
