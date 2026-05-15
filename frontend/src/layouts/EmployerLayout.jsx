import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import trạm phát sóng
import NotificationBell from '../components/notifications/NotificationBell';

function EmployerLayout() {
  const { userName, logout } = useAuth(); // Lấy Tên và hàm Đăng xuất
  const navigate = useNavigate();

  // State & Ref cho dropdown avatar
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm xử lý khi bấm nút Đăng xuất
  const handleLogout = () => {
    logout(); // Xóa Token khỏi bộ nhớ
    setShowDropdown(false);
    navigate('/employer/login'); // Đẩy về trang đăng nhập của Doanh nghiệp
  };

  // Hàm tự động tạo Avatar từ chữ cái đầu (VD: Thương Nguyên -> TN)
  const getInitials = (name) => {
    if (!name) return 'NTD';
    const words = name.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="app" style={{ display: 'flex', height: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* ===== CỘT SIDEBAR BÊN TRÁI ===== */}
      <div style={{ width: '250px', backgroundColor: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
          <Link to="/" style={{ fontSize: '20px', fontWeight: 700, color: '#10B981', textDecoration: 'none' }}>SinhVienJob Pro</Link>
        </div>
        
        {/* Menu điều hướng */}
        <div style={{ flex: 1, padding: '16px 0' }}>
          <Link to="/employer/dashboard" className="sidebar-item" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#334155' }}>Tổng quan</Link>
          <Link to="/employer/post-job" className="sidebar-item" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#334155' }}>Đăng tin mới</Link>
          <Link to="/employer/posted-jobs" className="sidebar-item" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#334155' }}>Tin đã đăng</Link>
          <Link to="/employer/applicants" className="sidebar-item" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#334155' }}>Hồ sơ ứng viên</Link>
          <Link to="/employer/profile" className="sidebar-item" style={{ display: 'block', padding: '12px 20px', textDecoration: 'none', color: '#334155' }}>Thông tin công ty</Link>
        </div>
        
        {/* Nút Đăng xuất ở cuối Sidebar */}
        {/* <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            Đăng xuất
          </button>
        </div> */}
      </div>

      {/* ===== KHU VỰC NỘI DUNG BÊN PHẢI ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* HEADER TOP CỦA NHÀ TUYỂN DỤNG */}
        <div style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', gap: '20px' }}>
          <NotificationBell />
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
            >
              {/* TÊN ĐỘNG */}
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                {userName || 'Doanh nghiệp'}
              </span>
              {/* AVATAR ĐỘNG */}
              <div style={{ width: '36px', height: '36px', backgroundColor: '#D1FAE5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px', transition: 'box-shadow 0.2s', boxShadow: showDropdown ? '0 0 0 3px rgba(16, 185, 129, 0.3)' : 'none' }}>
                {getInitials(userName)}
              </div>
            </div>

            {/* DROPDOWN MENU */}
            {showDropdown && (
              <div style={{
                position: 'absolute', top: '50px', right: '0',
                backgroundColor: '#fff', borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                width: '240px', zIndex: 1000, border: '1px solid #E2E8F0', overflow: 'hidden',
                animation: 'fadeIn 0.15s ease-out'
              }}>
                {/* Header: Tên công ty + label */}
                <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{userName || 'Doanh nghiệp'}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Nhà tuyển dụng</p>
                </div>

                {/* Menu items */}
                <div style={{ padding: '8px 0' }}>
                  <Link 
                    to="/employer/profile" 
                    onClick={() => setShowDropdown(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '16px' }}>👤</span> Hồ sơ cá nhân
                  </Link>
                  <Link 
                    to="/employer/settings" 
                    onClick={() => setShowDropdown(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#334155', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '16px' }}>⚙️</span> Cài đặt tài khoản
                  </Link>
                </div>

                {/* Đăng xuất */}
                <div style={{ borderTop: '1px solid #E2E8F0', padding: '4px 0', backgroundColor: '#FAFAF9' }}>
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#DC2626', fontSize: '14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '16px' }}>🚪</span> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NƠI HIỂN THỊ CÁC TRANG CON (Dashboard, PostJob,...) */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}

export default EmployerLayout;