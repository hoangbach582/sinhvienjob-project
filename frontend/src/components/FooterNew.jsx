import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from 'lucide-react';

const socialIcons = [
  {
    label: 'Facebook',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
];

function FooterNew() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer id="nha-tuyen-dung" className="bg-navy-deep text-white font-body">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light">
                  <GraduationCap className="h-5 w-5 text-white" />
                </span>
                <span className="text-lg font-bold text-white">SinhVienJob</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Nền tảng kết nối việc làm hàng đầu dành cho sinh viên Việt Nam. Tìm kiếm cơ hội thực tập, part-time và full-time phù hợp nhất với bạn.
              </p>
              <div className="mt-5 flex gap-3">
                {socialIcons.map(({ label, icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-brand hover:text-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Dành cho sinh viên */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Dành cho sinh viên
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/jobs" className="text-sm text-white/60 transition-colors hover:text-white text-decoration-none">
                    Tìm việc làm
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-sm text-white/60 transition-colors hover:text-white text-decoration-none">
                    Danh sách công ty
                  </Link>
                </li>
                <li>
                  <Link to="/build-cv" className="text-sm text-white/60 transition-colors hover:text-white text-decoration-none">
                    Tạo CV trực tuyến
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Nhà tuyển dụng */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Nhà tuyển dụng
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/employer/login" className="text-sm text-white/60 transition-colors hover:text-white text-decoration-none">
                    Đăng nhập tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="/employer/register" className="text-sm text-white/60 transition-colors hover:text-white text-decoration-none">
                    Đăng ký tuyển dụng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Hỗ trợ & Liên hệ */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Hỗ trợ & Liên hệ
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  support@sinhvienjob.vn
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  (+84) 123 456 789
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Hà Nội, Việt Nam
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
            <p>© 2024 SinhVienJob. Mọi quyền được bảo lưu.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" className="transition-colors hover:text-white">Điều khoản sử dụng</a>
              <a href="#" className="transition-colors hover:text-white">Chính sách bảo mật</a>
              <a href="#" className="transition-colors hover:text-white">Quy chế hoạt động</a>
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        aria-label="Lên đầu trang"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 border-none cursor-pointer"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}

export default FooterNew;
