import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';

function Home() {
  // 1. Tạo State để lưu trữ dữ liệu từ API
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 2. Gọi API ngay khi trang vừa load xong
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/jobs/latest');
      const data = await response.json();
      setJobs(data); // Đưa dữ liệu vào State
    } catch (error) {
      console.error("Lỗi khi tải việc làm:", error);
    } finally {
      setLoading(false); // Tắt hiệu ứng loading
    }
  };

  // Hàm phụ: Định dạng tiền tệ (Ví dụ: 8000000 -> 8 tr)
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return 'Thỏa thuận';
  };

  // Hàm phụ: Dịch loại công việc
  const translateType = (type) => {
    const types = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'internship': 'Thực tập sinh'
    };
    return types[type] || type;
  };

  return (
    <div className="app">
      <div className="mock-frame">
        <Topbar />
        
        {/* Vùng Banner Tìm kiếm */}
        <div className="mock-frame" style={{ margin: '20px', padding: '40px', backgroundColor: '#E0F2FE', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ color: '#3B6FE8', marginBottom: '8px' }}>Tìm việc làm phù hợp cho sinh viên</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Part-time, internship, full-time cho sinh viên toàn quốc
          </p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
            <input className="form-input" placeholder="Vị trí, kỹ năng, công ty..." style={{ flex: 1 }} />
            <select className="form-input" style={{ width: '120px' }}>
              <option>Hà Nội</option>
              <option>TP.HCM</option>
            </select>
            <button className="btn btn-primary">Tìm kiếm</button>
          </div>
        </div>

        {/* Vùng Danh sách Việc làm */}
        <div style={{ padding: '0 20px', margin: '20px auto', maxWidth: '1000px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#1E293B' }}>Việc làm mới nhất</h3>

          {/* Hiển thị xoay xoay khi đang tải */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              Đang tải danh sách việc làm...
            </div>
          ) : (
            /* Vẽ vòng lặp (Map) hiển thị từng công việc */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => navigate(`/job/${job.id}`)} // THÊM DÒNG NÀY
                  style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', display: 'flex', gap: '16px', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >  
                  {/* Cột Logo */}
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, color: '#94A3B8' }}>
                    {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
                  </div>

                  {/* Cột Thông tin */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0F172A', lineHeight: '1.4' }}>
                        {job.title}
                      </h4>
                      <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {translateType(job.type)}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px', fontWeight: 500 }}>
                      {job.employer?.company_name || 'Đang cập nhật'}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 500 }}>
                        💰 {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nút Xem thêm */}
          {!loading && jobs.length > 0 && (
             <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '40px' }}>
               <button className="btn" style={{ padding: '10px 24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#3B82F6', fontWeight: 500 }}>
                 Xem tất cả việc làm
               </button>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;