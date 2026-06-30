import React, { useState, useEffect } from 'react';
import adminJobService from '../services/adminJobService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle, XCircle, Eye, RefreshCw, X, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, CheckSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  
  // Bulk actions state
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [isBulkReject, setIsBulkReject] = useState(false);

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
      toast.error('Không thể tải danh sách tin tuyển dụng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedJobs([]);
    fetchJobs();
    // eslint-disable-next-line
  }, [activeTab]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await adminJobService.approveJob(id);
      toast.success('Đã duyệt tin thành công!');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể duyệt tin.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (id) => {
    setIsBulkReject(false);
    setRejectingJobId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối.');
      return;
    }
    setSubmitting(true);
    try {
      if (isBulkReject) {
        await adminJobService.bulkRejectJobs(selectedJobs, rejectReason);
        toast.success(`Đã từ chối ${selectedJobs.length} tin tuyển dụng.`);
      } else {
        await adminJobService.rejectJob(rejectingJobId, rejectReason);
        toast.success('Đã từ chối tin tuyển dụng.');
      }
      setShowRejectModal(false);
      setSelectedJobs([]);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể từ chối tin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedJobs.length === 0) return;
    setBulkActionLoading(true);
    try {
      await adminJobService.bulkApproveJobs(selectedJobs);
      toast.success(`Đã duyệt thành công ${selectedJobs.length} tin tuyển dụng.`);
      setSelectedJobs([]);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể duyệt tin hàng loạt.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const openBulkRejectModal = () => {
    if (selectedJobs.length === 0) return;
    setIsBulkReject(true);
    setRejectingJobId(null);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pendingJobIds = jobs.filter(j => j.status === 'pending').map(j => j.id);
      setSelectedJobs(pendingJobIds);
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (e, id) => {
    if (e.target.checked) {
      setSelectedJobs(prev => [...prev, id]);
    } else {
      setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
    <div className="pb-10 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tin Tuyển Dụng</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Quản lý và xét duyệt các bài đăng tuyển dụng</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-sm transition-colors"
          style={{ cursor: 'pointer' }}
          onClick={() => fetchJobs(pagination.current_page || 1)}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* TABS */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} label="Chờ duyệt" icon={<RefreshCw size={16} />} />
          <TabButton active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} label="Đã duyệt" icon={<CheckCircle size={16} />} />
          <TabButton active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} label="Bị từ chối" icon={<XCircle size={16} />} />
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="Tất cả" icon={<Briefcase size={16} />} />
        </div>

        {/* BULK ACTIONS BAR */}
        {selectedJobs.length > 0 && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
              <CheckSquare size={18} className="text-indigo-600" />
              Đã chọn {selectedJobs.length} tin tuyển dụng
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {bulkActionLoading ? 'Đang duyệt...' : 'Duyệt tất cả'}
              </button>
              <button
                onClick={openBulkRejectModal}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                Từ chối tất cả
              </button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
              <p className="text-slate-500 font-medium">Đang tải danh sách...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                  {activeTab === 'pending' && (
                    <th className="py-4 px-5 w-[50px] text-center">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          jobs.filter(j => j.status === 'pending').length > 0 &&
                          selectedJobs.length === jobs.filter(j => j.status === 'pending').length
                        }
                      />
                    </th>
                  )}
                  <th className="py-4 px-5">Tin tuyển dụng</th>
                  <th className="py-4 px-5">Công ty</th>
                  <th className="py-4 px-5 text-center">Hình thức</th>
                  <th className="py-4 px-5">Ngày đăng</th>
                  <th className="py-4 px-5">Trạng thái</th>
                  <th className="py-4 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.length > 0 ? jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                    {activeTab === 'pending' && (
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                          checked={selectedJobs.includes(job.id)}
                          onChange={(e) => handleSelectJob(e, job.id)}
                        />
                      </td>
                    )}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800 text-[15px] max-w-sm truncate">{job.title}</div>
                      <div className="text-xs text-slate-500 mt-1 max-w-sm truncate">{job.location}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {(job.employer?.company_name?.[0] || 'C').toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700 text-sm truncate max-w-[150px]">
                          {job.employer?.company_name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center rounded-md text-[11px] font-bold border ${job.type === 'internship' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`} style={{ padding: '0.4rem' }}>
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center rounded-md text-xs font-bold border ${getBadgeClass(job.status)}`} style={{ padding: '0.4rem' }}>
                        {getStatusText(job.status)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        {job.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(job.id)}
                              disabled={actionLoadingId !== null}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                              style={{ padding: '0.4rem', cursor: 'pointer' }}
                            >
                              {actionLoadingId === job.id ? 'Đang duyệt...' : 'Duyệt'}
                            </button>
                            <button 
                              onClick={() => openRejectModal(job.id)}
                              disabled={actionLoadingId !== null}
                              className="bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                              style={{ padding: '0.4rem', cursor: 'pointer' }}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {job.status === 'rejected' && (
                          <button 
                            onClick={() => {
                              toast((t) => (
                                <span>
                                  <b>Lý do từ chối:</b><br/>{job.rejected_reason}
                                </span>
                              ), { icon: 'ℹ️', duration: 4000 });
                            }}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                          >
                            Xem lý do
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={activeTab === 'pending' ? "7" : "6"} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <FileText size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-800 font-bold mb-1">Không có tin tuyển dụng</p>
                        <p className="text-slate-500 text-sm">Chưa có tin tuyển dụng nào trong mục này.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
            <span className="text-sm font-medium text-slate-500">
              Trang {pagination.current_page}/{pagination.last_page}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    pagination.current_page === page 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => fetchJobs(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowRejectModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
              style={{ padding: '1rem' }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">Từ chối tin tuyển dụng</h3>
              <p className="text-slate-500 text-sm mb-6">Vui lòng nhập lý do từ chối để thông báo cho nhà tuyển dụng khắc phục.</p>
              
              <textarea
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all resize-none mb-6"
                placeholder="Ví dụ: Nội dung tin không phù hợp, thiếu thông tin liên hệ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  className="rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                  style={{ padding: '0.4rem 1rem 16px', cursor: 'pointer', backgroundColor: '#f0f0f0' }}
                  onClick={() => setShowRejectModal(false)} 
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button 
                  className="flex items-center gap-2 rounded-xl font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-colors"
                  style={{ padding: '0.4rem 1rem', cursor: 'pointer' }}
                  onClick={handleReject}
                  disabled={submitting}
                >
                  {submitting && <RefreshCw size={16} className="animate-spin" />}
                  {submitting ? 'Đang gửi...' : 'Xác nhận từ chối'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
      active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
    }`}
    style={{ cursor: 'pointer' }}
  >
    {icon} {label}
    {active && (
      <motion.div 
        layoutId="activeJobTabIndicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
      />
    )}
  </button>
);

export default AdminJobs;