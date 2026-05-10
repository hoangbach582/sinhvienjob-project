import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';

function EmployerApplicants() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    jobService.getEmployerJobs().then(data => {
      setJobs(data);
      if (!selectedJobId && data.length > 0) {
        setSelectedJobId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const data = await jobService.getJobApplicants(jobId);
      setApplicants(data);
    } catch (error) {
      console.error('Failed to fetch applicants', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (applicantId, newStatus) => {
    setStatusUpdates({
      ...statusUpdates,
      [applicantId]: newStatus
    });
  };

  const handleSaveStatus = async (applicantId) => {
    const newStatus = statusUpdates[applicantId];
    if (!newStatus) return;

    try {
      await jobService.updateApplicationStatus(applicantId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      
      setApplicants(applicants.map(app => 
        app.id === applicantId ? { ...app, status: newStatus } : app
      ));
      
      const updated = { ...statusUpdates };
      delete updated[applicantId];
      setStatusUpdates(updated);
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p className="section-title" style={{ margin: 0 }}>Quản lý hồ sơ ứng viên</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            className="form-input" 
            style={{ width: '220px', fontSize: '13px' }}
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">-- Chọn tin tuyển dụng --</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <input className="form-input" placeholder="Tìm theo tên..." style={{ fontSize: '13px' }} />
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</p>
        ) : !selectedJobId ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Vui lòng chọn một tin tuyển dụng để xem hồ sơ.</p>
        ) : applicants.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Chưa có ứng viên nào ứng tuyển vị trí này.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Vị trí ứng tuyển</th>
                <th>Ngày nộp</th>
                <th>CV</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(app => (
                <tr key={app.id}>
                  <td>
                    <p style={{ fontWeight: 500 }}>{app.student_name || 'Ứng viên'}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{app.student_email || 'Email'}</p>
                  </td>
                  <td>{jobs.find(j => j.id === selectedJobId)?.title}</td>
                  <td>{new Date(app.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><a href={app.cv_url} target="_blank" rel="noreferrer" style={{ color: '#3B6FE8', fontSize: '12px' }}>Xem CV</a></td>
                  <td>
                    <select 
                      className="form-input" 
                      style={{ padding: '4px 8px', fontSize: '12px', height: 'auto' }}
                      value={statusUpdates[app.id] || app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="reviewing">Đang xem xét</option>
                      <option value="interviewed">Mời phỏng vấn</option>
                      <option value="hired">Đã tuyển</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '11px', padding: '4px 8px', opacity: statusUpdates[app.id] ? 1 : 0.5 }}
                      disabled={!statusUpdates[app.id]}
                      onClick={() => handleSaveStatus(app.id)}
                    >
                      Lưu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default EmployerApplicants;