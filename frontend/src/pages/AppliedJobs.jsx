import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

function AppliedJobs() {
  const [activeTab, setActiveTab] = useState('applied');

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 16px' }}>
          <p className="section-title">Quản lý việc làm</p>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button 
              className={`btn ${activeTab === 'applied' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveTab('applied')}
            >
              Đã ứng tuyển (3)
            </button>
            <button 
              className={`btn ${activeTab === 'saved' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveTab('saved')}
            >
              Đã lưu (5)
            </button>
          </div>

          {/* Danh sách công việc ĐÃ ỨNG TUYỂN */}
          {activeTab === 'applied' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Link to="/job/1" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <p className="job-title" style={{ fontSize: '15px' }}>Lập trình viên Frontend</p>
                    </Link>
                    <p className="job-company">FPT Software</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Đã nộp: 16/04/2026 - CV: CV_NguyenVanA_ReactJS.pdf</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ backgroundColor: '#FEF5E5', color: '#854F0B', borderColor: '#FDE1B9', fontSize: '12px' }}>Chờ xử lý</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Link to="/job/2" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <p className="job-title" style={{ fontSize: '15px' }}>Thực tập sinh Marketing</p>
                    </Link>
                    <p className="job-company">Momo</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Đã nộp: 10/04/2026 - CV: CV_Marketing_NVA.pdf</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ backgroundColor: '#EAF3DE', color: '#3B6D11', borderColor: '#C8E6A2', fontSize: '12px' }}>Mời phỏng vấn</span>
                    <p style={{ fontSize: '11px', color: '#3B6FE8', marginTop: '6px', cursor: 'pointer' }}>Xem thư mời</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Link to="/job/3" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <p className="job-title" style={{ fontSize: '15px' }}>Nhân viên Part-time</p>
                    </Link>
                    <p className="job-company">The Coffee House</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Đã nộp: 01/04/2026 - CV: CV_Chung.pdf</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ backgroundColor: '#FDECEC', color: '#E24B4A', borderColor: '#FAD4D4', fontSize: '12px' }}>Hồ sơ không phù hợp</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách công việc ĐÃ LƯU (Hiển thị tượng trưng 1 cái) */}
          {activeTab === 'saved' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Link to="/job/4" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <p className="job-title" style={{ fontSize: '15px' }}>Thiết kế UI/UX</p>
                    </Link>
                    <p className="job-company">VNG Corporation</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Đã lưu: Hôm nay</p>
                  </div>
                  <div>
                    <button className="btn btn-primary" style={{ fontSize: '12px', marginRight: '8px' }}>Ứng tuyển</button>
                    <button className="btn" style={{ fontSize: '12px', borderColor: '#E24B4A', color: '#E24B4A' }}>Bỏ lưu</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AppliedJobs;