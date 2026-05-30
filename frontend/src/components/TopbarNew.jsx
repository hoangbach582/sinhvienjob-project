import React from 'react';
import { Link } from 'react-router-dom';

function TopbarNew() {
  return (
    <section className="bg-background w-full z-50 sticky top-0 border-b border-white/5" id="header">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center">
            <i className="ph-fill ph-graduation-cap text-foreground text-lg"></i>
          </div>
          <span className="text-foreground font-bold text-base font-body">
            SinhVienJob
          </span>
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-foreground text-sm font-medium font-body hover:text-primary transition-colors" href="/#job-categories">
            Tìm việc
          </a>
          <a className="text-foreground text-sm font-medium font-body hover:text-primary transition-colors" href="/#partners">
            Công ty
          </a>
          <Link className="text-foreground text-sm font-medium font-body hover:text-primary transition-colors" to="/employer/login">
            Dành cho Nhà tuyển dụng
          </Link>
        </nav>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 text-sm font-medium font-body text-foreground border border-foreground/20 rounded-[14px] hover:bg-foreground/10 transition-colors">
            Đăng nhập
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-semibold font-body text-foreground bg-grad-primary-button rounded-[14px] shadow-[0_8px_20px_rgba(143,75,255,0.35)] hover:opacity-90 transition-opacity">
            Đăng ký
          </Link>
        </div>
      </div>
      
      {/* Promo Banner */}
      <div className="flex justify-center pb-3">
        <div className="flex items-center gap-2 bg-chip-surface border border-foreground/10 rounded-full px-4 py-1.5">
          <i className="ph-fill ph-star text-yellow-400 text-xs"></i>
          <span className="text-foreground text-xs font-medium font-body">
            Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
          </span>
        </div>
      </div>
    </section>
  );
}

export default TopbarNew;
