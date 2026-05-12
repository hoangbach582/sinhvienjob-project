import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <>
      <div className="dash-kpi">
        <div className="kpi">
          <div className="kpi-num" style={{ color: '#3B6FE8' }}>---</div>
          <div className="kpi-lbl">Tổng sinh viên</div>
        </div>
        <div className="kpi">
          <div className="kpi-num" style={{ color: '#3B6D11' }}>---</div>
          <div className="kpi-lbl">Nhà tuyển dụng</div>
        </div>
        <div className="kpi">
          <div className="kpi-num" style={{ color: '#185FA5' }}>---</div>
          <div className="kpi-lbl">Tin đang mở</div>
        </div>
        <div className="kpi">
          <div className="kpi-num" style={{ color: '#854F0B' }}>---</div>
          <div className="kpi-lbl">Chờ phê duyệt</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
        <div>
          <p className="section-title">Hoạt động gần đây</p>
          <div className="card">
            <p style={{ fontSize: '13px' }}>Hệ thống đang hoạt động ổn định.</p>
            <p className="text-muted">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="card" style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '13px' }}>Sẵn sàng kiểm duyệt các tin đăng mới.</p>
          </div>
        </div>
        
        <div>
          <p className="section-title">Thao tác nhanh</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/admin/jobs" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}>
                  <span style={{ marginRight: '8px' }}>📋</span> Duyệt tin tuyển dụng
                </button>
            </Link>
            <Link to="/admin/accounts" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}>
                  <span style={{ marginRight: '8px' }}>👥</span> Quản lý tài khoản
                </button>
            </Link>
            <Link to="/admin/industries" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}>
                  <span style={{ marginRight: '8px' }}>🏢</span> Quản lý ngành nghề
                </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;