import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy token và email từ URL query params
  const token = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    password: '',
    password_confirmation: '',
    token: token
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Kiểm tra xem có đủ token và email không
  useEffect(() => {
    if (!token || !emailFromUrl) {
      setErrorMsg('Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu gửi lại.');
    }
  }, [token, emailFromUrl]);

  // Đếm ngược khi reset thành công → redirect về login
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && successMsg) {
      navigate('/login');
    }
  }, [countdown, successMsg, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validate phía client
    if (formData.password.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setErrorMsg('Xác nhận mật khẩu không khớp.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: formData.token,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('Mật khẩu đã được thay đổi thành công! Đang chuyển hướng về trang đăng nhập...');
        setCountdown(3); // Bắt đầu đếm ngược 3 giây
      } else {
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
              🔒
            </div>
            <span className="mock-logo" style={{ fontSize: '18px' }}>Đặt lại mật khẩu</span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Nhập mật khẩu mới cho tài khoản <strong>{emailFromUrl}</strong>
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
              {countdown > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>
                  Chuyển hướng sau {countdown} giây...
                </div>
              )}
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

          {/* Form nhập mật khẩu mới */}
          {!successMsg && token && emailFromUrl && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: '#f1f1f1', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  id="reset-password-new"
                  className="form-input"
                  name="password"
                  type="password"
                  placeholder="Tối thiểu 8 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  id="reset-password-confirm"
                  className="form-input"
                  name="password_confirmation"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              <button
                id="reset-password-submit"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          {/* Link nếu token không hợp lệ */}
          {!token && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link to="/forgot-password" className="btn btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                Yêu cầu gửi lại link
              </Link>
            </div>
          )}

          <hr className="divider" />

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

export default ResetPassword;
