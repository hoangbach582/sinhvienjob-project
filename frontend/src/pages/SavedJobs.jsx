import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import SaveButton from '../components/SaveButton';

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  const fetchSavedJobs = async (page = 1) => {
    try {
      setLoading(true);
      const data = await jobService.getSavedJobs(page);
      setSavedJobs(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    } catch (error) {
      console.error("Lỗi khi tải việc làm đã lưu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return 'Thỏa thuận';
  };

  const translateType = (type) => {
    const types = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'internship': 'Thực tập sinh'
    };
    return types[type] || type;
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#1E293B', fontWeight: 700 }}>Việc làm đã lưu</h2>
          <span style={{ fontSize: '14px', color: '#64748B' }}>{pagination.total || 0} việc làm</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748B' }}>
            Đang tải danh sách...
          </div>
        ) : savedJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
            <h3 style={{ fontSize: '18px', color: '#1E293B', marginBottom: '8px' }}>Bạn chưa lưu việc làm nào</h3>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Hãy khám phá các cơ hội việc làm và lưu lại những tin bạn quan tâm.</p>
            <button 
              onClick={() => navigate('/jobs')}
              style={{ backgroundColor: '#3B82F6', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Tìm việc ngay
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {savedJobs.map((item) => {
              const job = item.job;
              if (!job) return null;
              return (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/job/${job.id}`)}
                  style={{ border: '1px solid #E2E8F0', padding: '20px', borderRadius: '12px', display: 'flex', gap: '20px', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                >  
                  {/* Cột Logo */}
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#3B82F6', flexShrink: 0 }}>
                    {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
                  </div>

                  {/* Cột Thông tin */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '17px', color: '#0F172A', fontWeight: 700 }}>
                        {job.title}
                      </h4>
                      <div onClick={(e) => e.stopPropagation()}>
                        <SaveButton jobId={job.id} />
                      </div>
                    </div>

                    <div style={{ fontSize: '14px', color: '#3B82F6', marginBottom: '12px', fontWeight: 600 }}>
                      {job.employer?.company_name}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📍 {job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                        💰 {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        {translateType(job.type)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Phân trang đơn giản */}
        {!loading && pagination.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => fetchSavedJobs(page)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: pagination.current_page === page ? '#3B82F6' : '#fff',
                  color: pagination.current_page === page ? '#fff' : '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default SavedJobs;
