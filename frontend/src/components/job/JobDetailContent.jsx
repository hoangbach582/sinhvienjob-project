import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Star, Building2, Users, Calendar, ChevronRight, GraduationCap, Clock, Award } from 'lucide-react';

function JobDetailContent({ job }) {
  const skills = job.required_skills || ['ReactJS', 'JavaScript', 'HTML/CSS', 'Git'];

  return (
    <section className="px-4 py-12 relative" style={{ background: 'linear-gradient(180deg, #0d1040 0%, #09144B 100%)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">

            {/* Company Info Card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-light" /> Thông tin công ty
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" style={{ background: 'linear-gradient(135deg, rgba(130,63,235,0.3), rgba(99,102,241,0.2))', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">{job.employer?.company_name || 'Đang cập nhật'}</span>
                    <BadgeCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">4.8</span>
                    <span className="text-white/40 text-xs">(120 đánh giá)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-white/60 mb-5">
                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> 5,000+ nhân viên</div>
                <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Ngân hàng / Tài chính</div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-white/50">Hạn nộp hồ sơ</span>
                  <span className="text-red-400 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : '31/05/2026'}</span>
                </div>
              </div>
              <button className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 border-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                Xem công ty <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Job Overview Card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-light" /> Tổng quan công việc
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Cấp bậc', value: 'Intern', icon: <GraduationCap className="w-4 h-4" /> },
                  { label: 'Kinh nghiệm', value: 'Không yêu cầu', icon: <Clock className="w-4 h-4" /> },
                  { label: 'Học vấn', value: 'Đại học', icon: <Award className="w-4 h-4" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/50 flex items-center gap-2">{item.icon} {item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Job Description */}
            <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #823feb, #6366f1)' }} />
                Mô tả công việc
              </h3>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description ? (
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {job.description.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#823feb' }} />
                        <span>{line.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : 'Chưa có mô tả'}
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #823feb, #6366f1)' }} />
                Yêu cầu ứng viên
              </h3>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {job.requirements ? (
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {job.requirements.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#823feb' }} />
                        <span>{line.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : 'Chưa có yêu cầu'}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981, #059669)' }} />
                  Quyền lợi
                </h3>
                <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {job.benefits.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400" />
                        <span>{line.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #f97316)' }} />
                Kỹ năng
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(skills) ? skills : skills.split(',')).map((skill, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl text-sm font-medium text-white/80" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {typeof skill === 'string' ? skill.trim() : skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobDetailContent;
