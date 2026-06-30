import React, { useState, useEffect } from 'react';
import {
  X, Building2, Mail, Phone, Globe, Calendar, Briefcase,
  Users, FileText, CheckCircle, Lock, Unlock, Trash2,
  ExternalLink, User, BookOpen, Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import adminAccountService from '../../services/adminAccountService';

const AccountModal = ({ account, type, onClose, onAction }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await adminAccountService.getAccountDetail(account.id);
        setDetail(res.data || res);
      } catch (err) {
        setDetail(account);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [account.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const d = detail || account;
  const isEmployer = type === 'employer';

  const handleApprove = () => { onAction('approve', d.id); onClose(); };
  const handleToggleLock = () => {
    const newStatus = d.status === 'locked' ? 'active' : 'locked';
    onAction('toggleStatus', d.id, newStatus);
    onClose();
  };
  const handleDelete = () => { onAction('delete', d.id); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10 font-sans"
        style={{ padding: '1rem' }}
      >
        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-100 flex items-center gap-4 shrink-0 ${isEmployer ? 'bg-indigo-50/50' : 'bg-emerald-50/50'}`} style={{ marginBottom: '1rem' }}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm ${isEmployer ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-emerald-600 shadow-emerald-600/20'}`}>
            {isEmployer
              ? (d.employer?.company_name?.[0] || d.name?.[0] || 'E').toUpperCase()
              : (d.student_profile?.full_name?.[0] || d.name?.[0] || 'S').toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">
              {isEmployer
                ? (d.employer?.company_name || d.name)
                : (d.student_profile?.full_name || d.name)}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <StatusBadge status={d.status || 'active'} size="sm" />
              <span className="text-sm text-slate-500 truncate">{d.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shrink-0"
            style={{ cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-auto overflow-y-auto p-6 bg-slate-50/30 min-h-0">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-8">
              {/* Thông tin chung */}
              <Section title="Thông tin cơ bản">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
                  <InfoRow icon={<Mail size={16} />} label="Email" value={d.email} />
                  <InfoRow icon={<Calendar size={16} />} label="Ngày đăng ký" value={d.created_at ? new Date(d.created_at).toLocaleDateString('vi-VN') : '—'} />

                  {isEmployer ? (
                    <>
                      <InfoRow icon={<Building2 size={16} />} label="Công ty" value={d.employer?.company_name || '—'} />
                      <InfoRow icon={<Tag size={16} />} label="Ngành nghề" value={d.employer?.industry || '—'} />
                      <InfoRow icon={<Globe size={16} />} label="Website" value={
                        d.employer?.website ? (
                          <a href={d.employer.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline">
                            {d.employer.website} <ExternalLink size={12} />
                          </a>
                        ) : '—'
                      } />
                    </>
                  ) : (
                    <>
                      <InfoRow icon={<User size={16} />} label="Họ tên đầy đủ" value={d.student_profile?.full_name || d.name || '—'} />
                      <InfoRow icon={<Phone size={16} />} label="Điện thoại" value={d.student_profile?.phone || '—'} />
                    </>
                  )}
                </div>
                
                {isEmployer && d.employer?.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100" style={{ marginBottom: '1rem' }}>
                    <InfoRow icon={<FileText size={16} />} label="Mô tả" fullWidth value={
                      <span className="text-slate-600 text-sm leading-relaxed block mt-1 bg-white p-4 rounded-xl border border-slate-100">
                        {d.employer.description}
                      </span>
                    } />
                  </div>
                )}
                
                {!isEmployer && d.student_profile?.bio && (
                  <div className="mt-4 pt-4 border-t border-slate-100" style={{ marginBottom: '1rem' }}>
                    <InfoRow icon={<BookOpen size={16} />} label="Bio" fullWidth value={
                      <span className="text-slate-600 text-sm leading-relaxed block mt-1 bg-white p-4 rounded-xl border border-slate-100">
                        {d.student_profile.bio}
                      </span>
                    } />
                  </div>
                )}
              </Section>

              {/* Thống kê */}
              <Section title="Thống kê hoạt động">
                <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
                  {isEmployer ? (
                    <>
                      <StatBox
                        icon={<Briefcase size={20} className="text-indigo-600" />}
                        label="Tin đã đăng"
                        value={d.jobs_count ?? d.employer?.jobs?.length ?? 0}
                        bg="bg-indigo-50"
                      />
                      <StatBox
                        icon={<Users size={20} className="text-emerald-600" />}
                        label="Lượt ứng tuyển"
                        value={d.applications_count ?? 0}
                        bg="bg-emerald-50"
                      />
                    </>
                  ) : (
                    <>
                      <StatBox
                        icon={<FileText size={20} className="text-indigo-600" />}
                        label="Đơn đã nộp"
                        value={d.applications_count ?? 0}
                        bg="bg-indigo-50"
                      />
                      <StatBox
                        icon={<CheckCircle size={20} className="text-emerald-600" />}
                        label="Đã được nhận"
                        value={d.hired_count ?? 0}
                        bg="bg-emerald-50"
                      />
                    </>
                  )}
                </div>
              </Section>

              {/* Kỹ năng (Student) */}
              {!isEmployer && d.skills && d.skills.length > 0 && (
                <Section title="Kỹ năng chính">
                  <div className="flex flex-wrap gap-2">
                    {d.skills.map((sk, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                        {sk.name || sk}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Danh sách tin tuyển dụng (Employer) */}
              {isEmployer && d.recent_jobs && d.recent_jobs.length > 0 && (
                <Section title="Tin tuyển dụng gần đây">
                  <div className="space-y-2">
                    {d.recent_jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                        <span className="text-sm font-semibold text-slate-700 truncate mr-4">{job.title}</span>
                        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-md font-bold ${job.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-3 justify-end items-center shrink-0">
          {d.status === 'pending' && isEmployer && (
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
            >
              <CheckCircle size={16} /> Duyệt tài khoản
            </button>
          )}

          <button
            onClick={handleToggleLock}
            className={`flex items-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
              d.status === 'locked' 
                ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200' 
                : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
            }`}
            style={{ padding: '0.4rem', cursor: 'pointer' }}
          >
            {d.status === 'locked' ? (
              <><Unlock size={16} /> Mở khóa</>
            ) : (
              <><Lock size={16} /> Khóa tài khoản</>
            )}
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-colors"
            style={{ padding: '0.4rem', cursor: 'pointer' }}
          >
            <Trash2 size={16} /> Xóa
          </button>

          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors ml-2"
            style={{ display: 'none' }}
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '0.8rem' }}>
      {title}
    </h4>
    {children}
  </div>
);

const InfoRow = ({ icon, label, value, fullWidth }) => (
  <div className={`flex items-start gap-3 ${fullWidth ? 'w-full' : ''}`}>
    <div className="text-slate-400 mt-0.5">{icon}</div>
    <div className="flex-1">
      <div className="text-xs font-medium text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  </div>
);

const StatBox = ({ icon, label, value, bg }) => (
  <div className={`${bg} rounded-xl flex items-center gap-4`} style={{ padding: '0.4rem' }}>
    <div className="shrink-0">{icon}</div>
    <div>
      <div className="text-2xl font-black text-slate-800 leading-none">{value}</div>
      <div className="text-xs font-medium text-slate-500 mt-1">{label}</div>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-10 rounded-xl bg-slate-200 animate-pulse" />
    ))}
  </div>
);

export default AccountModal;
