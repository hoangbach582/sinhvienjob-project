import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div style={{
      position: 'absolute',
      right: '0',
      marginTop: '8px',
      width: '320px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      zIndex: 1000,
      transformOrigin: 'top right'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <h3 style={{ margin: 0, fontWeight: 'bold', color: '#111827', fontSize: '16px' }}>Thông báo</h3>
        <button
          onClick={markAllAsRead}
          style={{
            fontSize: '12px',
            color: '#2563EB',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Đánh dấu đã đọc
        </button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading && notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid #F3F4F6',
              borderTop: '2px solid #2563EB',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: !notification.read_at ? '#F0F7FF' : 'white',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !notification.read_at ? '#F0F7FF' : 'white'}
                onClick={() => {
                  if (!notification.read_at) markAsRead(notification.id);
                  onClose();
                }}
              >
                <Link to={notification.data.action_url || '#'} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      marginTop: '6px',
                      flexShrink: 0,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: !notification.read_at ? '#2563EB' : 'transparent'
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#1F2937',
                        lineHeight: '1.4',
                        fontWeight: !notification.read_at ? '600' : '400'
                      }}>
                        {notification.data.message}
                      </p>
                      <p style={{
                        margin: '6px 0 0 0',
                        fontSize: '12px',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '12px', width: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#F3F4F6',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
               <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '32px', width: '32px', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p style={{ margin: 0, color: '#6B7280', fontWeight: '500' }}>Chưa có thông báo nào</p>
          </div>
        )}
      </div>

      <div style={{ padding: '12px', borderTop: '1px solid #F3F4F6', backgroundColor: '#F9FAFB', textAlign: 'center' }}>
        <Link
          to="/notifications"
          onClick={onClose}
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2563EB',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          Xem tất cả thông báo
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
