import React from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

function Jobs() {
  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
          {/* Cột bộ lọc (Sidebar) */}
          <div style={{ padding: '16px', borderRight: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>Bộ lọc</p>
            
            <div className="form-group">
              <label className="form-label">Loại công việc</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <label><input type="checkbox" defaultChecked /> Part-time</label>
                <label><input type="checkbox" /> Internship</label>
                <label><input type="checkbox" /> Full-time</label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Địa điểm</label>
              <select className="form-input"><option>Tất cả</option><option>Hà Nội</option><option>TP.HCM</option></select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Mức lương</label>
              <select className="form-input"><option>Tất cả</option><option>Dưới 5tr</option><option>5-10tr</option></select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Ngành nghề</label>
              <select className="form-input"><option>Tất cả</option><option>IT</option><option>Marketing</option></select>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%' }}>Áp dụng</button>
          </div>

          {/* Cột danh sách việc làm */}
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input className="form-input" style={{ flex: 1 }} placeholder="Tìm kiếm..." />
              <button className="btn btn-primary">Tìm</button>
            </div>
            
            <p className="text-muted" style={{ marginBottom: '10px' }}>Tìm thấy 124 việc làm</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Thẻ Job 1 (Có Link bọc ngoài để click chuyển trang) */}
              <Link to="/job/1" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><p className="job-title">Lập trình viên Frontend</p><p className="job-company">FPT Software · Hà Nội</p></div>
                    <span className="badge badge-green">Part-time</span>
                  </div>
                  <div className="tag-row" style={{ marginTop: '8px' }}>
                    <span className="tag">React.js</span><span className="tag">5-8tr/tháng</span><span className="tag">3 ngày trước</span>
                  </div>
                </div>
              </Link>

              {/* Thẻ Job 2 */}
              <Link to="/job/2" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><p className="job-title">Thực tập sinh Marketing</p><p className="job-company">Momo · TP.HCM</p></div>
                    <span className="badge badge-orange">Internship</span>
                  </div>
                  <div className="tag-row" style={{ marginTop: '8px' }}>
                    <span className="tag">Digital Marketing</span><span class="tag">Có lương</span><span className="tag">1 ngày trước</span>
                  </div>
                </div>
              </Link>

              {/* Thẻ Job 3 */}
              <Link to="/job/3" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><p className="job-title">Thiết kế UI/UX</p><p className="job-company">VNG Corporation · TP.HCM</p></div>
                    <span className="badge badge-blue">Full-time</span>
                  </div>
                  <div className="tag-row" style={{ marginTop: '8px' }}>
                    <span className="tag">Figma</span><span className="tag">8-12tr/tháng</span><span className="tag">Hôm nay</span>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;