import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [echo, setEcho] = useState(null);

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

  // Setup Real-time Echo
  useEffect(() => {
    if (isLoggedIn && user && user.id) {
      const token = localStorage.getItem('token');
      const echoInstance = createEchoInstance(token);
      
      if (echoInstance) {
        setEcho(echoInstance);
        fetchUnreadCount();
        fetchNotifications();

        const channel = echoInstance.private(`App.Models.User.${user.id}`);
        
        channel.listen('.NewNotification', (notification) => {
          console.log('New notification received:', notification);
          
          // Add to list
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast
          toast(notification.data.message, {
            icon: '🔔',
            duration: 5000,
          });
          
          // Play sound (optional)
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(e => console.log('Sound play blocked'));
        });

        return () => {
          channel.stopListening('.NewNotification');
          echoInstance.disconnect();
        };
      }
    } else {
      if (echo) {
        echo.disconnect();
        setEcho(null);
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn, user, fetchUnreadCount, fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead
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
