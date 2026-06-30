import React from 'react';
import { Eye, CheckCircle, Lock, Unlock, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const AccountTable = ({
  accounts = [],
  type = 'employer',
  loading = false,
  pagination = {},
  selectedIds = new Set(),
  onSelect,
  onSelectAll,
  onViewDetail,
  onApprove,
  onToggleStatus,
  onDelete,
  onPageChange,
}) => {
  const isEmployer = type === 'employer';
  const allSelected = accounts.length > 0 && accounts.every(a => selectedIds.has(a.id));

  /* ----- Skeleton ----- */
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="py-3 px-4 w-10" />
              {['', '', '', '', '', ''].map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <div className="h-3.5 w-20 rounded-md bg-slate-200 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-50">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="py-3.5 px-4">
                    <div className={`h-4 rounded-md bg-slate-100 animate-pulse ${j === 0 ? 'w-5' : j === 1 ? 'w-36' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ----- Empty ----- */
  if (!accounts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Users className="text-slate-400" size={24} />
        </div>
        <p className="text-slate-700 font-semibold">Không có dữ liệu</p>
        <p className="text-slate-400 text-sm mt-1">
          Không tìm thấy {isEmployer ? 'nhà tuyển dụng' : 'ứng viên'} phù hợp.
        </p>
      </div>
    );
  }

  /* ----- Main table ----- */
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/70">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-[15px] h-[15px] rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
              </th>
              <th className="py-3 px-4">{isEmployer ? 'Công ty' : 'Ứng viên'}</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Ngày đăng ký</th>
              <th className="py-3 px-4 text-center">{isEmployer ? 'Tin đăng' : 'Đơn nộp'}</th>
              {!isEmployer && <th className="py-3 px-4">Kỹ năng</th>}
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 w-[100px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map(acc => {
              const isSelected = selectedIds.has(acc.id);
              const status = acc.status || 'active';
              const initials = isEmployer
                ? (acc.employer?.company_name?.[0] || acc.name?.[0] || 'E').toUpperCase()
                : (acc.student_profile?.full_name?.[0] || acc.name?.[0] || 'S').toUpperCase();
              const displayName = isEmployer
                ? (acc.employer?.company_name || acc.name || '—')
                : (acc.student_profile?.full_name || acc.name || '—');

              return (
                <tr
                  key={acc.id}
                  onClick={() => onViewDetail(acc)}
                  className={`group cursor-pointer transition-colors text-[13px] ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/70'}`}
                >
                  <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(acc.id)}
                      className="w-[15px] h-[15px] rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${isEmployer ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isEmployer && acc.employer?.logo_url ? (
                          <img src={acc.employer.logo_url} alt="" className="w-full h-full object-cover" />
                        ) : initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[160px]">
                          {displayName}
                        </div>
                        {isEmployer && acc.employer?.industry && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[160px]">{acc.employer.industry}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-500 truncate max-w-[180px]">{acc.email}</td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {acc.created_at ? new Date(acc.created_at).toLocaleDateString('vi-VN') : '—'}
                  </td>

                  {/* Count */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-6 text-xs font-bold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {isEmployer ? (acc.jobs_count ?? 0) : (acc.applications_count ?? 0)}
                    </span>
                  </td>

                  {/* Skills (student) */}
                  {!isEmployer && (
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {(acc.skills || []).slice(0, 2).map((sk, i) => (
                          <span key={i} className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                            {sk.name || sk}
                          </span>
                        ))}
                        {(acc.skills || []).length > 2 && (
                          <span className="text-[11px] text-slate-400">+{acc.skills.length - 2}</span>
                        )}
                        {!(acc.skills?.length) && <span className="text-slate-300">—</span>}
                      </div>
                    </td>
                  )}

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={<Eye size={14} />} title="Xem chi tiết" onClick={() => onViewDetail(acc)} cls="text-indigo-600 hover:bg-indigo-50" />
                      {status === 'pending' && isEmployer && (
                        <ActionBtn icon={<CheckCircle size={14} />} title="Duyệt" onClick={() => onApprove(acc.id)} cls="text-emerald-600 hover:bg-emerald-50" />
                      )}
                      <ActionBtn
                        icon={status === 'locked' ? <Unlock size={14} /> : <Lock size={14} />}
                        title={status === 'locked' ? 'Mở khóa' : 'Khóa'}
                        onClick={() => onToggleStatus(acc.id, status)}
                        cls={status === 'locked' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}
                      />
                      <ActionBtn icon={<Trash2 size={14} />} title="Xóa" onClick={() => onDelete(acc.id)} cls="text-rose-500 hover:bg-rose-50" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <span className="text-[12px] font-medium text-slate-400">
            Trang {pagination.current_page}/{pagination.last_page} · {pagination.total} kết quả
          </span>
          <div className="flex items-center gap-1">
            <PagBtn icon={<ChevronsLeft size={14} />} disabled={pagination.current_page <= 1} onClick={() => onPageChange(1)} />
            <PagBtn icon={<ChevronLeft size={14} />} disabled={pagination.current_page <= 1} onClick={() => onPageChange(pagination.current_page - 1)} />
            {getPageNumbers(pagination.current_page, pagination.last_page).map((p, i) =>
              p === '...' ? (
                <span key={`d${i}`} className="px-1.5 text-slate-300 text-sm select-none">…</span>
              ) : (
                <PagBtn key={p} label={p} active={p === pagination.current_page} onClick={() => onPageChange(p)} />
              )
            )}
            <PagBtn icon={<ChevronRight size={14} />} disabled={pagination.current_page >= pagination.last_page} onClick={() => onPageChange(pagination.current_page + 1)} />
            <PagBtn icon={<ChevronsRight size={14} />} disabled={pagination.current_page >= pagination.last_page} onClick={() => onPageChange(pagination.last_page)} />
          </div>
        </div>
      )}
    </>
  );
};

const getPageNumbers = (current, last) => {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
  if (current < last - 2) pages.push('...');
  pages.push(last);
  return pages;
};

const ActionBtn = ({ icon, title, onClick, cls }) => (
  <button title={title} onClick={onClick}
    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${cls}`}
    style={{ cursor: 'pointer' }}>
    {icon}
  </button>
);

const PagBtn = ({ label, icon, active, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled}
    className={`min-w-[32px] h-[32px] px-1 flex items-center justify-center rounded-xl text-[13px] font-semibold transition-colors
      ${active ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' : disabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}>
    {icon || label}
  </button>
);

// Fallback for missing Users import in empty state
const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default AccountTable;
