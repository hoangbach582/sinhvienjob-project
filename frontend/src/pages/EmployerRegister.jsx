import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

function EmployerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.password !== formData.password_confirmation) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch((${API_BASE}) + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name,
          email: formData.email,
          password: formData.password,
          role: 'employer'
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký doanh nghiệp thành công!');
        navigate('/employer/login');
      } else {
        setErrorMsg(data.errors ? Object.values(data.errors)[0][0] : data.message);
      }
    } catch (error) {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="mock-frame"><Topbar />
        <div style={{ maxWidth: '440px', margin: '40px auto', padding: '32px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <p style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>Đăng ký Doanh Nghiệp</p>
          {errorMsg && <div style={{ color: '#E24B4A', textAlign: 'center', marginBottom: '16px' }}>{errorMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Tên Công Ty</label><input className="form-input" name="company_name" onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Email liên hệ</label><input className="form-input" name="email" type="email" onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Mật khẩu</label><input className="form-input" name="password" type="password" onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Xác nhận mật khẩu</label><input className="form-input" name="password_confirmation" type="password" onChange={handleChange} required /></div>
            <button type="submit" className="btn" style={{ width: '100%', padding: '12px', backgroundColor: '#10B981', color: 'white' }} disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng ký ngay'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployerRegister;