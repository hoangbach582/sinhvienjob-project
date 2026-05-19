import React, { useState, useEffect } from 'react';
import adminJobService from '../services/adminJobService';

function AdminJobs() {
  const [activeTab, setActiveTab] = useState('pending');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingJobId, setRejectingJobId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'pending') {
        data = await adminJobService.getPendingJobs(page);
      } else if (activeTab === 'approved') {
        data = await adminJobService.getAllJobs('approved', page);
      } else if (activeTab === 'rejected') {
        data = await adminJobService.getAllJobs('rejected', page);
      } else {
        data = await adminJobService.getAllJobs('', page);
      }
      setJobs(data.data);
      setPagination(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Không thể tải danh sách tin tuyển dụng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchJobs();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt tin này?')) return;
    setActionLoadingId(id);
    try {
      await adminJobService.approveJob(id);
      alert('Đã duyệt tin thành công!');
      fetchJobs();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể duyệt tin.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (id) => {
    setRejectingJobId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }
    setSubmitting(true);
    try {
      await adminJobService.rejectJob(rejectingJobId, rejectReason);
      alert('Đã từ chối tin tuyển dụng.');
      setShowRejectModal(false);
      fetchJobs();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể từ chối tin.'));
    } finally {
      setSubmitting(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'badge-green';
      case 'pending': return 'badge-orange';
      case 'rejected': return 'badge-red';
      default: return 'badge-blue';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Bị từ chối';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('pending')}
          style={{ fontSize: '12px' }}
        >
          Chờ duyệt
        </button>
        <button 
          className={`btn ${activeTab === 'approved' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('approved')}
          style={{ fontSize: '12px' }}
        >
          Đã duyệt
        </button>
        <button 
          className={`btn ${activeTab === 'rejected' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('rejected')}
          style={{ fontSize: '12px' }}
        >
          Bị từ chối
        </button>
        <button 
          className={`btn ${activeTab === 'all' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('all')}
          style={{ fontSize: '12px' }}
        >
          Tất cả
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Công ty</th>
                <th>Loại</th>
                <th>Gửi lúc</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{job.title}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{job.location}</div>
                  </td>
                  <td>{job.employer?.company_name || 'N/A'}</td>
                  <td><span className={`badge ${job.type === 'internship' ? 'badge-orange' : 'badge-blue'}`}>{job.type}</span></td>
                  <td>{new Date(job.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><span className={`badge ${getBadgeClass(job.status)}`}>{getStatusText(job.status)}</span></td>
                  <td style={{ display: 'flex', gap: '4px' }}>
                    {job.status === 'pending' && (
                      <>
                        <button 
                          className="btn" 
                          onClick={() => handleApprove(job.id)}
                          disabled={actionLoadingId !== null}
                          style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#3B6D11', color: '#3B6D11' }}
                        >
                          {actionLoadingId === job.id ? 'Đang duyệt...' : 'Duyệt'}
                        </button>
                        <button 
                          className="btn" 
                          onClick={() => openRejectModal(job.id)}
                          disabled={actionLoadingId !== null}
                          style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {job.status === 'rejected' && (
                      <button 
                        className="btn" 
                        title={job.rejected_reason}
                        onClick={() => alert('Lý do từ chối: ' + job.rejected_reason)}
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                      >
                        Xem lý do
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có tin nào.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.per_page && (
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
            <button 
              key={page} 
              className={`btn ${pagination.current_page === page ? 'btn-primary' : ''}`}
              onClick={() => fetchJobs(page)}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Từ chối tin tuyển dụng</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Vui lòng nhập lý do từ chối để thông báo cho nhà tuyển dụng.</p>
            <textarea
              style={{ width: '100%', height: '100px', marginTop: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="Ví dụ: Nội dung tin không phù hợp, thiếu thông tin liên hệ..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button className="btn" onClick={() => setShowRejectModal(false)} disabled={submitting}>Hủy</button>
              <button 
                className="btn btn-primary" 
                style={{ background: '#E24B4A', borderColor: '#E24B4A' }}
                onClick={handleReject}
                disabled={submitting}
              >
                {submitting ? 'Đang gửi...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminJobs;