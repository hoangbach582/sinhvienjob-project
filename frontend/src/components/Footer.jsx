import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Send, ArrowUp } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900" style={{ position: 'relative' }}>
      
      {/* Top Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-decoration-none group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple bg-clip-text text-transparent">
                SinhVienJob
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Nền tảng kết nối việc làm hàng đầu dành cho sinh viên Việt Nam. Tìm kiếm cơ hội thực tập, part-time và full-time phù hợp nhất với bạn.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: For Students */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Dành cho Sinh viên</h4>
            <ul className="space-y-3.5 list-none p-0 m-0">
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-all duration-200 text-decoration-none hover:pl-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-blue"></span>
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-slate-400 hover:text-white transition-all duration-200 text-decoration-none hover:pl-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-blue"></span>
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link to="/build-cv" className="text-slate-400 hover:text-white transition-all duration-200 text-decoration-none hover:pl-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-blue"></span>
                  Tạo CV trực tuyến
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Nhà tuyển dụng</h4>
            <ul className="space-y-3.5 list-none p-0 m-0">
              <li>
                <Link to="/employer/login" className="text-slate-400 hover:text-white transition-all duration-200 text-decoration-none hover:pl-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-purple"></span>
                  Đăng nhập tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/register?role=employer" className="text-slate-400 hover:text-white transition-all duration-200 text-decoration-none hover:pl-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-purple"></span>
                  Đăng ký tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Hỗ trợ & Liên hệ</h4>
            <ul className="space-y-3.5 list-none p-0 m-0 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                <a href="mailto:support@sinhvienjob.vn" className="text-slate-400 hover:text-white text-decoration-none transition-colors">
                  support@sinhvienjob.vn
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                <a href="tel:+84123456789" className="text-slate-400 hover:text-white text-decoration-none transition-colors">
                  (+84) 123 456 789
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-brand-blue shrink-0 mt-0.5" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-900">
              <p className="text-xs font-semibold text-slate-300 mb-3">Nền tảng bảo việc làm một nhất email của bạn.</p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input 
                  type="email" 
                  required
                  placeholder="Email của bạn..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
                <button 
                  type="submit" 
                  className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:opacity-95 transition-all shadow-md shadow-blue-500/20 active:scale-95 border-none cursor-pointer"
                  title="Đăng ký nhận tin"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 animate-pulse">
                  ✓ Đăng ký nhận thông tin thành công!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Copyright section */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            © {currentYear} <strong className="text-slate-400 font-semibold">SinhVienJob</strong>. Mọi quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4 flex-wrap text-slate-500">
            <a href="#" className="hover:text-slate-300 text-decoration-none transition-colors">Điều khoản sử dụng</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-slate-300 text-decoration-none transition-colors">Chính sách bảo mật</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-slate-300 text-decoration-none transition-colors">Quy chế hoạt động</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          zIndex: 50,
          transition: 'all 0.3s ease',
          opacity: showScrollTop ? 1 : 0,
          transform: showScrollTop ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          pointerEvents: showScrollTop ? 'auto' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)';
        }}
        onMouseLeave={e => {
          if (showScrollTop) {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)';
          }
        }}
      >
        <ArrowUp style={{ width: '22px', height: '22px' }} />
      </button>
    </footer>
  );
}

export default Footer;
