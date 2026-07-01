import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasVerified = React.useRef(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Liên kết xác minh không hợp lệ. Thiếu thông tin token hoặc email.');
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '/email/verification/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ token, email })
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Xác minh email thành công!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác minh email thất bại.');
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
        setStatus('error');
        setMessage('Không thể kết nối đến máy chủ.');
      }
    };

    verify();
  }, [token, email]);

  return (
    <MainLayout>
      <div className="mock-frame" style={{ maxWidth: '450px', margin: '60px auto' }}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          
          {status === 'verifying' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3B6FE8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Đang xác minh...</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Vui lòng đợi trong giây lát.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ marginBottom: '20px', color: '#2E7D32' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#2E7D32' }}>Xác minh thành công!</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>{message}</p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%', padding: '10px', textDecoration: 'none' }}>
                Đăng nhập ngay
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ marginBottom: '20px', color: '#E24B4A' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#E24B4A' }}>Xác minh thất bại</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>{message}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/verify-email-notice', { state: { email } })}
                  style={{ width: '100%', padding: '10px' }}
                >
                  Yêu cầu gửi lại email
                </button>
                <Link to="/login" className="btn" style={{ width: '100%', padding: '10px', textDecoration: 'none', textAlign: 'center' }}>
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default VerifyEmail;
