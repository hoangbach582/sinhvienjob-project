import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, RefreshCw, AlertTriangle, Eye, EyeOff, Edit, Trash2, Link as LinkIcon, ChevronDown, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import adminIndustryService from '../services/adminIndustryService';
import IndustryModal from '../components/admin/industries/IndustryModal';

export default function AdminIndustries() {
  const queryClient = useQueryClient();

  // States
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setPage(1); 
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Queries
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

  // Mutations
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

  // Handlers
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

  const handleToggleStatus = (industry) => {
    toggleStatusMutation.mutate(industry.id);
  };

  const handleDeleteClick = (industry) => {
    setConfirmDialog({
      industry,
      title: 'Xác nhận xóa ngành nghề',
      message: `Bạn có chắc chắn muốn xóa ngành nghề "${industry.name}" không? Thao tác này không thể hoàn tác.`
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog?.industry) {
      deleteMutation.mutate(confirmDialog.industry.id);
    }
  };

  return (
    <div>
      {/* ====== HEADER ====== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Quản lý Ngành nghề
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Quản lý danh mục ngành nghề hiển thị trên hệ thống
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            onClick={() => refetch()}
            style={{ gap: '6px', fontSize: '13px' }}
          >
            <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
            Làm mới
          </button>
          <button
            className="btn btn-primary"
            onClick={handleOpenAddModal}
            style={{ gap: '6px', fontSize: '13px' }}
          >
            <Plus size={14} /> Thêm ngành nghề
          </button>
        </div>
      </div>

      {/* ====== BỘ LỌC ====== */}
      <div style={{
        background: '#fff', border: '1px solid #e8ecf0',
        borderRadius: '12px', padding: '14px 16px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8',
            }} />
            <input
              className="form-input"
              placeholder="Tên ngành nghề mới..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            className="form-input"
            value={filters.status}
            onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setPage(1);
            }}
            style={{ width: '170px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Đã ẩn</option>
          </select>
        </div>
      </div>

      {/* ====== SUMMARY BAR ====== */}
      {!isLoading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Hiển thị {industries.length} / {pagination.total || 0} bản ghi
          </span>
        </div>
      )}

      {/* ====== BẢNG DỮ LIỆU ====== */}
      <div className="table-wrap" style={{ background: '#fff' }}>
        <table>
          <thead>
            <tr>
              <th>Ngành nghề</th>
              <th style={{ textAlign: 'center' }}>Số tin</th>
              <th style={{ textAlign: 'center' }}>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px 20px', color: '#ef4444' }}>
                  <AlertTriangle size={32} style={{ margin: '0 auto 10px' }} />
                  <p>Lỗi tải dữ liệu: {error?.response?.data?.message || error?.message || 'Không rõ nguyên nhân'}</p>
                </td>
              </tr>
            ) : isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="4" style={{ padding: '15px' }}>
                    <div style={{
                      height: '20px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '4px'
                    }}></div>
                  </td>
                </tr>
              ))
            ) : industries.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <EyeOff size={32} style={{ margin: '0 auto 10px', color: '#cbd5e1' }} />
                  <p>Không tìm thấy ngành nghề nào.</p>
                </td>
              </tr>
            ) : (
              industries.map(industry => (
                <tr key={industry.id} style={{ transition: 'background 0.2s', borderBottom: '1px solid #f1f5f9' }}>
                  <td>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{industry.name}</div>
                    {industry.description && (
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {industry.description}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Link 
                      to={`/admin/jobs?keyword=${encodeURIComponent(industry.name)}`}
                      style={{ 
                        color: '#3B6FE8', fontWeight: '600', textDecoration: 'none', 
                        display: 'inline-flex', alignItems: 'center', gap: '4px' 
                      }}
                    >
                      {industry.jobs_count ? industry.jobs_count.toLocaleString() : '0'}
                      <LinkIcon size={12} />
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${industry.is_active ? 'badge-green' : 'badge-gray'}`}>
                      {industry.is_active ? 'Hoạt động' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => handleOpenEditModal(industry)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 8px', fontSize: '11px', color: industry.is_active ? '#B45309' : '#3B6D11' }}
                        onClick={() => handleToggleStatus(industry)}
                        title={industry.is_active ? 'Ẩn' : 'Hiện'}
                      >
                        {industry.is_active ? 'Ẩn' : 'Hiện'}
                      </button>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 8px', fontSize: '11px', color: '#B91C1C' }}
                        onClick={() => handleDeleteClick(industry)}
                        title="Xóa"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Phân trang */}
        {pagination.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #e8ecf0', background: '#fafbfc', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Trang {pagination.current_page} / {pagination.last_page}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                className="btn" 
                disabled={pagination.current_page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{ padding: '4px 10px', fontSize: '12px', opacity: pagination.current_page === 1 ? 0.5 : 1 }}
              >
                Trước
              </button>
              <button 
                className="btn" 
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                style={{ padding: '4px 10px', fontSize: '12px', opacity: pagination.current_page === pagination.last_page ? 0.5 : 1 }}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ====== MODAL THÊM/SỬA ====== */}
      {isModalOpen && (
        <IndustryModal 
          isOpen={isModalOpen}
          initialData={selectedIndustry}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* ====== DIALOG XÓA ====== */}
      {confirmDialog && (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }} onClick={(e) => e.target === e.currentTarget && setConfirmDialog(null)}>
            <div style={{
                background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px',
                padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.18)', animation: 'slideUp 0.2s ease-out',
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                    <Trash2 size={20} color="#B91C1C" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}>
                    {confirmDialog.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', lineHeight: '1.6' }}>
                    {confirmDialog.message}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => setConfirmDialog(null)} disabled={deleteMutation.isPending}>Hủy</button>
                    <button
                        className="btn"
                        onClick={handleConfirmDelete}
                        disabled={deleteMutation.isPending}
                        style={{ background: '#B91C1C', color: '#fff', borderColor: '#B91C1C', gap: '6px' }}
                    >
                        {deleteMutation.isPending && <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />}
                        Xóa
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}