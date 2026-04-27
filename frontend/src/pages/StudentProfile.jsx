import React from 'react';
import Topbar from '../components/Topbar';

function StudentProfile() {
  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px' }}>
          <p className="section-title">Hồ sơ & CV của tôi</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Cột trái: Ảnh đại diện & File CV */}
            <div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="avatar" style={{ width: '80px', height: '80px', margin: '0 auto 10px', fontSize: '24px' }}>SV</div>
                <p style={{ fontWeight: 500 }}>Nguyễn Văn A</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>Sinh viên IT</p>
              </div>
              
              <div className="card" style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>CV Đính kèm</p>
                <div style={{ padding: '20px 10px', border: '1px dashed var(--color-border-tertiary)', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', background: 'var(--color-background-secondary)' }}>
                  <p style={{ fontSize: '12px', color: '#3B6FE8', fontWeight: 500 }}>+ Tải CV lên (PDF)</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Tối đa 5MB</p>
                </div>
              </div>
            </div>

            {/* Cột phải: Form nhập thông tin */}
            <div className="card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Họ và tên</label>
                  <input className="form-input" defaultValue="Nguyễn Văn A" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-input" defaultValue="0912 345 678" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue="email@example.com" disabled style={{ background: 'var(--color-background-secondary)' }} />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Trường Đại học / Cao đẳng</label>
                  <input className="form-input" defaultValue="Cao đẳng Nghề Công nghệ cao Hà Nội (HACTECH)" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Chuyên ngành</label>
                  <input className="form-input" defaultValue="Ứng dụng phần mềm" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Năm tốt nghiệp (Dự kiến)</label>
                  <input className="form-input" defaultValue="2026" />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Kỹ năng chuyên môn</label>
                  <input className="form-input" defaultValue="JavaScript, React, Node.js, PHP, SQL" />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Giới thiệu bản thân (Lương kỳ vọng, Mục tiêu)</label>
                  <textarea className="form-input" rows="4" style={{ resize: 'none' }} defaultValue="Mục tiêu trở thành Web Developer chuyên nghiệp. Mong muốn tìm kiếm công việc remote để phát triển kỹ năng lập trình."></textarea>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="btn btn-primary">Lưu thông tin</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;