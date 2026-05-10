import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function EmailVerificationNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Nếu truy cập trực tiếp mà không có email, điều hướng về login
  if (!email) {
    navigate('/login');
    return null;
  }

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/email/verification/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Email xác minh đã được gửi lại thành công!');
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra khi gửi lại email.');
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mock-frame" style={{ maxWidth: '450px', margin: '40px auto' }}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Xác minh tài khoản của bạn</h2>
          
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
            Chúng tôi đã gửi một email xác minh đến địa chỉ <strong>{email}</strong>. 
            Vui lòng kiểm tra hộp thư đến (và hộp thư rác) để hoàn tất việc đăng ký.
          </p>

          {message && (
            <div style={{ padding: '12px', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }}>
              {message}
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleResend}
              disabled={loading}
              style={{ width: '100%', padding: '10px' }}
            >
              {loading ? 'Đang gửi...' : 'Gửi lại email xác minh'}
            </button>

            <Link to="/login" className="btn" style={{ width: '100%', padding: '10px', textDecoration: 'none', textAlign: 'center' }}>
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmailVerificationNotice;
