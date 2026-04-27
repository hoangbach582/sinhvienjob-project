import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

function Register() {
  const navigate = useNavigate();

  // 1. Khởi tạo State lưu trữ toàn bộ dữ liệu bạn nhập
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. Hàm bắt sự kiện khi gõ phím
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Hàm gửi dữ liệu đi khi bấm nút
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    setErrorMsg('');

    if (formData.password !== formData.password_confirmation) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);

    try {
      // Gọi API sang Laravel
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // alert('Đăng ký thành công! Đang chuyển hướng đến Đăng nhập...');
        navigate('/login'); // Chuyển trang
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setErrorMsg(firstError);
        } else {
          setErrorMsg(data.message || 'Đăng ký thất bại!');
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg('Không thể kết nối đến máy chủ. Hãy bật php artisan serve!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div className="mock-frame" style={{ maxWidth: '440px', margin: '40px auto' }}>
          <div style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="mock-logo" style={{ fontSize: '18px' }}>SinhVienJob</span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                Đăng ký tài khoản ứng viên
              </p>
            </div>

            {/* Hiển thị lỗi báo đỏ nếu có */}
            {errorMsg && (
              <div style={{ padding: '10px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '4px', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            {/* QUAN TRỌNG: Bao bọc bằng thẻ form và gán sự kiện onSubmit */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input 
                  className="form-input" 
                  name="full_name"
                  placeholder="Nguyễn Văn A" 
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  type="email"
                  name="email"
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
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input 
                  className="form-input" 
                  type="password" 
                  name="password_confirmation"
                  placeholder="••••••••" 
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* QUAN TRỌNG: Thêm type="submit" cho nút */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '10px' }}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Tạo tài khoản'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ color: '#3B6FE8', textDecoration: 'none' }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;