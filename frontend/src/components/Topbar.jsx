import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar() {
  // Lấy thêm userName từ Context
  const { isLoggedIn, userName, userRole, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hàm tự động tạo Avatar từ tên (VD: Hàn Lập -> HL)
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
        
        {/* Đổi dòng Công ty / Nhà tuyển dụng */}
        <Link to="/companies" style={{ textDecoration: 'none', color: 'inherit' }}>Công ty</Link>
        
        {/* Nút đăng nhập/đăng tuyển riêng cho Nhà tuyển dụng */}
        <Link to="/employer/login" style={{ textDecoration: 'none', color: '#10B981', fontWeight: 500 }}>
          Dành cho Nhà tuyển dụng
        </Link>

        {isLoggedIn && userRole === 'student' && (
          <Link to="/my-jobs" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
            Việc của tôi
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Link to={userRole === 'employer' ? '/employer/dashboard' : '/profile'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Hiển thị Tên thật */}
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {userName || 'Người dùng'}
              </span>
              {/* Hiển thị Avatar động */}
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                {getInitials(userName)}
              </div>
            </Link>
            <button onClick={handleLogout} className="btn" style={{ fontSize: '12px', padding: '6px 10px', borderColor: '#E24B4A', color: '#E24B4A' }}>
              Đăng xuất
            </button>
          </>
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