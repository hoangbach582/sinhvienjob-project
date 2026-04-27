import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';

function JobDetail() {
  // Hook này dùng để lấy ID công việc trên URL (ví dụ: /job/1 -> id = 1)
  const { id } = useParams();

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 0 }}>
          {/* Cột Nội dung chi tiết (Bên trái) */}
          <div style={{ padding: '20px', borderRight: '0.5px solid var(--color-border-tertiary)' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#185FA5', fontSize: '16px' }}>
                FPT
              </div>
              <div>
                <p style={{ fontSize: '17px', fontWeight: 500 }}>Lập trình viên Frontend (ID: {id})</p>
                <p className="text-muted">FPT Software · Hà Nội · Đăng 3 ngày trước</p>
                <div className="tag-row" style={{ marginTop: '6px' }}>
                  <span className="badge badge-green">Part-time</span>
                  <span className="badge badge-blue">5-8 triệu/tháng</span>
                </div>
              </div>
            </div>
            
            <hr className="divider" />
            
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Mô tả công việc</p>
            <ul style={{ fontSize: '13px', color: 'var(--color-text-secondary)', paddingLeft: '16px', lineHeight: 1.8 }}>
              <li>Phát triển giao diện web bằng React.js và TypeScript</li>
              <li>Tích hợp API từ Backend team</li>
              <li>Làm việc 4 buổi/tuần, linh hoạt giờ giấc</li>
              <li>Mentor trực tiếp từ Senior Developer</li>
            </ul>
            
            <hr className="divider" />
            
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Yêu cầu</p>
            <ul style={{ fontSize: '13px', color: 'var(--color-text-secondary)', paddingLeft: '16px', lineHeight: 1.8 }}>
              <li>Biết HTML, CSS, JavaScript cơ bản</li>
              <li>Đang học năm 2, 3 ngành CNTT</li>
              <li>Có thể đi làm ít nhất 4 buổi/tuần</li>
            </ul>
          </div>

          {/* Cột Thông tin tóm tắt & Nút (Bên phải) */}
          <div style={{ padding: '20px' }}>
            {/* Nút ứng tuyển - Sau này sẽ làm chức năng bật Modal popup tải CV lên */}
            <Link to={`/job/${id}/apply`} style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                    Ứng tuyển ngay
                </button>
            </Link>
            <button className="btn" style={{ width: '100%', padding: '10px', marginBottom: '16px' }}>
              Lưu tin
            </button>
            
            <div className="card">
              <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>Thông tin tuyển dụng</p>
              <table style={{ fontSize: '12px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ color: 'var(--color-text-secondary)', padding: '4px 0' }}>Mức lương</td><td style={{ textAlign: 'right' }}>5-8 triệu</td></tr>
                  <tr><td style={{ color: 'var(--color-text-secondary)', padding: '4px 0' }}>Loại hình</td><td style={{ textAlign: 'right' }}>Part-time</td></tr>
                  <tr><td style={{ color: 'var(--color-text-secondary)', padding: '4px 0' }}>Kinh nghiệm</td><td style={{ textAlign: 'right' }}>Không yêu cầu</td></tr>
                  <tr><td style={{ color: 'var(--color-text-secondary)', padding: '4px 0' }}>Hạn nộp</td><td style={{ textAlign: 'right' }}>30/05/2026</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="card" style={{ marginTop: '10px', cursor: 'pointer' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>FPT Software</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Công ty CNTT hàng đầu Việt Nam · 10,000+ nhân viên</p>
              <p style={{ fontSize: '12px', color: '#3B6FE8', marginTop: '4px' }}>Xem trang công ty →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;