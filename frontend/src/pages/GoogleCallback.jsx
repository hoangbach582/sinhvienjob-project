import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Component mounts, fetch the code from the URL
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      // We have a code, send it to the backend
      handleGoogleCallback(code);
    } else {
      setError("Không tìm thấy mã xác thực từ Google.");
      setLoading(false);
    }
  }, [location.search]);

  const handleGoogleCallback = async (code) => {
    try {
      const response = await fetch((${API_BASE}) + '/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (response.ok) {
        // Construct the user object for AuthContext
        let userWithInfo = { ...data.user };
        
        if (data.user.role === 'student' && data.profile) {
          userWithInfo.name = data.profile.full_name || data.user.email;
          userWithInfo.avatar = data.profile.avatar || '';
        } else {
          userWithInfo.name = data.user.email;
        }

        // Use the login function from AuthContext to save token and user state
        login(data.access_token, userWithInfo);

        // Redirect to home page
        navigate('/');
      } else {
        setError(data.message || 'Đăng nhập bằng Google thất bại.');
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Không thể kết nối đến máy chủ. Hãy thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="mock-frame" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          {loading ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                {/* A simple loading spinner */}
                <svg className="spinner" width="40" height="40" viewBox="0 0 50 50" style={{ animation: 'spin 2s linear infinite', margin: '0 auto' }}>
                  <circle cx="25" cy="25" r="20" fill="none" stroke="#3B6FE8" strokeWidth="4" strokeDasharray="31.4 31.4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', color: '#1A1A1A' }}>Đang xác thực...</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                Vui lòng đợi trong khi chúng tôi kết nối với Google.
              </p>
            </>
          ) : error ? (
            <>
              <div style={{ color: '#E24B4A', marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '8px' }}>Lỗi Xác Thực</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
                style={{ width: '100%' }}
              >
                Quay lại trang Đăng nhập
              </button>
            </>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </MainLayout>
  );
}

export default GoogleCallback;
