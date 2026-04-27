import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext'; // Nối với trạm phát sóng Context

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ Context để cập nhật Topbar

  // 1. Quản lý trạng thái form
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false); // Trạng thái nút Ghi nhớ
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Bắt sự kiện gõ phím
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Xử lý khi bấm nút Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Gọi API sang Laravel
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
        // Gọi hàm login từ Context (Lưu token và đổi trạng thái Topbar)
        login(data.access_token, data.user.role, data.name);
        
        // Điều hướng dựa vào vai trò
        if (data.user.role === 'employer') {
          navigate('/employer/dashboard');
        } else if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/'); // Sinh viên về trang chủ
        }
      } else {
        // Sai email hoặc mật khẩu
        setErrorMsg(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg('Không thể kết nối đến máy chủ. Hãy bật php artisan serve!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Chức năng Đăng nhập bằng Google đang được tích hợp với Laravel Socialite!");
  };

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar /> 
        
        <div className="mock-frame" style={{ maxWidth: '400px', margin: '40px auto' }}>
          <div style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="mock-logo" style={{ fontSize: '18px' }}>SinhVienJob</span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                Đăng nhập tài khoản ứng viên
              </p>
            </div>

            {/* Bảng báo lỗi */}
            {errorMsg && (
              <div style={{ padding: '10px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '4px', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            {/* Form xử lý đăng nhập */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  name="email"
                  type="email"
                  placeholder="email@example.com" 
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  /> Ghi nhớ đăng nhập
                </label>
                {/* Đường dẫn tới trang Quên mật khẩu */}
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#3B6FE8', textDecoration: 'none' }}>Quên mật khẩu?</Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '10px' }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <hr className="divider" />
            
            <button 
              type="button" 
              className="btn" 
              style={{ width: '100%', padding: '9px' }}
              onClick={handleGoogleLogin}
            >
              Đăng nhập bằng Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#3B6FE8', textDecoration: 'none' }}>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;