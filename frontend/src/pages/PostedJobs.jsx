import React from 'react';
import { Link } from 'react-router-dom';

function PostedJobs() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p className="section-title" style={{ margin: 0 }}>Tin tuyển dụng đã đăng</p>
        <Link to="/employer/post-job">
          <button className="btn btn-primary" style={{ fontSize: '12px' }}>+ Đăng tin mới</button>
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Hồ sơ</th>
              <th>Hạn nộp</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lập trình viên Frontend</td>
              <td><span className="badge badge-green">Part-time</span></td>
              <td>23</td>
              <td>30/05/2026</td>
              <td><span className="badge badge-blue">Đang mở</span></td>
              <td style={{ display: 'flex', gap: '4px' }}>
                <button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button>
                <button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Đóng</button>
              </td>
            </tr>
            <tr>
              <td>Kỹ sư QA Intern</td>
              <td><span className="badge badge-orange">Internship</span></td>
              <td>15</td>
              <td>15/05/2026</td>
              <td><span className="badge badge-blue">Đang mở</span></td>
              <td style={{ display: 'flex', gap: '4px' }}>
                <button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button>
                <button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Đóng</button>
              </td>
            </tr>
            <tr>
              <td>DevOps Engineer</td>
              <td><span className="badge badge-blue">Full-time</span></td>
              <td>41</td>
              <td>01/04/2026</td>
              <td><span className="badge badge-gray">Đã đóng</span></td>
              <td>
                <button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Xem</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PostedJobs;