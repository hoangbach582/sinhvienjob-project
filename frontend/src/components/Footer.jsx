import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Send } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      
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
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
              <p className="text-xs font-semibold text-slate-300 mb-3">Nhận thông báo việc làm mới nhất</p>
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
    </footer>
  );
}

export default Footer;
