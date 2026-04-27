import React from 'react';

function EmployerProfile() {
  return (
    <div style={{ maxWidth: '700px' }}>
      <p className="section-title">Thông tin công ty</p>
      
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
          <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '20px', background: '#EAF3DE', color: '#3B6D11' }}>FP</div>
          <div>
            <button className="btn" style={{ fontSize: '12px', padding: '6px 12px' }}>Tải logo lên</button>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>Định dạng JPG, PNG. Tối đa 2MB.</p>
          </div>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tên công ty</label>
          <input className="form-input" defaultValue="FPT Software" />
        </div>

        <div className="form-group">
          <label className="form-label">Lĩnh vực hoạt động</label>
          <input className="form-input" defaultValue="Công nghệ thông tin / Phần mềm" />
        </div>

        <div className="form-group">
          <label className="form-label">Website</label>
          <input className="form-input" defaultValue="https://fptsoftware.com" />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Giới thiệu về công ty</label>
          <textarea className="form-input" rows="5" style={{ resize: 'none' }} defaultValue="FPT Software là công ty thành viên thuộc Tập đoàn FPT, hoạt động trong lĩnh vực gia công phần mềm..."></textarea>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button className="btn btn-primary">Cập nhật thông tin</button>
        </div>
      </div>
    </div>
  );
}

export default EmployerProfile;