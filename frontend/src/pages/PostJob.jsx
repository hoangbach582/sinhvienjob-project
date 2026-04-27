import React from 'react';

function PostJob() {
  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="section-title">Đăng tin tuyển dụng mới</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tiêu đề vị trí</label>
          <input className="form-input" placeholder="Vd: Lập trình viên Frontend" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Loại hình</label>
          <select className="form-input">
            <option>Part-time</option>
            <option>Internship</option>
            <option>Full-time</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Ngành nghề</label>
          <select className="form-input">
            <option>IT & Phần mềm</option>
            <option>Marketing</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Mức lương (triệu)</label>
          <input className="form-input" placeholder="Vd: 5-8" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Địa điểm</label>
          <select className="form-input">
            <option>Hà Nội</option>
            <option>TP.HCM</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Kinh nghiệm</label>
          <select className="form-input">
            <option>Không yêu cầu</option>
            <option>Dưới 1 năm</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Hạn nộp hồ sơ</label>
          <input className="form-input" type="date" />
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Mô tả công việc</label>
          <textarea className="form-input" rows="4" style={{ resize: 'none' }} placeholder="Mô tả chi tiết công việc, trách nhiệm..."></textarea>
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Yêu cầu ứng viên</label>
          <textarea className="form-input" rows="3" style={{ resize: 'none' }} placeholder="Kỹ năng, trình độ, điều kiện cần có..."></textarea>
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Quyền lợi</label>
          <textarea className="form-input" rows="3" style={{ resize: 'none' }} placeholder="Thưởng, bảo hiểm, môi trường làm việc..."></textarea>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="btn">Lưu nháp</button>
        <button className="btn btn-primary">Gửi duyệt</button>
      </div>
    </div>
  );
}

export default PostJob;