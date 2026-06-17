import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Search, Filter, RefreshCw, AlertTriangle, EyeOff, Edit, 
  Trash2, Link as LinkIcon, ChevronDown, X, Layers, Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import adminIndustryService from '../services/adminIndustryService';
import IndustryModal from '../components/admin/industries/IndustryModal';

export default function AdminIndustries() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setPage(1); 
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch, isError, error } = useQuery({
    queryKey: ['adminIndustries', page, filters],
    queryFn: async () => {
      const res = await adminIndustryService.getIndustries({
        page,
        search: filters.search,
        status: filters.status,
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const industries = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
  };

  const createMutation = useMutation({
    mutationFn: adminIndustryService.createIndustry,
    onSuccess: () => {
      toast.success('Thêm ngành nghề thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminIndustries'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        toast.error(`Lỗi: ${firstError}`);
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm ngành nghề');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminIndustryService.updateIndustry(id, data),
    onSuccess: () => {
      toast.success('Cập nhật ngành nghề thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminIndustries'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        toast.error(`Lỗi: ${firstError}`);
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ngành nghề');
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: adminIndustryService.toggleStatus,
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminIndustries'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminIndustryService.deleteIndustry,
    onSuccess: () => {
      toast.success('Xóa ngành nghề thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminIndustries'] });
      setConfirmDialog(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Không thể xóa ngành nghề này');
      setConfirmDialog(null);
    },
  });

  const handleOpenAddModal = () => {
    setSelectedIndustry(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (industry) => {
    setSelectedIndustry(industry);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (selectedIndustry) {
      updateMutation.mutate({ id: selectedIndustry.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteClick = (industry) => {
    setConfirmDialog({
      industry,
      title: 'Xác nhận xóa ngành nghề',
      message: `Bạn có chắc chắn muốn xóa ngành nghề "${industry.name}" không? Thao tác này không thể hoàn tác.`
    });
  };

  return (
    <div className="pb-10 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý Ngành nghề</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Quản lý danh mục ngành nghề hiển thị trên hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-all shadow-sm"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} /> Làm mới
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleOpenAddModal}
          >
            <Plus size={16} /> Thêm ngành nghề
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* FILTERS */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 text-sm font-medium"
                placeholder="Tên ngành nghề mới..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 text-sm font-medium cursor-pointer min-w-[170px]"
                value={filters.status}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, status: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Đã ẩn</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                <th className="py-4 px-5">Ngành nghề</th>
                <th className="py-4 px-5 text-center">Số tin tuyển dụng</th>
                <th className="py-4 px-5 text-center">Trạng thái</th>
                <th className="py-4 px-5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isError ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-rose-500">
                    <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-sm">Lỗi tải dữ liệu: {error?.response?.data?.message || error?.message || 'Không rõ nguyên nhân'}</p>
                  </td>
                </tr>
              ) : isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="4" className="py-4 px-5">
                      <div className="h-10 rounded-xl bg-slate-100 animate-pulse w-full"></div>
                    </td>
                  </tr>
                ))
              ) : industries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                      <Layers size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-800 font-bold mb-1">Không có ngành nghề</p>
                    <p className="text-slate-500 text-sm">Không tìm thấy ngành nghề nào phù hợp với bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                industries.map(industry => (
                  <tr key={industry.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors">{industry.name}</div>
                          {industry.description && (
                            <div className="text-xs text-slate-500 mt-0.5 max-w-[300px] truncate">{industry.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Link 
                        to={`/admin/jobs?keyword=${encodeURIComponent(industry.name)}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        {industry.jobs_count ? industry.jobs_count.toLocaleString() : '0'} <LinkIcon size={12} />
                      </Link>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${industry.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {industry.is_active ? 'Hoạt động' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                          onClick={() => handleOpenEditModal(industry)}
                          title="Sửa"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${industry.is_active ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                          onClick={() => toggleStatusMutation.mutate(industry.id)}
                          title={industry.is_active ? 'Ẩn' : 'Hiện'}
                        >
                          {industry.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                          onClick={() => handleDeleteClick(industry)}
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">
              Trang {pagination.current_page} / {pagination.last_page}
            </span>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={pagination.current_page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Trước
              </button>
              <button 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL THÊM/SỬA */}
      {isModalOpen && (
        <IndustryModal 
          isOpen={isModalOpen}
          initialData={selectedIndustry}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* DIALOG XÓA */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setConfirmDialog(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5 text-rose-600">
                <Trash2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{confirmDialog.message}</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={() => setConfirmDialog(null)} 
                  disabled={deleteMutation.isPending}
                >
                  Hủy
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-colors"
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <RefreshCw size={16} className="animate-spin" />}
                  {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}