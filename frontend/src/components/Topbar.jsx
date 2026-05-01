import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar() {
  const { isLoggedIn, userName, userRole, logout } = useAuth(); 
  const navigate = useNavigate();

  // State và Ref để xử lý Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  // Xử lý hiệu ứng click ra ngoài vùng Dropdown thì tự đóng
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm tự động tạo Avatar từ tên
  const getInitials = (name) => {
    if (!name) return 'US';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mock-topbar">
      <Link to="/" className="mock-logo" style={{ textDecoration: 'none' }}>
        SinhVienJob
      </Link>
      
      <div className="mock-nav">
        <Link to="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>Tìm việc</Link>
        <Link to="/companies" style={{ textDecoration: 'none', color: 'inherit' }}>Công ty</Link>
        <Link to="/employer/login" style={{ textDecoration: 'none', color: '#10B981', fontWeight: 500 }}>
          Dành cho Nhà tuyển dụng
        </Link>
        {/* Đã xóa "Việc của tôi" ở đây để đưa vào trong Dropdown */}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isLoggedIn ? (
          // Khối chứa Avatar và Dropdown
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            
            {/* Nút Avatar (Đã ẩn tên đi) */}
            <div 
              className="avatar" 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ width: '36px', height: '36px', fontSize: '14px', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}
              title="Tài khoản của tôi"
            >
              {getInitials(userName)}
            </div>

            {/* Menu Dropdown thả xuống */}
            {showDropdown && (
              <div style={{ 
                position: 'absolute', top: '48px', right: '0', 
                backgroundColor: '#fff', borderRadius: '8px', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', 
                width: '220px', zIndex: 1000, border: '1px solid #E2E8F0', overflow: 'hidden' 
              }}>
                
                {/* Header Dropdown */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{userName || 'Người dùng'}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {userRole === 'student' ? 'Hồ sơ Sinh viên' : 'Nhà tuyển dụng'}
                  </p>
                </div>

                {/* Các menu liên kết */}
                <div style={{ padding: '8px 0' }}>
                  <Link to={userRole === 'employer' ? '/employer/dashboard' : '/profile'} onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                    👤 Hồ sơ cá nhân
                  </Link>
                  
                  {/* Mục Việc của tôi chỉ hiện ra nếu là Sinh viên */}
                  {userRole === 'student' && (
                    <Link to="/applied-jobs" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                      💼 Việc của tôi
                    </Link>
                  )}

                  <Link to="/settings" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                    ⚙️ Cài đặt tài khoản
                  </Link>
                </div>

                {/* Nút Đăng xuất */}
                <div style={{ borderTop: '1px solid #E2E8F0', padding: '4px 0', backgroundColor: '#FAFAF9' }}>
                  <button 
                    onClick={handleLogout} 
                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', color: '#DC2626', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login"><button className="btn">Đăng nhập</button></Link>
            <Link to="/register"><button className="btn btn-primary">Đăng ký</button></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;