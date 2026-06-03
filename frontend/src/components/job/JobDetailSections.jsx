import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, UserCheck, Clock, ChevronRight, MapPin, Heart } from 'lucide-react';
import SaveButton from '../SaveButton';

function JobDetailStats({ job }) {
  const stats = [
    { icon: <Users className="w-5 h-5" />, value: job.applications_count || 128, label: 'Ứng viên đã ứng tuyển', color: '#6366f1' },
    { icon: <Eye className="w-5 h-5" />, value: 24, label: 'Nhà tuyển dụng xem', color: '#3b82f6' },
    { icon: <UserCheck className="w-5 h-5" />, value: 15, label: 'Ứng viên phù hợp', color: '#f59e0b' },
    { icon: <Clock className="w-5 h-5" />, value: '5 ngày', label: 'Còn lại để ứng tuyển', color: '#10b981' },
  ];

  return (
    <section className="px-4 py-10" style={{ background: 'linear-gradient(180deg, #09144B 0%, #0B1656 100%)' }}>
      <div className="mx-auto max-w-6xl">
        <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #823feb, #6366f1)' }} />
          Thống kê công việc
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JobDetailSimilar({ currentJobId, formatSalary, translateType }) {
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/latest');
        if (response.ok) {
          const data = await response.json();
          setSimilarJobs(data.filter(j => j.id !== currentJobId).slice(0, 4));
        }
      } catch (e) {
        console.error('Error fetching similar jobs:', e);
      }
    };
    fetchSimilar();
  }, [currentJobId]);

  if (similarJobs.length === 0) return null;

  const getTypeBadgeColor = (t) => {
    const c = {
      'full_time': 'bg-emerald-500/15 text-emerald-400',
      'part_time': 'bg-amber-500/15 text-amber-400',
      'internship': 'bg-pink-500/15 text-pink-400',
    };
    return c[t] || 'bg-brand/15 text-brand-light';
  };

  return (
    <section className="px-4 py-10" style={{ background: 'linear-gradient(180deg, #0B1656 0%, #0d1040 100%)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #823feb, #6366f1)' }} />
            Việc làm tương tự
          </h3>
          <Link to="/jobs" className="text-brand-light text-sm font-medium no-underline hover:underline flex items-center gap-1">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarJobs.map(job => (
            <Link
              key={job.id}
              to={`/job/${job.id}`}
              className="rounded-2xl p-5 no-underline transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(130,63,235,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(130,63,235,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg, rgba(130,63,235,0.3), rgba(99,102,241,0.2))', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
                </div>
                <div onClick={e => e.preventDefault()}>
                  <SaveButton jobId={job.id} size={16} variant="minimal" />
                </div>
              </div>
              <h4 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-brand-light transition-colors">{job.title}</h4>
              <p className="text-brand-light text-xs mb-3">{job.employer?.company_name}</p>
              <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-xs font-semibold">💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getTypeBadgeColor(job.type)}`}>
                  {translateType(job.type)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { JobDetailStats, JobDetailSimilar };
