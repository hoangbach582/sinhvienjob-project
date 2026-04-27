import React, { useState } from 'react';

function AdminJobs() {
  const [activeTab, setActiveTab] = useState('pending'); // Mặc định mở tab Chờ duyệt

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button 
          className={`btn ${activeTab === 'approved' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('approved')}
          style={{ fontSize: '12px' }}
        >
          Tin đã duyệt
        </button>
        <button 
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('pending')}
          style={{ fontSize: '12px' }}
        >
          Chờ duyệt (127)
        </button>
      </div>

      {/* Tab Tin đã duyệt */}
      {activeTab === 'approved' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tiêu đề</th><th>Công ty</th><th>Loại</th><th>Ngày duyệt</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              <tr><td>Lập trình viên Frontend</td><td>FPT Software</td><td><span className="badge badge-green">Part-time</span></td><td>10/04/2026</td><td><span className="badge badge-blue">Đang mở</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
              <tr><td>Thực tập sinh Marketing</td><td>Momo</td><td><span className="badge badge-orange">Internship</span></td><td>09/04/2026</td><td><span className="badge badge-blue">Đang mở</span></td><td><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Chờ duyệt */}
      {activeTab === 'pending' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tiêu đề</th><th>Công ty</th><th>Loại</th><th>Gửi lúc</th><th>Hành động</th></tr></thead>
            <tbody>
              <tr><td>BA Junior</td><td>FPT Software</td><td><span className="badge badge-blue">Full-time</span></td><td>15/04/2026</td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Duyệt</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Từ chối</button></td></tr>
              <tr><td>Thực tập Data Analyst</td><td>FPT Software</td><td><span className="badge badge-orange">Internship</span></td><td>14/04/2026</td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Duyệt</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Từ chối</button></td></tr>
              <tr><td>Marketing Content Intern</td><td>Shopee VN</td><td><span className="badge badge-orange">Internship</span></td><td>12/04/2026</td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Duyệt</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Từ chối</button></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminJobs;