import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

function BenefitsSectionNew() {
  const navigate = useNavigate();

  return (
    <section className="home-benefits mx-auto">
      <div className="home-benefits-panel relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy via-navy-deep to-navy">
        <div className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]" aria-hidden="true" />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Award className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Đặc quyền tìm việc
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold text-white sm:text-4xl">
              Tại sao chọn SinhVienJob?
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/70">
              Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt đầu hành trình sự nghiệp dễ dàng.
            </p>
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="mt-6 rounded-xl border-none bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Xem chi tiết
            </button>
          </div>

          <div className="relative">
            <img
              src="/images/home/why-choose.png"
              alt="Minh họa lý do chọn SinhVienJob"
              width="560"
              height="420"
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSectionNew;
