import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  // Đồng bộ kiểm tra token từ localStorage để tránh bị chớp màn hình (flicker)
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  let role = localStorage.getItem('role');
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.role) {
      role = userData.role;
    }
  } catch (e) {}

  // Lấy hàm logout từ context nếu cần làm nút đăng xuất
  const { logout } = useAuth();

  // Nếu không có token hoặc không phải admin thì đẩy về trang login
  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#fff' : 'inherit',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <div className="app">
      <div className="mock-frame">
        {/* TOPBAR RIÊNG CỦA ADMIN MÀU XANH ĐẬM */}
        <div className="mock-topbar" style={{ background: '#1e3a6e' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>SinhVienJob Admin</span>
          
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#aad4f7' }}>
            <NavLink to="/admin/dashboard" style={navLinkStyle}>Tổng quan</NavLink>
            <NavLink to="/admin/accounts" style={navLinkStyle}>Tài khoản</NavLink>
            <NavLink to="/admin/jobs" style={navLinkStyle}>Tin tuyển dụng</NavLink>
            <NavLink to="/admin/industries" style={navLinkStyle}>Ngành nghề</NavLink>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="avatar" style={{ background: '#185FA5', color: '#aad4f7' }}>AD</div>
            <span style={{ fontSize: '13px', color: '#aad4f7' }}>Admin</span>
          </div>
        </div>

        {/* VÙNG CHỨA NỘI DUNG THAY ĐỔI */}
        <div style={{ padding: '20px', minHeight: '500px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;