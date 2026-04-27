import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="app">
      <div className="mock-frame">
        {/* TOPBAR RIÊNG CỦA ADMIN MÀU XANH ĐẬM */}
        <div className="mock-topbar" style={{ background: '#1e3a6e' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>SinhVienJob Admin</span>
          
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#aad4f7' }}>
            <Link to="/admin/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Tổng quan</Link>
            <Link to="/admin/accounts" style={{ color: 'inherit', textDecoration: 'none' }}>Tài khoản</Link>
            <Link to="/admin/jobs" style={{ color: 'inherit', textDecoration: 'none' }}>Tin tuyển dụng</Link>
            <Link to="/admin/industries" style={{ color: 'inherit', textDecoration: 'none' }}>Ngành nghề</Link>
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