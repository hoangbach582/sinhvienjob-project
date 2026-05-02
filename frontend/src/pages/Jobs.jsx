import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || '';
  const initialSalary = searchParams.get('salary') || ''; // Thêm State cho Lương

  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [salary, setSalary] = useState(initialSalary);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cập nhật điều kiện: Nếu có bất kỳ param nào thì tính là đang lọc
  const isSearching = searchParams.get('keyword') || searchParams.get('location') || searchParams.get('type') || searchParams.get('salary');

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.get('keyword')) params.append('keyword', searchParams.get('keyword'));
      if (searchParams.get('location')) params.append('location', searchParams.get('location'));
      if (searchParams.get('type')) params.append('type', searchParams.get('type'));
      if (searchParams.get('salary')) params.append('salary', searchParams.get('salary')); // Gửi salary cho Backend

      const response = await fetch(`http://127.0.0.1:8000/api/jobs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (salary) params.append('salary', salary);
    setSearchParams(params); 
  };

  const clearFilter = () => {
    setKeyword('');
    setLocation('');
    setType('');
    setSalary('');
    setSearchParams({});
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return 'Thỏa thuận';
  };

  const translateType = (jobType) => {
    const types = { 'full_time': 'Toàn thời gian', 'part_time': 'Bán thời gian', 'internship': 'Thực tập sinh' };
    return types[jobType] || jobType;
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Topbar />
      
      {/* Khung chứa chia 2 cột */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Cột Trái: Sidebar Bộ lọc */}
        <div style={{ width: '280px', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', flexShrink: 0, position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>Lọc công việc</h3>
            {isSearching && (
              <span onClick={clearFilter} style={{ fontSize: '13px', color: '#EF4444', cursor: 'pointer', fontWeight: 500 }}>Bỏ lọc ✕</span>
            )}
          </div>

          <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Lọc Từ khóa */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Từ khóa</label>
              <input type="text" placeholder="Tên việc, công ty..." value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            {/* Lọc Địa điểm */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Địa điểm</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                <option value="">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Lọc Hình thức */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Hình thức làm việc</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                <option value="">Tất cả hình thức</option>
                <option value="full_time">Toàn thời gian</option>
                <option value="part_time">Bán thời gian</option>
                <option value="internship">Thực tập sinh</option>
              </select>
            </div>

            {/* MỚI: Lọc Mức lương */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Mức lương</label>
              <select value={salary} onChange={(e) => setSalary(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                <option value="">Tất cả mức lương</option>
                <option value="under_3">Dưới 3 triệu</option>
                <option value="3_to_5">Từ 3 - 5 triệu</option>
                <option value="5_to_10">Từ 5 - 10 triệu</option>
                <option value="over_10">Trên 10 triệu</option>
              </select>
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' }}>
              Áp dụng bộ lọc
            </button>
          </form>
        </div>

        {/* Cột Phải: Danh sách kết quả */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '20px', color: '#0F172A', marginBottom: '24px' }}>
            {isSearching ? `Tìm thấy ${jobs.length} việc làm phù hợp` : 'Tất cả việc làm mới nhất'}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748B' }}>Đang tải dữ liệu...</div>
          ) : jobs.length === 0 ? (
            <div style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <p style={{ color: '#64748B', fontSize: '16px' }}>Rất tiếc, không tìm thấy công việc nào khớp với tiêu chí của bạn.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {jobs.map((job) => (
                <Link to={`/job/${job.id}`} key={job.id} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}>
                    
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#94A3B8', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                      {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', color: '#0F172A', fontWeight: 600, margin: 0 }}>{job.title}</h3>
                        <span style={{ padding: '4px 10px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px' }}>
                          {translateType(job.type)}
                        </span>
                      </div>
                      <div style={{ color: '#64748B', fontSize: '15px', marginBottom: '16px' }}>{job.employer?.company_name || 'Đang cập nhật'}</div>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                        <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: '#EF4444' }}>📍</span> {job.location}</span>
                        <span style={{ color: '#D97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Jobs;