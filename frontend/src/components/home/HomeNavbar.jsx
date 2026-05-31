import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Tìm việc', href: '#tim-viec' },
  { label: 'Công ty', href: '#cong-ty' },
  { label: 'Dành cho Nhà tuyển dụng', href: '#nha-tuyen-dung' },
];

function HomeNavbar() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/30">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold text-white">SinhVienJob</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="rounded-lg border border-white/20 bg-transparent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
            >
              Tài khoản
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-lg border border-white/20 bg-transparent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-lg border-none bg-white px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-white/90 cursor-pointer"
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
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white no-underline"
              >
                {link.label}
              </a>
            ))}
            {!isLoggedIn && (
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="rounded-lg border-none bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-white/90 cursor-pointer"
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
