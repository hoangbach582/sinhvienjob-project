import React, { useState } from 'react';

function AdminAccounts() {
  // Sử dụng useState để quản lý tab đang mở ('nsd' hoặc 'uv')
  const [activeTab, setActiveTab] = useState('nsd');

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button 
          className={`btn ${activeTab === 'nsd' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('nsd')}
          style={{ fontSize: '12px' }}
        >
          Nhà tuyển dụng
        </button>
        <button 
          className={`btn ${activeTab === 'uv' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('uv')}
          style={{ fontSize: '12px' }}
        >
          Ứng viên
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <input className="form-input" style={{ width: '200px' }} placeholder="Tìm kiếm..." />
          <button className="btn" style={{ fontSize: '12px' }}>Tìm</button>
        </div>
      </div>

      {/* Bảng Nhà tuyển dụng */}
      {activeTab === 'nsd' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Công ty</th><th>Email</th><th>Đăng ký</th><th>Tin đã đăng</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              <tr><td>FPT Software</td><td>hr@fpt-software.com</td><td>01/01/2024</td><td>45</td><td><span className="badge badge-green">Hoạt động</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Khóa</button></td></tr>
              <tr><td>Momo</td><td>hr@momo.vn</td><td>15/02/2024</td><td>23</td><td><span className="badge badge-green">Hoạt động</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Khóa</button></td></tr>
              <tr><td>Shopee VN</td><td>talent@shopee.vn</td><td>16/04/2026</td><td>0</td><td><span className="badge badge-orange">Chờ duyệt</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Duyệt</button></td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Bảng Ứng viên */}
      {activeTab === 'uv' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Họ tên</th><th>Email</th><th>Trường</th><th>Đăng ký</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              <tr><td>Nguyễn Văn A</td><td>nva@email.com</td><td>ĐH Bách Khoa HN</td><td>10/03/2026</td><td><span className="badge badge-green">Hoạt động</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Khóa</button></td></tr>
              <tr><td>Trần Thị B</td><td>ttb@email.com</td><td>ĐH Kinh tế QD</td><td>05/04/2026</td><td><span className="badge badge-green">Hoạt động</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Khóa</button></td></tr>
              <tr><td>Lê Minh C</td><td>lmc@email.com</td><td>ĐH FPT</td><td>12/04/2026</td><td><span className="badge badge-red">Bị khóa</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Mở khóa</button></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminAccounts;