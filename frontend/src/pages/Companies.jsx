import React from 'react';
import Topbar from '../components/Topbar';

function Companies() {
  const featuredCompanies = [
    { id: 1, name: 'FPT Software', industry: 'IT & Phần mềm', jobs: 45, logo: 'FP' },
    { id: 2, name: 'Momo', industry: 'Tài chính / Fintech', jobs: 12, logo: 'MM' },
    { id: 3, name: 'Shopee VN', industry: 'Thương mại điện tử', jobs: 28, logo: 'SP' },
    { id: 4, name: 'VNG Corporation', industry: 'Game & Nội dung số', jobs: 15, logo: 'VN' },
  ];

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        <div style={{ padding: '20px' }}>
          <p className="section-title">Nhà tuyển dụng nổi bật</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {featuredCompanies.map(company => (
              <div key={company.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
                <div className="avatar" style={{ width: '50px', height: '50px', borderRadius: '8px' }}>{company.logo}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '15px' }}>{company.name}</p>
                  <p className="text-muted" style={{ fontSize: '12px' }}>{company.industry}</p>
                  <p style={{ fontSize: '12px', color: '#3B6FE8', marginTop: '4px' }}>{company.jobs} vị trí đang tuyển</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companies;