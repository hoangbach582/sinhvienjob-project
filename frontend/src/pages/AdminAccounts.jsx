import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, Building2, Search, Filter, Download, RefreshCw,
  CheckCircle, Lock, Trash2, Unlock, X, ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AccountTable from '../components/admin/AccountTable';
import AccountModal from '../components/admin/AccountModal';
import adminAccountService from '../services/adminAccountService';

// ============================================================
// TRANG QUẢN LÝ TÀI KHOẢN ADMIN (AdminAccounts)
// Hỗ trợ: Nhà tuyển dụng & Ứng viên
// ============================================================

// Cấu hình bộ lọc trạng thái
const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'locked', label: 'Bị khóa' },
  { value: 'rejected', label: 'Bị từ chối' },
];

function AdminAccounts() {
  // ---- State quản lý tab ----
  const [activeTab, setActiveTab] = useState('employer'); // 'employer' | 'student'

  // ---- State danh sách & phân trang ----
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // ---- State bộ lọc ----
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date_from: '',
    date_to: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // ---- State bulk actions ----
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // ---- State modal ----
  const [modalAccount, setModalAccount] = useState(null);

  // ---- State confirm dialog ----
  const [confirmDialog, setConfirmDialog] = useState(null);
  // { type: 'delete'|'lock'|'bulkApprove'|..., id, message, onConfirm }

  // ==========================
  // Fetch dữ liệu từ API
  // ==========================
  const fetchAccounts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminAccountService.getAccounts({
        type: activeTab,
        page,
        search: filters.search || undefined,
        status: filters.status || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
      });
      // API trả về { data: [...], current_page, last_page, total, per_page }
      const payload = res.data || res;
      setAccounts(payload.data || payload);
      setPagination({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        total: payload.total || 0,
        per_page: payload.per_page || 15,
      });
    } catch (err) {
      console.error('Lỗi tải danh sách tài khoản:', err);
      toast.error('Không thể tải danh sách tài khoản.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // Debounce tìm kiếm thông qua searchInput
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Re-fetch khi đổi tab hoặc bộ lọc thay đổi
  useEffect(() => {
    setSelectedIds(new Set()); // Reset danh sách chọn khi đổi tab hoặc bộ lọc
    fetchAccounts(1);
  }, [activeTab, filters.status, filters.search, filters.date_from, filters.date_to]);

  // ==========================
  // Hành động đơn lẻ
  // ==========================

  // Duyệt tài khoản
  const handleApprove = async (id) => {
    try {
      await adminAccountService.approveAccount(id);
      toast.success('Đã duyệt tài khoản thành công!');
      fetchAccounts(pagination.current_page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể duyệt tài khoản.');
    }
  };

  // Khóa / Mở khóa tài khoản
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
    const actionLabel = newStatus === 'locked' ? 'khóa' : 'mở khóa';
    setConfirmDialog({
      type: 'toggleStatus',
      icon: newStatus === 'locked' ? <Lock size={20} color="#B45309" /> : <Unlock size={20} color="#3B6D11" />,
      title: `Xác nhận ${actionLabel} tài khoản`,
      message: `Bạn có chắc muốn ${actionLabel} tài khoản này?`,
      danger: newStatus === 'locked',
      confirmLabel: actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1),
      onConfirm: async () => {
        try {
          await adminAccountService.updateStatus(id, newStatus);
          toast.success(`Đã ${actionLabel} tài khoản thành công!`);
          fetchAccounts(pagination.current_page);
        } catch (err) {
          toast.error(err.response?.data?.message || `Không thể ${actionLabel}.`);
        }
      },
    });
  };

  // Xóa tài khoản
  const handleDelete = (id) => {
    setConfirmDialog({
      type: 'delete',
      icon: <Trash2 size={20} color="#B91C1C" />,
      title: 'Xác nhận xóa tài khoản',
      message: 'Hành động này không thể hoàn tác. Tài khoản và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.',
      danger: true,
      confirmLabel: 'Xóa vĩnh viễn',
      onConfirm: async () => {
        try {
          await adminAccountService.deleteAccount(id);
          toast.success('Đã xóa tài khoản thành công!');
          fetchAccounts(pagination.current_page);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Không thể xóa tài khoản.');
        }
      },
    });
  };

  // Xử lý hành động từ modal (modal gọi lên parent)
  const handleModalAction = (action, id, extraData) => {
    if (action === 'approve') handleApprove(id);
    else if (action === 'toggleStatus') handleToggleStatus(id, extraData === 'locked' ? 'locked' : 'active');
    else if (action === 'delete') handleDelete(id);
  };

  // ==========================
  // Bulk Actions
  // ==========================
  const handleSelectAll = () => {
    if (accounts.every((a) => selectedIds.has(a.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(accounts.map((a) => a.id)));
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      toast('Vui lòng chọn ít nhất một tài khoản.', { icon: '⚠️' });
      return;
    }

    const labelMap = {
      approve: 'duyệt',
      lock: 'khóa',
      unlock: 'mở khóa',
      delete: 'xóa',
    };

    setConfirmDialog({
      type: `bulk_${action}`,
      icon: action === 'delete'
        ? <Trash2 size={20} color="#B91C1C" />
        : action === 'approve'
          ? <CheckCircle size={20} color="#3B6D11" />
          : <Lock size={20} color="#B45309" />,
      title: `Xác nhận ${labelMap[action]} ${ids.length} tài khoản`,
      message: `Bạn có chắc muốn ${labelMap[action]} ${ids.length} tài khoản đã chọn?`,
      danger: action === 'delete' || action === 'lock',
      confirmLabel: labelMap[action].charAt(0).toUpperCase() + labelMap[action].slice(1) + ' tất cả',
      onConfirm: async () => {
        setBulkLoading(true);
        try {
          await adminAccountService.bulkAction(ids, action);
          toast.success(`Đã ${labelMap[action]} ${ids.length} tài khoản thành công!`);
          setSelectedIds(new Set());
          fetchAccounts(1);
        } catch (err) {
          toast.error(err.response?.data?.message || `Không thể ${labelMap[action]} hàng loạt.`);
        } finally {
          setBulkLoading(false);
        }
      },
    });
  };

  // ==========================
  // Export Excel
  // ==========================
  const handleExport = async () => {
    try {
      const res = await adminAccountService.exportExcel({
        type: activeTab,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `accounts_${activeTab}_${Date.now()}.csv`;
      link.click();
      link.remove();
      toast.success('Đang tải danh sách tài khoản...');
    } catch {
      toast.error('Không thể xuất Excel. Vui lòng thử lại.');
    }
  };

  // ==========================
  // Thống kê nhanh (hiển thị số total)
  // ==========================
  const totalShowing = accounts.length;
  const selectedCount = selectedIds.size;

  // ==========================
  // Render
  // ==========================
  return (
    <div>
      {/* ====== HEADER ====== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Quản lý Tài khoản
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Quản lý tài khoản nhà tuyển dụng và ứng viên trên hệ thống
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            onClick={handleExport}
            style={{ gap: '6px', fontSize: '13px' }}
          >
            <Download size={14} /> Xuất Excel
          </button>
          <button
            className="btn"
            onClick={() => fetchAccounts(pagination.current_page || 1)}
            style={{ gap: '6px', fontSize: '13px' }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Làm mới
          </button>
        </div>
      </div>

      {/* ====== TABS ====== */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '2px solid #e8ecf0' }}>
        <TabButton
          active={activeTab === 'employer'}
          onClick={() => {
            setActiveTab('employer');
            setSearchInput('');
            setFilters({ search: '', status: '', date_from: '', date_to: '' });
          }}
          icon={<Building2 size={15} />}
          label="Nhà tuyển dụng"
        />
        <TabButton
          active={activeTab === 'student'}
          onClick={() => {
            setActiveTab('student');
            setSearchInput('');
            setFilters({ search: '', status: '', date_from: '', date_to: '' });
          }}
          icon={<Users size={15} />}
          label="Ứng viên"
        />
      </div>

      {/* ====== BỘ LỌC ====== */}
      <div style={{
        background: '#fafbfc', border: '1px solid #e8ecf0', borderTop: 'none',
        borderRadius: '0 0 12px 12px', padding: '14px 16px', marginBottom: '16px',
      }}>
        {/* Thanh tìm kiếm + toggle filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8',
            }} />
            <input
              className="form-input"
              placeholder={activeTab === 'employer' ? 'Tên công ty, email...' : 'Tên sinh viên, email...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Lọc trạng thái */}
          <select
            className="form-input"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            style={{ width: '170px' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Toggle bộ lọc nâng cao */}
          <button
            className="btn"
            onClick={() => setShowFilterPanel((v) => !v)}
            style={{
              gap: '6px', fontSize: '13px',
              background: showFilterPanel ? '#EBF1FD' : 'transparent',
              color: showFilterPanel ? '#185FA5' : 'inherit',
              borderColor: showFilterPanel ? '#bbd0f5' : undefined,
            }}
          >
            <Filter size={14} />
            Lọc nâng cao
            <ChevronDown size={12} style={{ transform: showFilterPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Nút xóa bộ lọc */}
          {(filters.search || filters.status || filters.date_from || filters.date_to || searchInput) && (
            <button
              className="btn"
              onClick={() => {
                setSearchInput('');
                setFilters({ search: '', status: '', date_from: '', date_to: '' });
              }}
              style={{ gap: '4px', color: '#B91C1C', borderColor: '#fecaca', fontSize: '13px' }}
            >
              <X size={13} /> Xóa lọc
            </button>
          )}
        </div>

        {/* Panel bộ lọc nâng cao (ngày đăng ký) */}
        {showFilterPanel && (
          <div style={{
            marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'flex-end',
            flexWrap: 'wrap', padding: '12px', background: '#fff',
            border: '1px solid #e8ecf0', borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                Đăng ký từ
              </label>
              <input
                type="date"
                className="form-input"
                value={filters.date_from}
                onChange={(e) => setFilters((prev) => ({ ...prev, date_from: e.target.value }))}
                style={{ width: '160px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                Đến ngày
              </label>
              <input
                type="date"
                className="form-input"
                value={filters.date_to}
                onChange={(e) => setFilters((prev) => ({ ...prev, date_to: e.target.value }))}
                style={{ width: '160px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ====== BULK ACTION BAR ====== */}
      {selectedCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', borderRadius: '10px', marginBottom: '12px',
          background: 'linear-gradient(135deg, #EBF1FD, #dbeafe)',
          border: '1px solid #bbd0f5',
          animation: 'slideDown 0.15s ease-out',
        }}>
          <span style={{ fontWeight: '600', fontSize: '13px', color: '#185FA5' }}>
            Đã chọn {selectedCount} tài khoản
          </span>
          <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
            {activeTab === 'employer' && (
              <BulkButton
                icon={<CheckCircle size={13} />}
                label="Duyệt hàng loạt"
                onClick={() => handleBulkAction('approve')}
                color="#3B6D11"
                bg="#EAF3DE"
                disabled={bulkLoading}
              />
            )}
            <BulkButton
              icon={<Lock size={13} />}
              label="Khóa hàng loạt"
              onClick={() => handleBulkAction('lock')}
              color="#B45309"
              bg="#FFFBEB"
              disabled={bulkLoading}
            />
            <BulkButton
              icon={<Trash2 size={13} />}
              label="Xóa hàng loạt"
              onClick={() => handleBulkAction('delete')}
              color="#B91C1C"
              bg="#FEF3F2"
              disabled={bulkLoading}
            />
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ====== SUMMARY BAR ====== */}
      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Hiển thị {totalShowing} / {pagination.total || 0} bản ghi
          </span>
        </div>
      )}

      {/* ====== BẢNG DỮ LIỆU ====== */}
      <AccountTable
        accounts={accounts}
        type={activeTab}
        loading={loading}
        pagination={pagination}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onViewDetail={(acc) => setModalAccount(acc)}
        onApprove={handleApprove}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onPageChange={(page) => fetchAccounts(page)}
      />

      {/* ====== MODAL CHI TIẾT ====== */}
      {modalAccount && (
        <AccountModal
          account={modalAccount}
          type={activeTab}
          onClose={() => setModalAccount(null)}
          onAction={handleModalAction}
        />
      )}

      {/* ====== CONFIRM DIALOG ====== */}
      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onClose={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

// ==============================
// Sub-components
// ==============================

/** Tab button */
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      padding: '10px 18px',
      border: 'none', background: 'transparent',
      cursor: 'pointer', fontSize: '13px', fontWeight: active ? '600' : '400',
      color: active ? '#3B6FE8' : '#64748b',
      borderBottom: active ? '2px solid #3B6FE8' : '2px solid transparent',
      marginBottom: '-2px',
      transition: 'all 0.15s',
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#334155'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#64748b'; }}
  >
    {icon}
    {label}
  </button>
);

/** Bulk action button */
const BulkButton = ({ icon, label, onClick, color, bg, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '5px 12px', borderRadius: '8px', border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: bg, color, fontSize: '12px', fontWeight: 600,
      transition: 'opacity 0.15s',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    {icon}
    {label}
  </button>
);

/** Confirm Dialog (nguy hiểm) */
const ConfirmDialog = ({ icon, title, message, danger, confirmLabel, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  // Ngăn scroll body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff', borderRadius: '16px',
        width: '100%', maxWidth: '400px',
        padding: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
        animation: 'slideUp 0.2s ease-out',
      }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: danger ? '#FEF3F2' : '#EBF1FD',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
        }}>
          {icon}
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', lineHeight: '1.6' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} disabled={loading}>Hủy</button>
          <button
            className="btn"
            onClick={handleConfirm}
            disabled={loading}
            style={{
              background: danger ? '#B91C1C' : '#3B6FE8',
              color: '#fff',
              borderColor: danger ? '#B91C1C' : '#3B6FE8',
              gap: '6px',
            }}
          >
            {loading && <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;