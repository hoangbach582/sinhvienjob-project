import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getEmployerJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn đóng/xóa tin này?')) {
      try {
        await jobService.deleteJob(id);
        fetchJobs(); // refresh list
      } catch (error) {
        alert('Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'part_time': return <span className="badge badge-green">Part-time</span>;
      case 'internship': return <span className="badge badge-orange">Internship</span>;
      case 'full_time': return <span className="badge badge-blue">Full-time</span>;
      default: return <span className="badge badge-gray">{type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge badge-green">Đã duyệt</span>;
      case 'pending': return <span className="badge badge-orange">Chờ duyệt</span>;
      case 'closed': return <span className="badge badge-gray">Đã đóng</span>;
      case 'rejected': return <span className="badge badge-red" style={{ backgroundColor: '#fee2e2', color: '#991b1b'}}>Từ chối</span>;
      default: return <span className="badge badge-blue">{status}</span>;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p className="section-title" style={{ margin: 0 }}>Tin tuyển dụng đã đăng</p>
        <Link to="/employer/post-job">
          <button className="btn btn-primary" style={{ fontSize: '12px' }}>+ Đăng tin mới</button>
        </Link>
      </div>

      <div className="table-wrap">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</p>
        ) : jobs.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Chưa có tin tuyển dụng nào.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>SL Tuyển</th>
                <th>Hồ sơ</th>
                <th>Hạn nộp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{getTypeBadge(job.type)}</td>
                  <td>{job.vacancies || 'Không giới hạn'}</td>
                  <td>
                    {/* Link to view applications for this job */}
                    <Link to={`/employer/applicants?jobId=${job.id}`} style={{ color: '#3B6FE8', textDecoration: 'underline' }}>
                      {job.applications_count || 0}
                    </Link>
                  </td>
                  <td>{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</td>
                  <td>{getStatusBadge(job.status)}</td>
                  <td style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => navigate(`/employer/edit-job/${job.id}`)}>Sửa</button>
                    <button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }} onClick={() => handleDelete(job.id)}>Xóa</button>
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

export default PostedJobs;