import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // 'student' hoặc 'employer'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Chuẩn bị dữ liệu gửi lên dựa theo Role
    const payload = {
      email,
      password,
      role
    };

    if (role === 'student') payload.full_name = fullName;
    if (role === 'employer') payload.company_name = companyName;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Tự động đăng nhập luôn sau khi đăng ký thành công
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert("🎉 Đăng ký tài khoản thành công!");
        window.location.href = '/'; // Dùng cách này để ép React load lại toàn bộ Context
      } else {
        // Xử lý báo lỗi từ Laravel (ví dụ: email đã tồn tại, pass quá ngắn)
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
        } else {
          setError(data.message || 'Đăng ký thất bại!');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '20px 0' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: '#3B82F6', margin: '0 0 8px 0', fontWeight: 'bold' }}>SinhVienJob</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Tạo tài khoản mới để bắt đầu</p>
        </div>

        {/* Tab chọn loại tài khoản */}
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: role === 'student' ? '#fff' : 'transparent', color: role === 'student' ? '#3B82F6' : '#64748B', boxShadow: role === 'student' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            👨‍🎓 Sinh viên
          </button>
          <button 
            type="button"
            onClick={() => { setRole('employer'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: role === 'employer' ? '#fff' : 'transparent', color: role === 'employer' ? '#10B981' : '#64748B', boxShadow: role === 'employer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            🏢 Nhà tuyển dụng
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Form động: Đổi tên trường tùy theo Role */}
          {role === 'student' ? (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>Họ và tên</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="VD: Nguyễn Văn A" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>Tên công ty</label>
              <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="VD: Công ty TNHH Công nghệ..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập địa chỉ email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>Mật khẩu</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '10px', width: '100%', padding: '14px', backgroundColor: role === 'student' ? '#3B82F6' : '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: role === 'student' ? '#3B82F6' : '#10B981', textDecoration: 'none', fontWeight: 500 }}>Đăng nhập</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link to="/" style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>← Quay lại trang chủ</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;