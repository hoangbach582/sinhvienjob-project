import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Tìm việc', to: '/jobs' },
  { label: 'Công ty', to: '/companies' },
  { label: 'Dành cho Nhà tuyển dụng', to: '/employer/login' },
];

function HomeNavbar() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
            <GraduationCap className="h-5 w-5 text-brand" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold text-white">SinhVienJob</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-white/25 bg-transparent px-8 text-[15px] font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
            >
              Tài khoản
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex min-h-[46px] min-w-[132px] items-center justify-center rounded-2xl border border-white/25 bg-transparent px-8 text-[15px] font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="inline-flex min-h-[46px] min-w-[132px] items-center justify-center rounded-2xl border-none bg-white px-9 text-[15px] font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 cursor-pointer"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="border-none bg-transparent text-white lg:hidden cursor-pointer"
          onClick={() => setOpen((value) => !value)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-navy-deep/95 p-4 backdrop-blur lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white no-underline"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex min-h-[46px] w-full items-center justify-center rounded-2xl border border-white/25 bg-transparent text-[15px] font-medium text-white hover:bg-white/10 cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="inline-flex min-h-[46px] w-full items-center justify-center rounded-2xl border-none bg-white text-[15px] font-semibold text-brand hover:bg-white/90 cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
