import React from 'react';
import {
  Eye, CheckCircle, Lock, Unlock, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Component bảng danh sách tài khoản (dùng chung cho Employer & Student)
 *
 * Props:
 *  - accounts: mảng dữ liệu
 *  - type: 'employer' | 'student'
 *  - loading: boolean
 *  - pagination: { current_page, last_page, total, per_page }
 *  - selectedIds: Set ID đã chọn
 *  - onSelect: (id) => toggle chọn 1 dòng
 *  - onSelectAll: () => chọn/bỏ chọn tất cả
 *  - onViewDetail: (account) => mở modal chi tiết
 *  - onApprove: (id) => duyệt
 *  - onToggleStatus: (id, currentStatus) => khóa/mở khóa
 *  - onDelete: (id) => xóa
 *  - onPageChange: (page) => đổi trang
 */
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
  const allSelected = accounts.length > 0 && accounts.every((a) => selectedIds.has(a.id));

  // =====================
  // Render skeleton loading
  // =====================
  if (loading) {
    return (
      <div className="table-wrap" style={{ borderRadius: '12px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              {(isEmployer
                ? ['Công ty', 'Email', 'Ngày đăng ký', 'Tin đã đăng', 'Trạng thái', 'Hành động']
                : ['Họ tên', 'Email', 'Ngày đăng ký', 'Đơn đã nộp', 'Kỹ năng', 'Trạng thái', 'Hành động']
              ).map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: isEmployer ? 7 : 8 }).map((_, j) => (
                  <td key={j}>
                    <div style={{
                      height: '16px', borderRadius: '6px',
                      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                      width: j === 0 ? '24px' : '80%',
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // =====================
  // Empty state
  // =====================
  if (accounts.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 20px',
        background: '#fafbfc', borderRadius: '12px',
        border: '1px dashed #d1d9e0', gap: '12px',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isEmployer
            ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg>
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          }
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>Không có dữ liệu</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
            Không tìm thấy {isEmployer ? 'nhà tuyển dụng' : 'ứng viên'} nào phù hợp với bộ lọc.
          </p>
        </div>
      </div>
    );
  }

  // =====================
  // Main table
  // =====================
  return (
    <>
      <div className="table-wrap" style={{ borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ minWidth: isEmployer ? '800px' : '900px' }}>
          <thead>
            <tr>
              {/* Checkbox chọn tất cả */}
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                />
              </th>

              {isEmployer ? (
                <>
                  <th>Công ty</th>
                  <th>Email</th>
                  <th>Ngày đăng ký</th>
                  <th style={{ textAlign: 'center' }}>Tin đã đăng</th>
                  <th>Trạng thái</th>
                </>
              ) : (
                <>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Ngày đăng ký</th>
                  <th style={{ textAlign: 'center' }}>Đơn đã nộp</th>
                  <th>Kỹ năng chính</th>
                  <th>Trạng thái</th>
                </>
              )}

              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((acc) => {
              const isSelected = selectedIds.has(acc.id);
              const status = acc.status || 'active';

              return (
                <tr
                  key={acc.id}
                  onClick={() => onViewDetail(acc)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? '#EBF1FD' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Checkbox chọn dòng */}
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(acc.id)}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                  </td>

                  {isEmployer ? (
                    <>
                      {/* Cột Công ty */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#E6F1FB', color: '#185FA5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '13px', flexShrink: 0,
                          }}>
                            {acc.employer?.logo_url
                              ? <img src={acc.employer.logo_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                              : (acc.employer?.company_name?.[0] || acc.name?.[0] || 'E')
                            }
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '13px' }}>
                              {acc.employer?.company_name || acc.name}
                            </div>
                            {acc.employer?.industry && (
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{acc.employer.industry}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cột Email */}
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{acc.email}</td>

                      {/* Ngày đăng ký */}
                      <td style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {acc.created_at ? new Date(acc.created_at).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Số tin đã đăng */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', minWidth: '28px', padding: '2px 8px',
                          background: '#E6F1FB', color: '#185FA5', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 600,
                        }}>
                          {acc.jobs_count ?? 0}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Cột Họ tên */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: '#EAF3DE', color: '#3B6D11',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '13px', flexShrink: 0,
                          }}>
                            {acc.student_profile?.avatar
                              ? <img src={acc.student_profile.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                              : (acc.student_profile?.full_name?.[0] || acc.name?.[0] || 'S')
                            }
                          </div>
                          <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '13px' }}>
                            {acc.student_profile?.full_name || acc.name}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{acc.email}</td>

                      {/* Ngày đăng ký */}
                      <td style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {acc.created_at ? new Date(acc.created_at).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Số đơn nộp */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', minWidth: '28px', padding: '2px 8px',
                          background: '#E6F1FB', color: '#185FA5', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 600,
                        }}>
                          {acc.applications_count ?? 0}
                        </span>
                      </td>

                      {/* Kỹ năng chính */}
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(acc.skills || []).slice(0, 2).map((sk, i) => (
                            <span key={i} style={{
                              background: '#f1f5f9', color: '#64748b',
                              padding: '2px 7px', borderRadius: '20px', fontSize: '11px',
                            }}>{sk.name || sk}</span>
                          ))}
                          {(acc.skills || []).length > 2 && (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{acc.skills.length - 2}</span>
                          )}
                          {!(acc.skills?.length) && <span style={{ fontSize: '12px', color: '#cbd5e1' }}>—</span>}
                        </div>
                      </td>
                    </>
                  )}

                  {/* Trạng thái */}
                  <td><StatusBadge status={status} /></td>

                  {/* Hành động */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      {/* Xem chi tiết */}
                      <ActionButton
                        icon={<Eye size={13} />}
                        title="Xem chi tiết"
                        onClick={() => onViewDetail(acc)}
                        color="#185FA5"
                        bg="#E6F1FB"
                      />

                      {/* Duyệt - chỉ hiện khi đang chờ duyệt (employer) */}
                      {status === 'pending' && isEmployer && (
                        <ActionButton
                          icon={<CheckCircle size={13} />}
                          title="Duyệt"
                          onClick={() => onApprove(acc.id)}
                          color="#3B6D11"
                          bg="#EAF3DE"
                        />
                      )}

                      {/* Khóa / Mở khóa */}
                      <ActionButton
                        icon={status === 'locked' ? <Unlock size={13} /> : <Lock size={13} />}
                        title={status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
                        onClick={() => onToggleStatus(acc.id, status)}
                        color={status === 'locked' ? '#3B6D11' : '#B45309'}
                        bg={status === 'locked' ? '#EAF3DE' : '#FFFBEB'}
                      />

                      {/* Xóa */}
                      <ActionButton
                        icon={<Trash2 size={13} />}
                        title="Xóa tài khoản"
                        onClick={() => onDelete(acc.id)}
                        color="#B91C1C"
                        bg="#FEF3F2"
                      />
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '14px', flexWrap: 'wrap', gap: '8px',
        }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Trang {pagination.current_page}/{pagination.last_page} —{' '}
            Tổng {pagination.total} bản ghi
          </span>

          <div style={{ display: 'flex', gap: '4px' }}>
            {/* Về đầu */}
            <PagBtn
              icon={<ChevronsLeft size={14} />}
              disabled={pagination.current_page <= 1}
              onClick={() => onPageChange(1)}
            />
            {/* Trang trước */}
            <PagBtn
              icon={<ChevronLeft size={14} />}
              disabled={pagination.current_page <= 1}
              onClick={() => onPageChange(pagination.current_page - 1)}
            />

            {/* Các số trang */}
            {getPageNumbers(pagination.current_page, pagination.last_page).map((p, i) =>
              p === '...' ? (
                <span key={`dot-${i}`} style={{ padding: '4px 6px', color: '#94a3b8', fontSize: '12px' }}>…</span>
              ) : (
                <PagBtn
                  key={p}
                  label={p}
                  active={p === pagination.current_page}
                  onClick={() => onPageChange(p)}
                />
              )
            )}

            {/* Trang sau */}
            <PagBtn
              icon={<ChevronRight size={14} />}
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => onPageChange(pagination.current_page + 1)}
            />
            {/* Về cuối */}
            <PagBtn
              icon={<ChevronsRight size={14} />}
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => onPageChange(pagination.last_page)}
            />
          </div>
        </div>
      )}
    </>
  );
};

// --- Helper: tạo dãy số trang (có dấu ...) ---
const getPageNumbers = (current, last) => {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < last - 2) pages.push('...');
  pages.push(last);
  return pages;
};

// --- Sub-components ---

const ActionButton = ({ icon, title, onClick, color, bg }) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: '28px', height: '28px', border: 'none', cursor: 'pointer',
      background: bg, color, borderRadius: '7px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.15s, transform 0.1s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'scale(1.05)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {icon}
  </button>
);

const PagBtn = ({ label, icon, active, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      minWidth: '32px', height: '32px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: '8px', fontSize: '13px', fontWeight: active ? 600 : 400,
      background: active ? '#3B6FE8' : '#f1f5f9',
      color: active ? '#fff' : disabled ? '#cbd5e1' : '#475569',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}
  >
    {icon || label}
  </button>
);

export default AccountTable;
