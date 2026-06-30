import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Check as CheckIcon,
  X as XIcon,
  AlertCircle as AlertIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminIndustries = () => {
  const { token } = useAuth();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });
  const [formLoading, setFormLoading] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/industries`, {
        params: {
          search,
          status: statusFilter,
          page,
          per_page: 10
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}`
        }
      });
      setIndustries(response.data.data || response.data || []);
      setTotalPages(response.data.last_page);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách ngành nghề');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, [page, search, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', slug: '', description: '', is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (industry) => {
    setModalMode('edit');
    setSelectedIndustry(industry);
    setFormData({
      name: industry.name,
      slug: industry.slug,
      description: industry.description || '',
      is_active: industry.is_active === 1 || industry.is_active === true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (modalMode === 'add') {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/industries`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}` } }
        );
        toast.success('Thêm ngành nghề thành công');
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/industries/${selectedIndustry.id}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}` } }
        );
        toast.success('Cập nhật ngành nghề thành công');
      }
      setIsModalOpen(false);
      fetchIndustries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/industries/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}` } }
      );
      toast.success('Cập nhật trạng thái thành công');
      fetchIndustries();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const confirmDelete = (industry) => {
    setIndustryToDelete(industry);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/industries/${industryToDelete.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}` } }
      );
      toast.success('Đã xóa ngành nghề');
      setIsDeleteModalOpen(false);
      fetchIndustries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa ngành nghề');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Ngành nghề</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý danh mục lĩnh vực hoạt động của các công ty và tin tuyển dụng.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 cursor-pointer"
        >
          <PlusIcon size={18} />
          <span>Thêm Ngành nghề</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm ngành nghề..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã ẩn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[13px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4 whitespace-nowrap">Ngành nghề</th>
                <th className="px-6 py-4 whitespace-nowrap">Mô tả</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Số việc làm</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={150} height={20} /></td>
                    <td className="px-6 py-4"><Skeleton width={200} height={20} /></td>
                    <td className="px-6 py-4 text-center"><Skeleton width={40} height={20} /></td>
                    <td className="px-6 py-4 text-center"><Skeleton width={80} height={24} borderRadius={12} /></td>
                    <td className="px-6 py-4 text-right"><Skeleton width={60} height={20} /></td>
                  </tr>
                ))
              ) : (!industries || industries.length === 0) ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <SearchIcon size={24} className="text-slate-400" />
                      </div>
                      <p className="text-base font-semibold text-slate-700">Không tìm thấy dữ liệu</p>
                      <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (industries || []).map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{ind.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{ind.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 line-clamp-2 max-w-[300px]">
                        {ind.description || <span className="italic text-slate-400">Không có mô tả</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600">
                        {ind.jobs_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleStatus(ind.id)}
                        className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                          ind.is_active 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {ind.is_active ? 'Hoạt động' : 'Đã ẩn'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ind)}
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(ind)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                          title="Xóa"
                          disabled={ind.jobs_count > 0}
                        >
                          <TrashIcon size={16} className={ind.jobs_count > 0 ? "opacity-50" : ""} />
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
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 mt-auto">
            <span className="text-sm text-slate-500 font-medium">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {modalMode === 'add' ? 'Thêm Ngành nghề mới' : 'Cập nhật Ngành nghề'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gapx-4 py-2.5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Tên ngành nghề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Vd: Công nghệ thông tin"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Slug (Đường dẫn)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Để trống tự động tạo từ tên"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Mô tả chi tiết về ngành nghề này..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    className="sr-only peer"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-semibold text-slate-700">Hiển thị (Đang hoạt động)</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {formLoading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>}
                  {modalMode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col p-6 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertIcon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa ngành nghề <span className="font-bold text-slate-700">"{industryToDelete?.name}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIndustries;
