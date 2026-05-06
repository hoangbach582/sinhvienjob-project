import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Bạn cần đăng nhập để xem trang này!");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/applications/me', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Lỗi khi tải lịch sử ứng tuyển");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { text: 'Đang chờ duyệt', color: '#64748B', bg: '#F1F5F9' },
      'reviewing': { text: 'Đang xem xét', color: '#D97706', bg: '#FEF3C7' },
      'interview': { text: 'Hẹn phỏng vấn', color: '#2563EB', bg: '#DBEAFE' },
      'accepted': { text: 'Trúng tuyển', color: '#16A34A', bg: '#DCFCE7' },
      'rejected': { text: 'Từ chối', color: '#DC2626', bg: '#FEE2E2' }
    };
    
    const badge = badges[status] || badges['pending'];
    
    return (
      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: badge.color, backgroundColor: badge.bg }}>
        {badge.text}
      </span>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải lịch sử ứng tuyển...</div>;

  return (
    <MainLayout>
      
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '24px' }}>Công việc đã ứng tuyển</h2>

        {applications.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            <p style={{ color: '#64748B', fontSize: '16px' }}>Bạn chưa ứng tuyển công việc nào.</p>
            <Link to="/" style={{ display: 'inline-block', marginTop: '12px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
              Khám phá việc làm ngay →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map((app) => (
              <div key={app.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <div>
                  <Link to={`/job/${app.job.id}`} style={{ fontSize: '18px', color: '#0F172A', fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                    {app.job.title}
                  </Link>
                  <div style={{ display: 'flex', gap: '16px', color: '#64748B', fontSize: '14px' }}>
                    <span>🏢 {app.job.employer?.company_name || 'Đang cập nhật'}</span>
                    <span>🕒 Đã nộp: {new Date(app.applied_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(app.status)}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AppliedJobs;