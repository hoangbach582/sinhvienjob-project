import React, { useState, useEffect } from 'react';
import {
  X, Building2, Mail, Phone, Globe, Calendar, Briefcase,
  Users, FileText, CheckCircle, Lock, Unlock, Trash2,
  ExternalLink, User, BookOpen, Tag,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import adminAccountService from '../../services/adminAccountService';
import { toast } from 'react-hot-toast';

/**
 * Modal hiển thị chi tiết tài khoản (Employer hoặc Student)
 * Props:
 *  - account: object tài khoản đang xem
 *  - type: 'employer' | 'student'
 *  - onClose: đóng modal
 *  - onAction: callback khi thực hiện hành động (approve/lock/delete)
 */
const AccountModal = ({ account, type, onClose, onAction }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy chi tiết tài khoản khi mở modal
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await adminAccountService.getAccountDetail(account.id);
        setDetail(res.data || res);
      } catch (err) {
        // Fallback: dùng dữ liệu ban đầu nếu API chi tiết chưa có
        setDetail(account);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [account.id]);

  // Ngăn scroll body khi modal mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const d = detail || account;
  const isEmployer = type === 'employer';

  // --- Các hành động nhanh trong modal ---
  const handleApprove = () => { onAction('approve', d.id); onClose(); };
  const handleToggleLock = () => {
    const newStatus = d.status === 'locked' ? 'active' : 'locked';
    onAction('toggleStatus', d.id, newStatus);
    onClose();
  };
  const handleDelete = () => { onAction('delete', d.id); onClose(); };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.2s ease-out',
        }}
      >
        {/* Header modal */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e8ecf0',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: isEmployer
            ? 'linear-gradient(135deg, #EBF1FD, #f0f7ff)'
            : 'linear-gradient(135deg, #EAF3DE, #f0f9e6)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: isEmployer ? '#3B6FE8' : '#3B6D11',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', fontWeight: '700',
            flexShrink: 0,
          }}>
            {isEmployer
              ? (d.employer?.company_name?.[0] || d.name?.[0] || 'E')
              : (d.student_profile?.full_name?.[0] || d.name?.[0] || 'S')}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
              {isEmployer
                ? (d.employer?.company_name || d.name)
                : (d.student_profile?.full_name || d.name)}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <StatusBadge status={d.status || 'active'} size="sm" />
              <span style={{ fontSize: '12px', color: '#64748b' }}>{d.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', border: 'none', cursor: 'pointer',
              background: 'rgba(0,0,0,0.08)', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nội dung */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Thông tin chung */}
              <Section title="Thông tin cơ bản">
                <InfoRow icon={<Mail size={14} />} label="Email" value={d.email} />
                <InfoRow icon={<Calendar size={14} />} label="Ngày đăng ký"
                  value={d.created_at ? new Date(d.created_at).toLocaleDateString('vi-VN') : '—'} />

                {isEmployer ? (
                  <>
                    <InfoRow icon={<Building2 size={14} />} label="Công ty"
                      value={d.employer?.company_name || '—'} />
                    <InfoRow icon={<Tag size={14} />} label="Ngành nghề"
                      value={d.employer?.industry || '—'} />
                    <InfoRow icon={<Globe size={14} />} label="Website"
                      value={d.employer?.website
                        ? <a href={d.employer.website} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#3B6FE8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {d.employer.website} <ExternalLink size={11} />
                          </a>
                        : '—'} />
                    {d.employer?.description && (
                      <InfoRow icon={<FileText size={14} />} label="Mô tả"
                        value={<span style={{ color: '#64748b', lineHeight: '1.5' }}>{d.employer.description}</span>} />
                    )}
                  </>
                ) : (
                  <>
                    <InfoRow icon={<User size={14} />} label="Họ tên đầy đủ"
                      value={d.student_profile?.full_name || d.name || '—'} />
                    <InfoRow icon={<Phone size={14} />} label="Điện thoại"
                      value={d.student_profile?.phone || '—'} />
                    <InfoRow icon={<BookOpen size={14} />} label="Bio"
                      value={d.student_profile?.bio || '—'} />
                  </>
                )}
              </Section>

              {/* Thống kê */}
              <Section title="Thống kê hoạt động">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                  {isEmployer ? (
                    <>
                      <StatBox
                        icon={<Briefcase size={16} color="#3B6FE8" />}
                        label="Tin đã đăng"
                        value={d.jobs_count ?? d.employer?.jobs?.length ?? 0}
                        color="#EBF1FD"
                      />
                      <StatBox
                        icon={<Users size={16} color="#10b981" />}
                        label="Lượt ứng tuyển"
                        value={d.applications_count ?? 0}
                        color="#EAF3DE"
                      />
                    </>
                  ) : (
                    <>
                      <StatBox
                        icon={<FileText size={16} color="#3B6FE8" />}
                        label="Đơn đã nộp"
                        value={d.applications_count ?? 0}
                        color="#EBF1FD"
                      />
                      <StatBox
                        icon={<CheckCircle size={16} color="#10b981" />}
                        label="Đã được nhận"
                        value={d.hired_count ?? 0}
                        color="#EAF3DE"
                      />
                    </>
                  )}
                </div>
              </Section>

              {/* Kỹ năng (Student) */}
              {!isEmployer && d.skills && d.skills.length > 0 && (
                <Section title="Kỹ năng chính">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {d.skills.map((sk, i) => (
                      <span key={i} style={{
                        background: '#E6F1FB', color: '#185FA5',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                      }}>{sk.name || sk}</span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Danh sách tin tuyển dụng (Employer) */}
              {isEmployer && d.recent_jobs && d.recent_jobs.length > 0 && (
                <Section title="Tin tuyển dụng gần đây">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    {d.recent_jobs.slice(0, 5).map((job) => (
                      <div key={job.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', background: '#f8fafc', borderRadius: '8px',
                        border: '1px solid #e8ecf0',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{job.title}</span>
                        <span style={{
                          fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                          background: job.status === 'approved' ? '#EAF3DE' : '#FAEEDA',
                          color: job.status === 'approved' ? '#3B6D11' : '#854F0B',
                        }}>{job.status}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}
        </div>

        {/* Action buttons footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e8ecf0',
          display: 'flex', gap: '8px', justifyContent: 'flex-end',
          background: '#fafbfc',
        }}>
          {/* Nút Duyệt - chỉ hiện khi đang chờ duyệt */}
          {d.status === 'pending' && isEmployer && (
            <button
              className="btn"
              onClick={handleApprove}
              style={{ background: '#EAF3DE', color: '#3B6D11', borderColor: '#c6e0a0', gap: '6px' }}
            >
              <CheckCircle size={14} /> Duyệt tài khoản
            </button>
          )}

          {/* Nút Khóa / Mở khóa */}
          <button
            className="btn"
            onClick={handleToggleLock}
            style={{
              gap: '6px',
              background: d.status === 'locked' ? '#EAF3DE' : '#FEF3F2',
              color: d.status === 'locked' ? '#3B6D11' : '#B91C1C',
              borderColor: d.status === 'locked' ? '#c6e0a0' : '#fecaca',
            }}
          >
            {d.status === 'locked'
              ? <><Unlock size={14} /> Mở khóa</>
              : <><Lock size={14} /> Khóa tài khoản</>}
          </button>

          {/* Nút Xóa */}
          <button
            className="btn"
            onClick={handleDelete}
            style={{ gap: '6px', background: '#FEF3F2', color: '#B91C1C', borderColor: '#fecaca' }}
          >
            <Trash2 size={14} /> Xóa
          </button>

          <button className="btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{
      fontSize: '12px', fontWeight: '600', color: '#94a3b8',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      marginBottom: '10px', paddingBottom: '6px',
      borderBottom: '1px solid #f1f5f9',
    }}>
      {title}
    </h4>
    {children}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div style={{
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    padding: '6px 0', borderBottom: '1px solid #f8fafc',
  }}>
    <div style={{ color: '#94a3b8', marginTop: '1px', flexShrink: 0 }}>{icon}</div>
    <span style={{ fontSize: '12px', color: '#64748b', minWidth: '100px', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>{value}</span>
  </div>
);

const StatBox = ({ icon, label, value, color }) => (
  <div style={{
    background: color, borderRadius: '10px', padding: '12px',
    display: 'flex', alignItems: 'center', gap: '10px',
  }}>
    <div>{icon}</div>
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>{label}</div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {[1, 2, 3, 4].map(i => (
      <div key={i} style={{
        height: '36px', borderRadius: '8px',
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />
    ))}
  </div>
);

export default AccountModal;
