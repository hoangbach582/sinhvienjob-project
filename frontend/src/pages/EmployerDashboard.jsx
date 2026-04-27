import React from 'react';

function EmployerDashboard() {
  return (
    <>
      <p className="section-title">Tổng quan</p>
      
      <div className="dash-kpi">
        <div className="kpi"><div className="kpi-num" style={{ color: '#3B6FE8' }}>12</div><div className="kpi-lbl">Tin đang hoạt động</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#854F0B' }}>3</div><div className="kpi-lbl">Chờ phê duyệt</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#3B6D11' }}>87</div><div className="kpi-lbl">Hồ sơ nhận được</div></div>
        <div className="kpi"><div className="kpi-num" style={{ color: '#185FA5' }}>24</div><div className="kpi-lbl">Hồ sơ tháng này</div></div>
      </div>

      <p className="section-title" style={{ marginTop: '20px' }}>Tin tuyển dụng gần đây</p>
      
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Loại</th>
              <th>Hồ sơ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lập trình viên Frontend</td>
              <td><span className="badge badge-green">Part-time</span></td>
              <td>23</td>
              <td><span className="badge badge-blue">Đang mở</span></td>
              <td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Xem</button></td>
            </tr>
            {/* Các hàng khác... */}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployerDashboard;