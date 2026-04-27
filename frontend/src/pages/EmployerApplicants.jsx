import React from 'react';

function EmployerApplicants() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p className="section-title" style={{ margin: 0 }}>Quản lý hồ sơ ứng viên</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select className="form-input" style={{ width: '180px', fontSize: '13px' }}>
            <option>Tất cả trạng thái</option>
            <option>Chờ xử lý</option>
            <option>Mời phỏng vấn</option>
            <option>Đã từ chối</option>
          </select>
          <input className="form-input" placeholder="Tìm theo tên..." style={{ fontSize: '13px' }} />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ứng viên</th>
              <th>Vị trí ứng tuyển</th>
              <th>Ngày nộp</th>
              <th>CV</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p style={{ fontWeight: 500 }}>Nguyễn Văn A</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>nva@email.com</p>
              </td>
              <td>Lập trình viên Frontend</td>
              <td>16/04/2026</td>
              <td><a href="#" style={{ color: '#3B6FE8', fontSize: '12px' }}>Xem CV</a></td>
              <td>
                <select className="form-input" style={{ padding: '4px 8px', fontSize: '12px', height: 'auto', backgroundColor: '#FEF5E5', color: '#854F0B', borderColor: '#FDE1B9' }}>
                  <option>Chờ xử lý</option>
                  <option>Mời phỏng vấn</option>
                  <option>Từ chối</option>
                </select>
              </td>
              <td><button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 8px' }}>Lưu</button></td>
            </tr>
            <tr>
              <td>
                <p style={{ fontWeight: 500 }}>Trần Thị B</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>ttb@email.com</p>
              </td>
              <td>Thực tập sinh Marketing</td>
              <td>15/04/2026</td>
              <td><a href="#" style={{ color: '#3B6FE8', fontSize: '12px' }}>Xem CV</a></td>
              <td>
                <select className="form-input" style={{ padding: '4px 8px', fontSize: '12px', height: 'auto', backgroundColor: '#EAF3DE', color: '#3B6D11', borderColor: '#C8E6A2' }}>
                  <option>Mời phỏng vấn</option>
                  <option>Chờ xử lý</option>
                  <option>Từ chối</option>
                </select>
              </td>
              <td><button className="btn btn-primary" style={{ fontSize: '11px', padding: '4px 8px' }}>Lưu</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployerApplicants;