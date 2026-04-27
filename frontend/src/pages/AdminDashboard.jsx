import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <>
      <div className="dash-kpi">
        <div className="kpi"><div className="kpi-num" style={{ color: '#3B6FE8' }}>52,401</div><div className="kpi-lbl">Tổng sinh viên</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#3B6D11' }}>1,248</div><div className="kpi-lbl">Nhà tuyển dụng</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#185FA5' }}>8,412</div><div className="kpi-lbl">Tin đang mở</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#854F0B' }}>127</div><div className="kpi-lbl">Chờ phê duyệt</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
        <div>
          <p className="section-title">Hoạt động gần đây</p>
          <div className="card"><p style={{ fontSize: '13px' }}>Nhà tuyển dụng mới đăng ký: <b>Shopee VN</b></p><p className="text-muted">2 phút trước</p></div>
          <div className="card" style={{ marginTop: '8px' }}><p style={{ fontSize: '13px' }}>Tin tuyển dụng cần duyệt: <b>BA Junior - FPT</b></p><p className="text-muted">15 phút trước</p></div>
          <div className="card" style={{ marginTop: '8px' }}><p style={{ fontSize: '13px' }}>Báo cáo tài khoản: <b>Sinh viên #10234</b></p><p className="text-muted">1 giờ trước</p></div>
        </div>
        
        <div>
          <p className="section-title">Thao tác nhanh</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/admin/jobs" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start' }}>Duyệt tin tuyển dụng (127)</button>
            </Link>
            <Link to="/admin/accounts" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start' }}>Quản lý tài khoản</button>
            </Link>
            <Link to="/admin/industries" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', justifyContent: 'flex-start' }}>Quản lý ngành nghề</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;