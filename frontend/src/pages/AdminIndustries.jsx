import React from 'react';

function AdminIndustries() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p className="section-title" style={{ margin: 0 }}>Danh sách ngành nghề</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input className="form-input" style={{ width: '180px' }} placeholder="Tên ngành mới..." />
          <button className="btn btn-primary" style={{ fontSize: '12px' }}>+ Thêm</button>
        </div>
      </div>
      
      <div className="table-wrap">
        <table>
          <thead><tr><th>Ngành nghề</th><th>Số tin</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            <tr><td>IT & Phần mềm</td><td>3,241</td><td><span className="badge badge-green">Hoạt động</span></td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
            <tr><td>Marketing & Truyền thông</td><td>1,856</td><td><span className="badge badge-green">Hoạt động</span></td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
            <tr><td>Thiết kế đồ họa</td><td>987</td><td><span className="badge badge-green">Hoạt động</span></td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
            <tr><td>Tài chính & Ngân hàng</td><td>742</td><td><span className="badge badge-green">Hoạt động</span></td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}>Ẩn</button></td></tr>
            <tr><td>Kinh doanh & Bán hàng</td><td>623</td><td><span className="badge badge-gray">Đã ẩn</span></td><td style={{ display: 'flex', gap: '4px' }}><button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Sửa</button><button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}>Hiện</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminIndustries;