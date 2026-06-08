import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './notifications/NotificationBell';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, Settings, Briefcase, GraduationCap, FileText, Heart, ShieldAlert } from 'lucide-react';

function Topbar({ transparentTop = false }) {
  const { isLoggedIn, userName, userRole, userAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // eslint-disable-line no-unused-vars
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isHomeDesign = transparentTop && location.pathname === '/';
  const isTransparent = isHomeDesign && !scrolled;

  const headerPositionClass = isHomeDesign && !scrolled
    ? 'absolute inset-x-0 top-0'
    : 'fixed top-0 left-0 w-full';

  const headerStyleClass = isTransparent
    ? 'py-5 bg-transparent border-transparent'
    : isHomeDesign && scrolled
      ? 'py-3 bg-navy-deep/95 backdrop-blur-md shadow-lg border-b border-white/10'
      : scrolled
        ? 'py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
        : 'py-4 bg-white/80 backdrop-blur-md border-b border-slate-100';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  // Closed directly via onClick handlers to avoid React cascading render warnings

  const getInitials = (name) => {
    if (!name) return 'US';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`${headerPositionClass} z-50 transition-all duration-300 ${headerStyleClass}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ${
              isHomeDesign
                ? 'bg-linear-to-br from-brand to-brand-light shadow-brand/30'
                : 'bg-linear-to-tr from-brand-blue to-brand-purple shadow-md shadow-blue-500/20'
            }`}>
              <GraduationCap className="h-5 w-5 text-white" />
            </span>
            <span className={`text-lg font-bold ${
              isTransparent || (isHomeDesign && scrolled)
                ? 'text-white'
                : 'bg-linear-to-r from-brand-blue via-brand-indigo to-brand-purple bg-clip-text text-transparent'
            }`}>
              SinhVienJob
            </span>
          </Link>

          {/* MIDDLE: Desktop Navigation Menu */}
          <div className="hidden items-center gap-8 lg:flex">
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors duration-200 text-decoration-none ${
                isLinkActive('/jobs') 
                  ? (isTransparent || (isHomeDesign && scrolled) ? 'text-white' : 'text-brand-blue')
                  : (isTransparent || (isHomeDesign && scrolled) ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-brand-blue')
              }`}
            >
              Tìm việc
            </Link>
            <Link 
              to="/companies" 
              className={`text-sm font-medium transition-colors duration-200 text-decoration-none ${
                isLinkActive('/companies') 
                  ? (isTransparent || (isHomeDesign && scrolled) ? 'text-white' : 'text-brand-blue')
                  : (isTransparent || (isHomeDesign && scrolled) ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-brand-blue')
              }`}
            >
              Công ty
            </Link>
            
            {isLoggedIn && userRole === 'student' ? (
              <Link 
                to="/build-cv" 
                className={`text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg text-decoration-none flex items-center gap-1.5 ${
                  isTransparent || (isHomeDesign && scrolled)
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                Tạo CV Online
              </Link>
            ) : (
              <Link 
                to="/employer/login" 
                className={`text-sm font-medium transition-colors duration-200 text-decoration-none ${
                  isTransparent || (isHomeDesign && scrolled)
                    ? 'text-white/80 hover:text-white'
                    : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                Dành cho Nhà tuyển dụng
              </Link>
            )}
          </div>

          {/* RIGHT: Login/Register buttons or User dropdown */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center border border-blue-200 overflow-hidden shadow-inner">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(userName)
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-[280px] bg-white rounded-[20px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-200"
                      >
                        <div className="p-5 border-b border-slate-100/80 bg-linear-to-b from-slate-50/80 to-white">
                          <p className="text-[15px] font-bold text-slate-900 truncate m-0">{userName || 'Người dùng'}</p>
                          <p className="text-[13px] font-medium text-slate-500 mt-1 mb-0">
                            {userRole === 'student' ? 'Hồ sơ Sinh viên' : 'Nhà tuyển dụng'}
                          </p>
                        </div>

                        <div className="p-2.5 space-y-0.5">
                          <Link 
                            to={userRole === 'employer' ? '/employer/dashboard' : '/profile'} 
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline"
                          >
                            <User className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                            Hồ sơ cá nhân
                          </Link>
                          {userRole === 'student' && (
                            <>
                              <Link 
                                to="/applied-jobs" 
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline"
                              >
                                <Briefcase className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                                Việc đã ứng tuyển
                              </Link>
                              <Link 
                                to="/saved-jobs" 
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline"
                              >
                                <Heart className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                                Việc làm đã lưu
                              </Link>
                            </>
                          )}
                          <Link 
                            to="/settings" 
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline"
                          >
                            <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                            Cài đặt tài khoản
                          </Link>
                        </div>

                        <div className="p-2.5 border-t border-slate-100/80 bg-slate-50/30">
                          <button
                            onClick={handleLogout}
                            className="group flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 text-[14px] font-semibold border-none bg-transparent cursor-pointer"
                          >
                            <LogOut className="w-[18px] h-[18px] text-red-500 group-hover:text-red-600 transition-colors" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors text-decoration-none ${
                    isTransparent
                      ? 'border border-white/20 text-white hover:bg-white/10'
                      : isHomeDesign && scrolled
                        ? 'border border-white/20 text-white hover:bg-white/10'
                        : 'text-brand-blue hover:text-brand-indigo'
                  }`}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors text-decoration-none ${
                    isTransparent
                      ? 'bg-white text-brand hover:bg-white/90'
                      : isHomeDesign && scrolled
                        ? 'bg-white text-brand hover:bg-white/90'
                        : 'text-white bg-linear-to-r from-brand-blue to-brand-indigo shadow-md hover:opacity-90'
                  }`}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden border-none bg-transparent cursor-pointer ${
              isTransparent || (isHomeDesign && scrolled) ? 'text-white' : 'text-slate-600'
            }`}
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <div className="space-y-1.5">
                <Link 
                  to="/jobs" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-blue text-decoration-none transition-colors"
                >
                  Tìm việc
                </Link>
                <Link 
                  to="/companies" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-blue text-decoration-none transition-colors"
                >
                  Công ty
                </Link>
                {isLoggedIn && userRole === 'student' ? (
                  <Link 
                    to="/build-cv" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-decoration-none transition-colors"
                  >
                    ✨ Tạo CV Online
                  </Link>
                ) : (
                  <Link 
                    to="/employer/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-emerald-600 hover:bg-emerald-50 text-decoration-none transition-colors"
                  >
                    Dành cho Nhà tuyển dụng
                  </Link>
                )}
              </div>

              {!isLoggedIn && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-brand-blue border border-slate-200 hover:bg-slate-50 text-decoration-none"
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-brand-blue to-brand-indigo text-decoration-none"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Topbar;