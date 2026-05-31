import React from 'react';
import { ArrowRight, Briefcase, Heart, MapPin, Sparkles } from 'lucide-react';
import SaveButton from '../SaveButton';

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'part_time', label: 'Bán thời gian' },
  { key: 'internship', label: 'Thực tập sinh' },
  { key: 'full_time', label: 'Toàn thời gian' },
];

const typeStyles = {
  full_time: 'bg-violet-100 text-violet-700',
  part_time: 'bg-emerald-100 text-emerald-700',
  internship: 'bg-amber-100 text-amber-700',
};

function JobCard({ job, navigate, formatSalary, translateType }) {
  const companyName = job.employer?.company_name || 'Đang cập nhật';

  return (
    <article
      className="home-job-card group flex cursor-pointer flex-col rounded-2xl border border-border bg-card transition-transform hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="home-job-logo flex items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">
          {companyName.slice(0, 2).toUpperCase()}
        </span>
        <div onClick={(event) => event.stopPropagation()}>
          <SaveButton jobId={job.id} size={20} variant="minimal" />
        </div>
      </div>

      <h3 className="line-clamp-2 min-h-[2.75rem] font-bold text-foreground">
        {job.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{companyName}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{job.location}</span>
        </span>
        <span className="shrink-0 text-sm font-bold text-warning">
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${typeStyles[job.type] || typeStyles.full_time}`}>
          {translateType(job.type)}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/job/${job.id}`);
          }}
          className="flex items-center gap-1 border-none bg-transparent text-sm font-semibold text-brand cursor-pointer"
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
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <Heart className="h-5 w-5 text-slate-200" aria-hidden="true" />
      </div>
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 flex justify-between">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-3 w-12 rounded bg-slate-200" />
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4">
        <div className="h-6 w-24 rounded bg-slate-200" />
        <div className="h-4 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
}

function LatestJobsSectionNew({ loading, filteredJobs, activeTab, setActiveTab, navigate, formatSalary, translateType }) {
  return (
    <section id="tim-viec" className="home-jobs mx-auto">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Khám phá
        </span>
        <h2 className="mt-4 text-balance text-3xl font-extrabold text-foreground sm:text-4xl">
          Tìm việc theo danh mục ngành nghề
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.
        </p>
      </div>

      <div className="home-job-tabs mb-8 flex flex-wrap justify-center gap-2 lg:justify-end">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-brand text-white shadow-md shadow-brand/30 border border-transparent'
                : 'border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-brand'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="home-job-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => <JobSkeleton key={item} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h3 className="mb-2 text-lg font-bold text-foreground">Không tìm thấy việc làm</h3>
          <p className="text-sm text-muted-foreground">Hiện tại chưa có công việc mới nào thuộc hình thức này.</p>
        </div>
      ) : (
        <div className="home-job-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="home-jobs-cta mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 rounded-xl border-none bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Khám phá tất cả công việc
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default LatestJobsSectionNew;
