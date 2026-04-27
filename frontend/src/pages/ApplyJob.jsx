import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

function ApplyJob() {
  const { id } = useParams();

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ maxWidth: '500px', margin: '40px auto' }}>
          <div className="card" style={{ padding: '24px' }}>
            <p className="section-title">Ứng tuyển công việc</p>
            <p style={{ fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
              Bạn đang ứng tuyển vị trí: <br/>
              <span style={{ fontWeight: 500, fontSize: '15px', color: '#185FA5' }}>Lập trình viên Frontend (Mã: {id})</span>
            </p>

            <div className="form-group">
              <label className="form-label">Chọn CV để nộp <span style={{ color: '#E24B4A' }}>*</span></label>
              <select className="form-input">
                <option>CV_NguyenVanA_ReactJS.pdf (CV đã lưu trong hồ sơ)</option>
                <option>+ Tải lên một CV khác từ máy tính...</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Thư xin việc (Cover Letter)</label>
              <textarea className="form-input" rows="5" style={{ resize: 'none' }} placeholder="Kính gửi Nhà tuyển dụng, tôi thấy mình rất phù hợp với vị trí này vì..."></textarea>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Nên viết ngắn gọn, súc tích để gây ấn tượng với NTD.</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <Link to={`/job/${id}`} style={{ flex: 1, textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', padding: '10px' }}>Hủy bỏ</button>
              </Link>
              <button className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Gửi đơn ứng tuyển</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyJob;