import React from 'react';
import { useNavigate } from 'react-router-dom';

function CompaniesSectionNew() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/companies');
  };

  return (
    <section id="cong-ty" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand font-body">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase h-3.5 w-3.5" aria-hidden="true">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
              </svg>
              Đối tác tuyển dụng
            </span>
            <h2 className="mt-4 text-balance text-2xl font-extrabold text-foreground sm:text-3xl font-body">
              Công ty đang tuyển dụng mạnh
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground font-body">
              Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Partner logos */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
            <span
              onClick={handleRedirect}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm text-red-600 cursor-pointer select-none font-body hover:scale-105 transition-transform"
            >
              Tech
            </span>
            <span
              onClick={handleRedirect}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm text-orange-500 cursor-pointer select-none font-body hover:scale-105 transition-transform"
            >
              FPT
            </span>
            <span
              onClick={handleRedirect}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm text-blue-600 cursor-pointer select-none font-body hover:scale-105 transition-transform"
            >
              VNG
            </span>
            <span
              onClick={handleRedirect}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm text-red-500 cursor-pointer select-none font-body hover:scale-105 transition-transform"
            >
              viet
            </span>
            <span
              onClick={handleRedirect}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-sm font-bold text-white shadow-md shadow-brand/30 cursor-pointer select-none font-body hover:scale-105 transition-transform"
            >
              +100
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRedirect}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer border-none font-body"
          >
            Khám phá tất cả các doanh nghiệp đối tác
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-4 w-4" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default CompaniesSectionNew;
