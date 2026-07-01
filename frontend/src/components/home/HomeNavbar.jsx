import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Briefcase,
  Heart,
  LayoutDashboard,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

function HomeNavbar() {
  const { isLoggedIn, userName, userRole, userAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Tìm việc", to: "/jobs" },
    { label: "Công ty", to: "/companies" },
    ...(isLoggedIn && userRole === "student"
      ? [{ label: "Build CV", to: "/build-cv" }]
      : [{ label: "Dành cho Nhà tuyển dụng", to: "/employer/login" }]),
  ];
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative text-sm font-medium transition-colors no-underline py-1 smooth-underline ${isActive ? "text-purple-400 font-semibold" : "text-white/80 hover:text-white"}`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors focus:outline-none border-none bg-transparent cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold flex items-center justify-center border border-white/30 overflow-hidden shadow-inner">
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
                    className={`w-4 h-4 text-white transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
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
                      className="absolute right-0 mt-3 w-[280px] bg-white rounded-[20px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-200"
                      style={{ padding: "0.6rem" }}
                    >
                      <motion.div 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="p-5 border-b border-slate-100/80 bg-linear-to-b from-slate-50/80 to-white"
                      >
                        <p className="text-[15px] font-bold text-slate-900 truncate m-0">
                          {userName || "Người dùng"}
                        </p>
                        <p className="text-[13px] font-medium text-slate-500 mt-1 mb-0">
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
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                          >
                            <User className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                            Hồ sơ cá nhân
                          </Link>
                        </motion.div>
                        {userRole === "student" && (
                          <>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/dashboard"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <LayoutDashboard className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                                Tổng quan
                              </Link>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/applied-jobs"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <Briefcase className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                                Việc đã ứng tuyển
                              </Link>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                              <Link
                                to="/saved-jobs"
                                onClick={() => setShowDropdown(false)}
                                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                              >
                                <Heart className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                                Việc làm đã lưu
                              </Link>
                            </motion.div>
                          </>
                        )}
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                          <Link
                            to="/settings"
                            onClick={() => setShowDropdown(false)}
                            className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-blue-50/50 hover:text-brand-blue transition-all duration-200 text-[14px] font-semibold no-underline hover-lift"
                          >
                            <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-brand-blue transition-colors" />
                            Cài đặt tài khoản
                          </Link>
                        </motion.div>
                      </div>

                      <motion.div 
                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                        className="p-2.5 border-t border-slate-100/80 bg-slate-50/30"
                      >
                        <button
                          onClick={handleLogout}
                          className="group flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 text-[14px] font-semibold border-none bg-transparent cursor-pointer hover-lift"
                        >
                          <LogOut className="w-[18px] h-[18px] text-red-500 group-hover:text-red-600 transition-colors" />
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
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex min-h-[46px] min-w-[132px] items-center justify-center rounded-2xl border border-white/25 bg-transparent px-8 text-[15px] font-medium text-white transition-colors hover:bg-white/10 cursor-pointer hover-lift"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex min-h-[46px] min-w-[132px] items-center justify-center rounded-2xl border-none bg-white px-9 text-[15px] font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 cursor-pointer hover-lift ripple-button"
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
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
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
                  onClick={() => navigate("/login")}
                  className="inline-flex min-h-[46px] w-full items-center justify-center rounded-2xl border border-white/25 bg-transparent text-[15px] font-medium text-white hover:bg-white/10 cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
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
