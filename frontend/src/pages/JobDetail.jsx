import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // 1. THÊM useNavigate
import Topbar from '../components/Topbar';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // 2. KHAI BÁO navigate
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      // 1. Chuẩn bị gói hàng (headers) và lấy Token
      const token = localStorage.getItem('access_token'); // *Lưu ý: Nếu ở bước trước bạn dùng tên khác (như access_token) thì sửa lại chữ 'token' ở đây nhé!
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // 2. Nếu có Token (đang đăng nhập) thì kẹp thẻ bài vào
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 3. Gửi Request có kèm Token đi
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data);
        
        // 4. Cập nhật trạng thái nút bấm dựa trên câu trả lời của Backend
        if (token) {
          setHasApplied(data.has_applied);
        } else {
          setHasApplied(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // 3. THÊM CHỐT CHẶN KIỂM TRA ĐĂNG NHẬP
    // (Giả sử khi đăng nhập thành công, bạn sẽ lưu một biến 'token' vào localStorage)
    const token = localStorage.getItem('access_token'); 

    if (!token) {
      // Nếu không có token -> Chưa đăng nhập
      const confirmLogin = window.confirm("Bạn cần đăng nhập tài khoản Sinh viên để ứng tuyển công việc này. Đi đến trang Đăng nhập ngay?");
      
      if (confirmLogin) {
        navigate('/login'); // Tự động chuyển hướng sang trang Login
      }
      return; // Dừng hàm lại ngay lập tức, không cho chạy code gửi API phía dưới
    }

    // --- Nếu ĐÃ đăng nhập, mới cho chạy tiếp code dưới đây ---
    setIsApplying(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setHasApplied(true); 
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối! Vui lòng thử lại.");
    } finally {
      setIsApplying(false);
    }
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

  const translateType = (type) => {
    const types = { 'full_time': 'Toàn thời gian', 'part_time': 'Bán thời gian', 'internship': 'Thực tập sinh' };
    return types[type] || type;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin...</div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy công việc này!</div>;

  return (
    <div className="app" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Topbar/>
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
          ← Quay lại trang chủ
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '16px' }}>{job.title}</h1>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Mức lương</span>
                  <span style={{ color: '#10B981', fontWeight: 600, fontSize: '16px' }}>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Địa điểm</span>
                  <span style={{ color: '#334155', fontWeight: 500, fontSize: '15px' }}>📍 {job.location}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Hình thức</span>
                  <span style={{ color: '#334155', fontWeight: 500, fontSize: '15px' }}>⏱️ {translateType(job.type)}</span>
                </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={isApplying || hasApplied}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: (isApplying || hasApplied) ? '#94A3B8' : '#3B82F6', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  cursor: (isApplying || hasApplied) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {hasApplied ? '✅ Đã ứng tuyển' : (isApplying ? 'Đang gửi hồ sơ...' : 'Ứng tuyển ngay')}
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', color: '#0F172A', marginBottom: '16px', borderLeft: '4px solid #3B82F6', paddingLeft: '12px' }}>Mô tả công việc</h3>
              <p style={{ color: '#334155', lineHeight: '1.6', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>{job.description}</p>

              <h3 style={{ fontSize: '18px', color: '#0F172A', marginBottom: '16px', borderLeft: '4px solid #3B82F6', paddingLeft: '12px' }}>Yêu cầu ứng viên</h3>
              <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
            </div>
          </div>

          <div style={{ flex: 1, backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#94A3B8' }}>
                {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
              </div>
              <h3 style={{ fontSize: '16px', color: '#0F172A', margin: 0 }}>{job.employer?.company_name || 'Đang cập nhật'}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hạn nộp hồ sơ:</span>
                <span style={{ fontWeight: 600, color: '#E11D48' }}>{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không thời hạn'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;