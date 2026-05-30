import React from 'react';
import { Sparkles, MapPin, ArrowRight, Briefcase } from 'lucide-react';
import SaveButton from '../SaveButton';

function JobCard({ job, navigate, formatSalary, translateType }) {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'part_time':
        return 'bg-emerald-100 text-emerald-700';
      case 'internship':
        return 'bg-amber-100 text-amber-700';
      case 'full_time':
      default:
        return 'bg-violet-100 text-violet-700';
    }
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'CT';
    const cleanName = name.trim();
    if (cleanName.length >= 2) {
      return cleanName.substring(0, 2).toUpperCase();
    }
    return cleanName.toUpperCase();
  };

  return (
    <article
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 cursor-pointer"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand font-body">
          {getCompanyInitials(job.employer?.company_name)}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <SaveButton jobId={job.id} size={20} variant="minimal" />
        </div>
      </div>

      <h3 className="line-clamp-2 min-h-[2.75rem] font-bold text-foreground font-body">
        {job.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground font-body">
        {job.employer?.company_name || 'Đang cập nhật'}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-muted-foreground font-body">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {job.location}
        </span>
        <span className="text-sm font-bold text-warning font-body">
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getBadgeClass(job.type)} font-body`}>
          {translateType(job.type)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/job/${job.id}`);
          }}
          className="flex items-center gap-1 text-sm font-semibold text-brand border-none bg-transparent cursor-pointer font-body"
        >
          Chi tiết
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function JobSkeleton() {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="mb-4 flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-slate-200"></div>
        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-3 bg-slate-200 rounded w-16"></div>
        <div className="h-3 bg-slate-200 rounded w-12"></div>
      </div>
      <div className="mt-4 flex justify-between items-center border-t border-border pt-4">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
    </div>
  );
}

function LatestJobsSectionNew({ loading, filteredJobs, activeTab, setActiveTab, navigate, formatSalary, translateType }) {
  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'part_time', label: 'Bán thời gian' },
    { key: 'internship', label: 'Thực tập sinh' },
    { key: 'full_time', label: 'Toàn thời gian' }
  ];

  return (
    <section id="tim-viec" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand font-body">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Khám phá
        </span>
        <h2 className="mt-4 text-balance text-3xl font-extrabold text-foreground sm:text-4xl font-body">
          Tìm việc theo danh mục ngành nghề
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground font-body">
          Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-end">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer font-body ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/30 border border-transparent'
                  : 'border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-brand'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => <JobSkeleton key={n} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
          <h3 className="font-bold text-lg text-foreground mb-2 font-body">Không tìm thấy việc làm</h3>
          <p className="text-muted-foreground text-sm font-body">Hiện tại chưa có công việc mới nào thuộc hình thức này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.slice(0, 6).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              navigate={navigate}
              formatSalary={formatSalary}
              translateType={translateType}
            />
          ))}
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer border-none font-body"
        >
          Khám phá tất cả công việc
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default LatestJobsSectionNew;
