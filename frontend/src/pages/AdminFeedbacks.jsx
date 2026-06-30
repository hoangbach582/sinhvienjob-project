import React, { useState, useEffect } from 'react';
import adminFeedbackService from '../services/adminFeedbackService';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw, CheckCircle, Clock, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [pagination, setPagination] = useState({});

  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const data = await adminFeedbackService.getFeedbacks(activeTab === 'all' ? '' : activeTab, page);
      setFeedbacks(data.data);
      setPagination(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Không thể tải danh sách phản hồi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, [activeTab]);

  const handleResolve = async (id) => {
    try {
      await adminFeedbackService.resolveFeedback(id);
      toast.success('Đã đánh dấu xử lý thành công.');
      fetchFeedbacks(pagination.current_page || 1);
    } catch (error) {
      console.error('Error resolving feedback:', error);
      toast.error('Có lỗi xảy ra.');
    }
  };

  const getBadgeClass = (status) => {
    return status === 'resolved' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'feedback': return 'Góp ý';
      case 'report': return 'Báo cáo vi phạm';
      case 'bug': return 'Báo lỗi hệ thống';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'feedback': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'report': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'bug': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="pb-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Phản hồi & Báo cáo</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Quản lý ý kiến đóng góp từ người dùng</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
          onClick={() => fetchFeedbacks(pagination.current_page || 1)}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} label="Chờ xử lý" icon={<Clock size={16} />} />
          <TabButton active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')} label="Đã xử lý" icon={<CheckCircle size={16} />} />
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="Tất cả" icon={<MessageSquare size={16} />} />
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
              <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                  <th className="py-4 px-5">Nội dung</th>
                  <th className="py-4 px-5">Người gửi</th>
                  <th className="py-4 px-5 text-center">Loại</th>
                  <th className="py-4 px-5 text-center">Trạng thái</th>
                  <th className="py-4 px-5">Ngày gửi</th>
                  <th className="py-4 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedbacks.length > 0 ? feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800 text-[15px]">{item.subject}</div>
                      <div className="text-sm text-slate-500 mt-1 max-w-md line-clamp-2" title={item.message}>
                        {item.message}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-700 text-sm">{item.user?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center rounded-md text-[11px] font-bold border px-2 py-1 ${getTypeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center rounded-md text-xs font-bold border px-2 py-1 ${getBadgeClass(item.status)}`}>
                        {item.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => handleResolve(item.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors hover:bg-indigo-700 shadow-sm cursor-pointer"
                        >
                          Đánh dấu xong
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Đã hoàn thành</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <Info size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-800 font-bold mb-1">Chưa có phản hồi</p>
                        <p className="text-slate-500 text-sm">Hiện tại không có dữ liệu để hiển thị.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
            <span className="text-sm font-medium text-slate-500">
              Trang {pagination.current_page}/{pagination.last_page}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    pagination.current_page === page 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => fetchFeedbacks(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative cursor-pointer ${
      active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
    }`}
  >
    {icon} {label}
    {active && (
      <motion.div 
        layoutId="activeFeedbackTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
      />
    )}
  </button>
);

export default AdminFeedbacks;
