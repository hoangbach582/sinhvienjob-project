import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Building2, Search, Download, RefreshCw,
  CheckCircle, Lock, Trash2, Unlock, X, ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AccountTable from '../components/admin/AccountTable';
import AccountModal from '../components/admin/AccountModal';
import adminAccountService from '../services/adminAccountService';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'locked', label: 'Bị khóa' },
  { value: 'rejected', label: 'Bị từ chối' },
];

function AdminAccounts() {
  const [activeTab, setActiveTab] = useState('employer');
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [tabCounts, setTabCounts] = useState({ employer: null, student: null });
  const [searchInput, setSearchInput] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [modalAccount, setModalAccount] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchAccounts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminAccountService.getAccounts({
        type: activeTab, page,
        search: filters.search || undefined,
        status: filters.status || undefined,
      });
      setAccounts(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || 0,
        per_page: res.per_page || 15,
      });
      if (!filters.search && !filters.status) {
        setTabCounts(prev => ({ ...prev, [activeTab]: res.total || 0 }));
      }
    } catch {
      toast.error('Không thể tải danh sách tài khoản.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  const fetchTabCounts = async () => {
    try {
      const [empRes, stuRes] = await Promise.all([
        adminAccountService.getAccounts({ type: 'employer', page: 1 }),
        adminAccountService.getAccounts({ type: 'student', page: 1 })
      ]);
      setTabCounts({
        employer: empRes.total || 0,
        student: stuRes.total || 0
      });
    } catch (err) {
      console.error('Failed to fetch tab counts:', err);
    }
  };

  useEffect(() => {
    fetchTabCounts();
  }, []);

  useEffect(() => {
    const h = setTimeout(() => setFilters(p => ({ ...p, search: searchInput })), 400);
    return () => clearTimeout(h);
  }, [searchInput]);

  useEffect(() => {
    setSelectedIds(new Set());
    fetchAccounts(1);
  }, [activeTab, filters.status, filters.search]);

  const handleApprove = async (id) => {
    try {
      await adminAccountService.approveAccount(id);
      toast.success('Đã duyệt tài khoản!');
      fetchAccounts(pagination.current_page);
      fetchTabCounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể duyệt tài khoản.');
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
    const lbl = newStatus === 'locked' ? 'khóa' : 'mở khóa';
    setConfirmDialog({
      icon: newStatus === 'locked' ? <Lock size={20} className="text-amber-600" /> : <Unlock size={20} className="text-emerald-600" />,
      title: `Xác nhận ${lbl} tài khoản`,
      message: `Bạn có chắc muốn ${lbl} tài khoản này?`,
      danger: newStatus === 'locked',
      confirmLabel: lbl.charAt(0).toUpperCase() + lbl.slice(1),
      onConfirm: async () => {
        await adminAccountService.updateStatus(id, newStatus);
        toast.success(`Đã ${lbl} tài khoản!`);
        fetchAccounts(pagination.current_page);
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      icon: <Trash2 size={20} className="text-rose-600" />,
      title: 'Xóa tài khoản',
      message: 'Hành động này không thể hoàn tác. Tài khoản sẽ bị xóa vĩnh viễn.',
      danger: true,
      confirmLabel: 'Xóa vĩnh viễn',
      onConfirm: async () => {
        await adminAccountService.deleteAccount(id);
        toast.success('Đã xóa tài khoản!');
        fetchAccounts(pagination.current_page);
        fetchTabCounts();
      },
    });
  };

  const handleBulkAction = (action) => {
    const ids = Array.from(selectedIds);
    if (!ids.length) { toast('Chọn ít nhất một tài khoản.', { icon: '⚠️' }); return; }
    const labelMap = { approve: 'duyệt', lock: 'khóa', unlock: 'mở khóa', delete: 'xóa' };
    setConfirmDialog({
      icon: action === 'delete' ? <Trash2 size={20} className="text-rose-600" /> : <CheckCircle size={20} className="text-emerald-600" />,
      title: `${labelMap[action].charAt(0).toUpperCase() + labelMap[action].slice(1)} ${ids.length} tài khoản`,
      message: `Bạn có chắc muốn ${labelMap[action]} ${ids.length} tài khoản đã chọn?`,
      danger: action === 'delete' || action === 'lock',
      confirmLabel: `${labelMap[action].charAt(0).toUpperCase() + labelMap[action].slice(1)} tất cả`,
      onConfirm: async () => {
        setBulkLoading(true);
        try {
          await adminAccountService.bulkAction(ids, action);
          toast.success(`Đã ${labelMap[action]} ${ids.length} tài khoản!`);
          setSelectedIds(new Set());
          fetchAccounts(1);
          if (action === 'delete') fetchTabCounts();
        } finally {
          setBulkLoading(false);
        }
      },
    });
  };

  const handleExport = async () => {
    try {
      const res = await adminAccountService.exportExcel({ type: activeTab, status: filters.status || undefined });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `accounts_${activeTab}_${Date.now()}.csv`;
      link.click(); link.remove();
      toast.success('Đang tải danh sách...');
    } catch { toast.error('Không thể xuất file.'); }
  };

  const allSelected = accounts.length > 0 && accounts.every(a => selectedIds.has(a.id));

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Quản lý Tài khoản</h1>
          <p className="text-sm text-slate-500 mt-0.5">Duyệt và quản lý tài khoản nhà tuyển dụng & ứng viên</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-[13px] shadow-sm transition-all"
          >
            <Download size={15} /> Xuất CSV
          </button>
          <button
            onClick={() => fetchAccounts(pagination.current_page || 1)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-[13px] transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* TABS */}
        <div className="flex border-b border-slate-200">
          <TabBtn active={activeTab === 'employer'} onClick={() => { setActiveTab('employer'); setSearchInput(''); setFilters({ search: '', status: '' }); }} icon={<Building2 size={15} />} label="Nhà tuyển dụng" count={tabCounts.employer} />
          <TabBtn active={activeTab === 'student'} onClick={() => { setActiveTab('student'); setSearchInput(''); setFilters({ search: '', status: '' }); }} icon={<Users size={15} />} label="Ứng viên" count={tabCounts.student} />
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/40">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
              placeholder={activeTab === 'employer' ? 'Tên công ty, email...' : 'Tên sinh viên, email...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none cursor-pointer transition-all min-w-[150px]"
              value={filters.status}
              onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {(filters.search || filters.status || searchInput) && (
            <button
              onClick={() => { setSearchInput(''); setFilters({ search: '', status: '' }); }}
              className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-[13px] font-semibold transition-colors"
            >
              <X size={14} /> Xóa lọc
            </button>
          )}

          <div className="ml-auto text-[12px] font-medium text-slate-400">
            {!loading && `${accounts.length} / ${pagination.total || 0} kết quả`}
          </div>
        </div>

        {/* BULK ACTION BAR */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-2.5 bg-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold">
                    Đã chọn {selectedIds.size} tài khoản
                  </span>
                  <div className="flex gap-1.5">
                    {activeTab === 'employer' && (
                      <BulkBtn label="Duyệt" onClick={() => handleBulkAction('approve')} cls="bg-white/20 hover:bg-white/30" />
                    )}
                    <BulkBtn label="Khóa" onClick={() => handleBulkAction('lock')} cls="bg-white/20 hover:bg-white/30" />
                    <BulkBtn label="Xóa" onClick={() => handleBulkAction('delete')} cls="bg-red-500/80 hover:bg-red-500" />
                  </div>
                </div>
                <button onClick={() => setSelectedIds(new Set())} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABLE */}
        <AccountTable
          accounts={accounts}
          type={activeTab}
          loading={loading}
          pagination={pagination}
          selectedIds={selectedIds}
          onSelect={(id) => setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
          })}
          onSelectAll={() => setSelectedIds(allSelected ? new Set() : new Set(accounts.map(a => a.id)))}
          onViewDetail={setModalAccount}
          onApprove={handleApprove}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          onPageChange={fetchAccounts}
        />
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalAccount && (
          <AccountModal account={modalAccount} type={activeTab} onClose={() => setModalAccount(null)} onAction={(action, id, extra) => {
            if (action === 'approve') handleApprove(id);
            else if (action === 'toggleStatus') handleToggleStatus(id, extra);
            else if (action === 'delete') handleDelete(id);
          }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDialog && (
          <ConfirmDialog {...confirmDialog} onClose={() => setConfirmDialog(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Sub-components ---- */

const TabBtn = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-5 py-3.5 text-[13.5px] font-semibold transition-all ${
      active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
    {count != null && (
      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    )}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
  </button>
);

const BulkBtn = ({ label, onClick, cls }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-lg text-xs font-bold text-white transition-colors ${cls}`}
  >
    {label}
  </button>
);

const ConfirmDialog = ({ icon, title, message, danger, confirmLabel, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } finally { setLoading(false); onClose(); }
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl"
        style={{ padding: '1rem' }}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-rose-50' : 'bg-indigo-50'}`}>
          {icon}
        </div>
        <h3 className="text-[17px] font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-2.5 justify-end">
          <button onClick={onClose} disabled={loading}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Hủy
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAccounts;