import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './notifications/NotificationBell';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, Settings, Briefcase, GraduationCap, FileText, Heart, ShieldAlert } from 'lucide-react';

function Topbar() {
  const { isLoggedIn, userName, userRole, userAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // eslint-disable-line no-unused-vars

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

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
      className={`sticky top-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/60' 
          : 'py-4 bg-white/70 backdrop-blur-md border-b border-slate-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center gap-2 group text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                SinhVienJob
              </span>
            </Link>
          </div>

          {/* MIDDLE: Desktop Navigation Menu */}
          <nav className="hidden md:flex flex-2 justify-center items-center gap-8">
            <Link 
              to="/jobs" 
              className={`text-sm font-semibold transition-colors duration-200 text-decoration-none ${
                isLinkActive('/jobs') 
                  ? 'text-brand-blue' 
                  : 'text-slate-600 hover:text-brand-blue'
              }`}
            >
              Tìm việc
            </Link>
            <Link 
              to="/companies" 
              className={`text-sm font-semibold transition-colors duration-200 text-decoration-none ${
                isLinkActive('/companies') 
                  ? 'text-brand-blue' 
                  : 'text-slate-600 hover:text-brand-blue'
              }`}
            >
              Công ty
            </Link>
            
            {isLoggedIn && userRole === 'student' ? (
              <Link 
                to="/build-cv" 
                className={`text-sm font-bold transition-all duration-200 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-decoration-none flex items-center gap-1.5`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Tạo CV Online
              </Link>
            ) : (
              <Link 
                to="/employer/login" 
                className={`text-sm font-semibold transition-colors duration-200 text-decoration-none text-emerald-600 hover:text-emerald-700 flex items-center gap-1`}
              >
                <Briefcase className="w-4 h-4" /> Dành cho Nhà tuyển dụng
              </Link>
            )}
          </nav>

          {/* RIGHT: Login/Register buttons or User dropdown */}
          <div className="flex-1 flex justify-end items-center gap-4">
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
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[200]"
                      >
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                          <p className="font-semibold text-slate-900 truncate">{userName || 'Người dùng'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {userRole === 'student' ? 'Hồ sơ Sinh viên' : 'Nhà tuyển dụng'}
                          </p>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link 
                            to={userRole === 'employer' ? '/employer/dashboard' : '/profile'} 
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors text-sm text-decoration-none font-medium"
                          >
                            <User className="w-4.5 h-4.5 text-slate-400" />
                            Hồ sơ cá nhân
                          </Link>
                          {userRole === 'student' && (
                            <>
                              <Link 
                                to="/applied-jobs" 
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors text-sm text-decoration-none font-medium"
                              >
                                <Briefcase className="w-4.5 h-4.5 text-slate-400" />
                                Việc đã ứng tuyển
                              </Link>
                              <Link 
                                to="/saved-jobs" 
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors text-sm text-decoration-none font-medium"
                              >
                                <Heart className="w-4.5 h-4.5 text-slate-400" />
                                Việc làm đã lưu
                              </Link>
                            </>
                          )}
                          <Link 
                            to="/settings" 
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-blue transition-colors text-sm text-decoration-none font-medium"
                          >
                            <Settings className="w-4.5 h-4.5 text-slate-400" />
                            Cài đặt tài khoản
                          </Link>
                        </div>

                        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold border-none bg-transparent cursor-pointer"
                          >
                            <LogOut className="w-4.5 h-4.5" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-bold text-brand-blue hover:text-brand-indigo transition-colors text-decoration-none"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-indigo hover:opacity-90 shadow-md shadow-blue-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 text-decoration-none"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors border-none bg-transparent cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 overflow-hidden"
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
                    className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-indigo text-decoration-none"
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