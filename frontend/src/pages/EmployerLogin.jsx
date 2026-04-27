import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function EmployerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu thông tin vào Context
        login(data.access_token, data.user.role, data.name);
        
        // Bắt buộc role phải là employer hoặc admin mới cho vào
        if (data.user.role === 'employer' || data.user.role === 'admin') {
          navigate('/employer/dashboard');
        } else {
          setErrorMsg('Tài khoản này không phải là tài khoản Nhà tuyển dụng!');
        }
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar /> 
        
        <div className="mock-frame" style={{ maxWidth: '440px', margin: '40px auto' }}>
          <div style={{ padding: '32px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>Cổng Nhà Tuyển Dụng</span>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                Đăng nhập để tìm kiếm và quản lý ứng viên
              </p>
            </div>

            {errorMsg && (
              <div style={{ padding: '10px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '4px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email công ty</label>
                <input 
                  className="form-input" 
                  name="email"
                  type="email"
                  placeholder="hr@company.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input 
                  className="form-input" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: '#10B981', textDecoration: 'none' }}>Quên mật khẩu?</Link>
              </div>

              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', padding: '12px', backgroundColor: '#10B981', color: 'white', fontWeight: 600, border: 'none', borderRadius: '6px' }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập Nhà Tuyển Dụng'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Chưa có tài khoản doanh nghiệp?{' '}
              <Link to="/employer/register" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 500 }}>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerLogin;