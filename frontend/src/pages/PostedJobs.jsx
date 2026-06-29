import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../services/jobService';

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getEmployerJobs();
      // Nếu API trả về phân trang (paginate) thì data sẽ có dạng { data: [...] }
      setJobs(data.data || data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await jobService.deleteJob(jobToDelete.id);
      fetchJobs(); // refresh list
      toast.success('Xóa tin tuyển dụng thành công.');
      setDeleteModalOpen(false);
    } catch (_error) {
      toast.error('Xóa thất bại. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
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
                    <button className="btn" style={{ fontSize: '11px', padding: '3px 8px', borderColor: '#E24B4A', color: '#E24B4A' }} onClick={() => confirmDelete(job)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ padding: '1rem' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Xác nhận đóng / xóa tin</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {jobToDelete?.title}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                style={{ cursor: 'pointer' }}
                disabled={isDeleting}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                Hành động này sẽ khiến tin tuyển dụng <strong>không còn hiển thị</strong> với ứng viên nữa. Bạn có chắc chắn muốn tiếp tục không?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                style={{ padding: '0.4rem 1rem', cursor: 'pointer' }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-sm flex items-center gap-2"
                style={{ padding: '0.4rem', cursor: 'pointer' }}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Xác nhận Xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostedJobs;