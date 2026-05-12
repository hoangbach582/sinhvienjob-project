import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/login`, {
        email,
        password
      });

      const { access_token, user } = response.data;

      if (user.role !== 'admin') {
        setError('Tài khoản này không có quyền Admin.');
        setLoading(false);
        return;
      }

      // Lưu token và thông tin user
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Đăng nhập Admin thành công!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f4f7fa'
    }}>
      <div className="card" style={{ width: '400px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a6e', marginBottom: '20px' }}>Admin Login</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Hệ thống quản lý SinhVienJob
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#dc2626', padding: '10px',
            borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 600 }}>Email Admin</label>
            <input
              type="email"
              className="form-control"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 600 }}>Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', background: '#1e3a6e', borderColor: '#1e3a6e' }}
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
