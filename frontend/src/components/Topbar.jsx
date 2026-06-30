import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./notifications/NotificationBell";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Briefcase,
  GraduationCap,
  FileText,
  Heart,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

function Topbar({ transparentTop = false }) {
  const { isLoggedIn, userName, userRole, userAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // eslint-disable-line no-unused-vars
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isHomeDesign = transparentTop && location.pathname === "/";
  const isTransparent = isHomeDesign && !scrolled;

  const headerPositionClass =
    isHomeDesign && !scrolled
      ? "absolute inset-x-0 top-0"
      : "fixed top-0 left-0 w-full";

  const headerStyleClass = isTransparent
    ? "py-5 bg-transparent border-transparent"
    : "py-3 bg-[#0B0F19]/95 backdrop-blur-md shadow-lg border-b border-white/10";

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    if (!name) return "US";
    const words = name.trim().split(" ");
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
      <nav
        style={{
          marginRight: "67px",
          marginLeft: "67px",
          padding: "22px 0 14px",
        }}
        className="mx-auto flex max-w-7xl items-center justify-between px-[67px]"
      >
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ${
              isHomeDesign
                ? "bg-linear-to-br from-brand to-brand-light shadow-brand/30"
                : "bg-linear-to-tr from-brand-blue to-brand-purple shadow-md shadow-blue-500/20"
            }`}
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold text-white">SinhVienJob</span>
        </Link>

        {/* MIDDLE: Desktop Navigation Menu */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            to="/jobs"
            className={`relative py-1 smooth-underline text-sm font-medium transition-colors duration-200 text-decoration-none ${
              isLinkActive("/jobs")
                ? "text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Tìm việc
          </Link>
          <Link
            to="/companies"
            className={`relative py-1 smooth-underline text-sm font-medium transition-colors duration-200 text-decoration-none ${
              isLinkActive("/companies")
                ? "text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Công ty
          </Link>

          {isLoggedIn && userRole === "student" ? (
            <Link
              to="/build-cv"
              className={`relative py-1 smooth-underline text-sm font-medium transition-colors duration-200 text-decoration-none ${
                isLinkActive("/build-cv")
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Build CV
            </Link>
          ) : (
            <Link
              to="/employer/login"
              className="relative py-1 smooth-underline text-sm font-medium transition-colors duration-200 text-decoration-none text-white/80 hover:text-white"
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
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(userName)
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.95 },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                            staggerChildren: 0.05
                          }
                        }
                      }}
                      className="absolute right-0 mt-3 w-[280px] bg-[#0f172a]/90 backdrop-blur-xl rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-200"
                    >
                      <motion.div 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="p-5 border-b border-white/10 bg-linear-to-b from-white/5 to-transparent"
                      >
                        <p className="text-[15px] font-bold text-white truncate m-0">
                          {userName || "Người dùng"}
                        </p>
                        <p className="text-[13px] font-medium text-slate-400 mt-1 mb-0">
                          {userRole === "student"
                            ? "Hồ sơ Sinh viên"
                            : "Nhà tuyển dụng"}
                        </p>
                      </motion.div>

                      <div className="p-2.5 space-y-0.5">
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                          <Link
                            to={
                              userRole === "employer"
                                ? "/employer/dashboard"
                                : "/profile"
                            }
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                          >
                            <User className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                            Hồ sơ cá nhân
                          </Link>
                        </motion.div>
                        {userRole === "student" && (
                          <>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/dashboard"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <LayoutDashboard className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                                Tổng quan
                              </Link>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/applied-jobs"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <Briefcase className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                                Việc đã ứng tuyển
                              </Link>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/saved-jobs"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <Heart className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                                Việc làm đã lưu
                              </Link>
                            </motion.div>
                          </>
                        )}
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                          <Link
                            to="/settings"
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                          >
                            <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                            Cài đặt tài khoản
                          </Link>
                        </motion.div>
                      </div>

                      <motion.div 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="p-2.5 border-t border-white/10 bg-black/20"
                      >
                        <button
                          onClick={handleLogout}
                          className="group flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-[14px] font-semibold border-none cursor-pointer hover-lift"
                        >
                          <LogOut className="w-[18px] h-[18px] text-red-400/80 group-hover:text-red-400 transition-colors" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-5 py-2 text-sm font-medium transition-colors text-decoration-none border border-white/20 text-white hover:bg-white/10 hover-lift"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-colors text-decoration-none bg-white text-brand hover:bg-white/90 hover-lift ripple-button"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden border-none bg-transparent cursor-pointer text-white"
          aria-label="Mở menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
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
                {isLoggedIn && userRole === "student" ? (
                  <Link
                    to="/build-cv"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-blue text-decoration-none transition-colors"
                  >
                    Build CV
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
