import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/login`,
        { email, password }
      );
      const { access_token, user } = response.data;
      if (user.role !== 'admin') {
        setError('Tài khoản này không có quyền Admin.');
        setLoading(false);
        return;
      }
      // Đồng bộ vào AuthContext VÀ localStorage
      login(access_token, user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans"
      style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #DBEAFE 100%)' }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', top: '-120px', left: '-120px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 420, margin: '0 16px', position: 'relative', zIndex: 10 }}
      >
        <div style={{
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(99,102,241,0.1)',
        }}>
          {/* === COLORED HEADER === */}
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
            padding: '36px 32px 32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
              <span style={{ color: '#fff', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>A</span>
            </div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
              Admin Portal
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6, fontWeight: 500 }}>
              SinhVienJob · Hệ thống Quản trị
            </div>
          </div>

          {/* === FORM BODY === */}
          <div style={{ padding: '32px' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  color: '#DC2626', padding: '10px 14px',
                  borderRadius: 12, marginBottom: 20,
                  fontSize: 13, fontWeight: 500,
                }}
              >
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#DC2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>!</span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email field */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  placeholder="admin@sinhvienjob.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 14px',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12,
                    fontSize: 14, fontWeight: 500,
                    color: '#1F2937', background: '#F9FAFB',
                    outline: 'none', transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Password field */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Mật khẩu
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '11px 44px 11px 14px',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 12,
                      fontSize: 14, fontWeight: 500,
                      color: '#1F2937', background: '#F9FAFB',
                      outline: 'none', transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: 4, display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  background: loading ? '#A5B4FC' : 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(79,70,229,0.3)',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Đang xác thực...
                  </>
                ) : 'Đăng nhập hệ thống'}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
              &copy; {new Date().getFullYear()} SinhVienJob · Nền tảng tuyển dụng sinh viên
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminLogin;
