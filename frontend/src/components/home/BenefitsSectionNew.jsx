import React from 'react';
import { useNavigate } from 'react-router-dom';

function BenefitsSectionNew() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy via-navy-deep to-navy p-8 sm:p-12">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]"></div>

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 font-body">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-3.5 w-3.5 text-warning" aria-hidden="true">
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                <circle cx="12" cy="8" r="6"></circle>
              </svg>
              Đặc quyền tìm việc
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold text-white sm:text-4xl font-body">
              Tại sao chọn SinhVienJob?
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/70 font-body">
              Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt đầu hành trình sự nghiệp dễ dàng.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90 border-none cursor-pointer font-body"
            >
              Xem chi tiết
            </button>
          </div>

          {/* Right image */}
          <div className="relative">
            <img
              alt="Minh họa lý do chọn SinhVienJob"
              loading="lazy"
              width="560"
              height="420"
              decoding="async"
              className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
              style={{ color: 'transparent' }}
              src="/images/home/why-choose.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSectionNew;
