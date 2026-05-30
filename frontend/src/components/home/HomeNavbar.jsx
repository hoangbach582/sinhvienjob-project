import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function HomeNavbar() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        scrolled
          ? 'fixed inset-x-0 top-0 bg-navy-deep/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'absolute inset-x-0 top-0 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/30">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="text-base font-bold text-white">SinhVienJob</span>
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link to="/jobs" className="text-sm font-medium text-white/80 transition-colors hover:text-white no-underline">
            Tìm việc
          </Link>
          <Link to="/companies" className="text-sm font-medium text-white/80 transition-colors hover:text-white no-underline">
            Công ty
          </Link>
          <Link to="/employer/login" className="text-sm font-medium text-white/80 transition-colors hover:text-white no-underline">
            Dành cho Nhà tuyển dụng
          </Link>
        </div>

        {/* Right actions — desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="rounded-xl border border-white/25 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 cursor-pointer bg-transparent"
            >
              Tài khoản
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-white/25 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 no-underline"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-brand transition-all hover:bg-white/90 hover:shadow-lg no-underline"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white lg:hidden border-none bg-transparent cursor-pointer"
          aria-label="Mở menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-deep/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white no-underline">
              Tìm việc
            </Link>
            <Link to="/companies" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white no-underline">
              Công ty
            </Link>
            <Link to="/employer/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white no-underline">
              Dành cho Nhà tuyển dụng
            </Link>
            {!isLoggedIn && (
              <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-white/25 py-2.5 text-center text-sm font-medium text-white no-underline">
                  Đăng nhập
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-brand no-underline">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
