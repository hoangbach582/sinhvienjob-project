import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(data.message || 'Link đặt lại mật khẩu đã được gửi vào email của bạn!');
        setEmail(''); // Xóa form sau khi gửi thành công
      } else {
        // Xử lý lỗi validation (422) hoặc lỗi khác
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setErrorMsg(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setErrorMsg(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setErrorMsg('Không thể kết nối đến máy chủ. Hãy bật php artisan serve!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mock-frame" style={{ maxWidth: '420px', margin: '60px auto' }}>
        <div style={{ padding: '32px' }}>
          {/* Tiêu đề */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '56px', height: '56px', 
              background: 'linear-gradient(135deg, #EBF1FD, #D4E4FC)', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: '24px'
            }}>
              🔑
            </div>
            <span className="mock-logo" style={{ fontSize: '18px' }}>Quên mật khẩu</span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
              Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
            </p>
          </div>

          {/* Thông báo thành công */}
          {successMsg && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#EAF3DE', 
              color: '#3B6D11', 
              borderRadius: '8px', 
              fontSize: '13px', 
              marginBottom: '16px', 
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Thông báo lỗi */}
          {errorMsg && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#FDECEC', 
              color: '#E24B4A', 
              borderRadius: '8px', 
              fontSize: '13px', 
              marginBottom: '16px', 
              textAlign: 'center' 
            }}>
              {errorMsg}
            </div>
          )}

          {/* Form nhập email */}
          {!successMsg && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  id="forgot-password-email"
                  className="form-input"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                id="forgot-password-submit"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>
          )}

          {/* Nếu đã gửi thành công, cho gửi lại */}
          {successMsg && (
            <button
              type="button"
              className="btn"
              style={{ width: '100%', padding: '10px', marginTop: '4px' }}
              onClick={() => { setSuccessMsg(''); }}
            >
              Gửi lại email
            </button>
          )}

          <hr className="divider" />

          {/* Link quay lại đăng nhập */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <Link to="/login" style={{ color: '#3B6FE8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Quay lại Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default ForgotPassword;
