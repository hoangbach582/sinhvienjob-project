import React, { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, ChevronRight, Clock } from 'lucide-react';
import SaveButton from '../SaveButton';

function JobCard({ job, navigate, formatSalary, translateType, getTypeBadgeStyles, index }) {
  const cardRef = useRef(null);

  // Handle mouse tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  };

  // Type badge colors
  const getTypeColor = (type) => {
    switch (type) {
      case 'part_time': return { text: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'internship': return { text: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' };
      default: return { text: '#2563eb', bg: '#eff6ff', border: '#93c5fd' };
    }
  };

  const typeColor = getTypeColor(job.type);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="job-card-white group"
      onClick={() => navigate(`/job/${job.id}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center',
        position: 'relative',
      }}>
      {/* Card content top */}
      <div style={{ padding: '24px 24px 0' }}>
        {/* Logo + Save button row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: job.employer?.logo_url ? '#ffffff' : '#f8fafc',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              color: '#475569',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
            {job.employer?.logo_url ? (
              <img
                src={
                  job.employer.logo_url.startsWith("http")
                    ? job.employer.logo_url
                    : `http://127.0.0.1:8000${job.employer.logo_url}`
                }
                alt={job.employer?.company_name || 'Logo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer?.company_name || 'CT')}&background=random&color=fff&size=150`;
                }}
              />
            ) : (
              job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SaveButton jobId={job.id} size={18} />
          </div>
        </div>

        {/* Job title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.45,
          marginBottom: '6px',
          minHeight: '46px',
          transition: 'color 0.2s',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
          className="group-hover:text-indigo-600">
          {job.title}
        </h3>

        {/* Company name */}
        <p style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#94a3b8',
          marginBottom: '0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {job.employer?.company_name || 'Đang cập nhật'}
        </p>
      </div>

      {/* Card bottom section */}
      <div style={{
        padding: '16px 24px 20px',
        borderTop: '1px solid #f1f5f9',
        marginTop: '16px',
      }}>
        {/* Location + Salary */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#64748b',
          marginBottom: '14px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <MapPin style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
            {job.location}
          </span>
          <span style={{
            color: '#6366f1',
            fontWeight: 800,
            fontSize: '14px',
          }}>
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>

        {/* Type badge + Detail link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: '8px',
            background: typeColor.bg,
            color: typeColor.text,
            border: `1px solid ${typeColor.border}`,
            letterSpacing: '0.01em',
          }}>
            {translateType(job.type)}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              transition: 'gap 0.2s ease',
            }}
            className="group-hover:text-purple-600">
            Chi tiết <ChevronRight style={{ width: '15px', height: '15px' }} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function JobSkeleton() {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100" />
        <div className="w-6 h-6 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2 py-2">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="h-px bg-slate-100 w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-100 rounded-lg w-20" />
        <div className="h-5 bg-slate-100 rounded w-16" />
      </div>
    </div>
  );
}

function LatestJobsSection({ loading, filteredJobs, activeTab, setActiveTab, navigate, formatSalary, translateType, getTypeBadgeStyles }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'part_time', label: 'Bán thời gian' },
    { key: 'internship', label: 'Thực tập sinh' },
    { key: 'full_time', label: 'Toàn thời gian' },
  ];

  return (
    <section ref={sectionRef} style={{
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      padding: '80px 0'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#ede9fe',
              fontSize: '12px',
              fontWeight: 700,
              color: '#7c3aed',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
            ✦ Khám Phá
          </motion.span>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>Tìm việc theo danh mục ngành nghề</h2>
          <p style={{
            fontSize: '15px',
            color: '#64748b',
            maxWidth: '500px'
          }}>Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            gap: '4px',
            background: '#f1f5f9',
            padding: '5px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
          }}>
            {tabs.map(tab => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  background: activeTab === tab.key ? '#ffffff' : 'transparent',
                  color: activeTab === tab.key ? '#1e293b' : '#64748b',
                  boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' : 'none',
                }}>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {[1,2,3,4,5,6].map(n => <JobSkeleton key={n} />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy việc làm</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Hiện tại chưa có công việc mới nào thuộc hình thức này.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredJobs.slice(0, 6).map((job, i) => (
                <JobCard key={job.id} job={job} index={i} navigate={navigate} formatSalary={formatSalary} translateType={translateType} getTypeBadgeStyles={getTypeBadgeStyles} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(99,102,241,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/jobs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '14px',
              background: 'transparent',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '14px',
              border: '2px solid #c7d2fe',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#4f46e5';
              e.currentTarget.style.borderColor = '#c7d2fe';
            }}>
            Khám phá tất cả công việc
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default LatestJobsSection;
