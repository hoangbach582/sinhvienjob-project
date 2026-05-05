import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar() {
  const { isLoggedIn, userName, userRole, userAvatar, logout } = useAuth(); 
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'US';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* TRÁI: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Link to="/" className="mock-logo" style={{ textDecoration: 'none', fontSize: '22px', fontWeight: 'bold', color: '#3B82F6' }}>
            SinhVienJob
          </Link>
        </div>
        
        {/* GIỮA: Menu thông minh thay đổi theo Role */}
        <div className="mock-nav" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <Link to="/jobs" style={{ textDecoration: 'none', color: '#475569', fontWeight: 500, fontSize: '15px' }}>Tìm việc</Link>
          <Link to="/companies" style={{ textDecoration: 'none', color: '#334155', fontWeight: 500 }}>Công ty</Link>
          {/* LOGIC ĐỔI MENU Ở ĐÂY */}
          {isLoggedIn && userRole === 'student' ? (
            <Link to="/build-cv" style={{ textDecoration: 'none', color: '#10B981', fontWeight: 600, fontSize: '15px' }}>
              ✨ Build CV
            </Link>
          ) : (
            <Link to="/employer/login" style={{ textDecoration: 'none', color: '#10B981', fontWeight: 500, fontSize: '15px' }}>
              Dành cho Nhà tuyển dụng
            </Link>
          )}
        </div>

        {/* PHẢI: Nút Đăng nhập/Đăng ký hoặc Avatar */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div 
                className="avatar" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ width: '38px', height: '38px', fontSize: '14px', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s', backgroundColor: '#DBEAFE', color: '#1E3A8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                title="Tài khoản của tôi"
              >
                {/* LOGIC HIỂN THỊ: CÓ ẢNH THÌ HIỆN ẢNH, KHÔNG CÓ THÌ HIỆN CHỮ */}
                {userAvatar ? (
                  <img src={userAvatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  getInitials(userName)
                )}
              </div>

              {showDropdown && (
                <div style={{ 
                  position: 'absolute', top: '50px', right: '0', 
                  backgroundColor: '#fff', borderRadius: '12px', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
                  width: '240px', zIndex: 1000, border: '1px solid #E2E8F0', overflow: 'hidden' 
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{userName || 'Người dùng'}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      {userRole === 'student' ? 'Hồ sơ Sinh viên' : 'Nhà tuyển dụng'}
                    </p>
                  </div>

                  <div style={{ padding: '8px 0' }}>
                    <Link to={userRole === 'employer' ? '/employer/dashboard' : '/profile'} onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '12px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                      👤 Hồ sơ cá nhân
                    </Link>
                    {userRole === 'student' && (
                      <Link to="/applied-jobs" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '12px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                        💼 Việc của tôi
                      </Link>
                    )}
                    <Link to="/settings" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '12px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                      ⚙️ Cài đặt tài khoản
                    </Link>
                  </div>

                  <div style={{ borderTop: '1px solid #E2E8F0', padding: '4px 0', backgroundColor: '#FAFAF9' }}>
                    <button 
                      onClick={handleLogout} 
                      style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#DC2626', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 600, fontSize: '15px', padding: '8px 12px' }}>Đăng nhập</Link>
              <Link to="/register" style={{ textDecoration: 'none', backgroundColor: '#3B82F6', color: '#fff', fontWeight: 600, fontSize: '15px', padding: '10px 24px', borderRadius: '8px' }}>Đăng ký</Link>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Topbar;