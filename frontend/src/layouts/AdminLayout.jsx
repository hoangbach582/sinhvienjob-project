import React, { useState, useRef, useEffect } from "react";
import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  ListTree,
} from "lucide-react";
import NotificationBell from "../components/notifications/NotificationBell";

function AdminLayout() {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Fallback: đọc từ localStorage phòng khi context chưa load kịp
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");
  let role = userRole;
  if (!role) {
    role = localStorage.getItem("role");
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.role) role = userData.role;
    } catch {
      // ignore JSON parse errors
    }
  }

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { to: "/admin/accounts", icon: Users, label: "Tài khoản" },
    { to: "/admin/jobs", icon: Briefcase, label: "Tin tuyển dụng" },
    { to: "/admin/industries", icon: ListTree, label: "Ngành nghề" },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setShowDropdown(false);
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F6FB] font-sans">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-[240px] shrink-0 bg-white flex flex-col border-r border-slate-200/80 z-30">
        {/* Logo */}
        <div className="h-[64px] flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
              <span className="text-white font-black text-base">A</span>
            </div>
            <div>
              <div className="text-[14px] font-bold text-slate-800 leading-none">
                SinhVienJob
              </div>
              <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
                Admin Portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.08em] uppercase px-3 mb-3 mt-1">
            Quản lý chính
          </p>

          {navItems.map(({ to, icon: Icon, label }) => {
            // eslint-disable-next-line no-unused-vars
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                </div>
                {label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}

          <p className="text-[10px] font-bold text-slate-400 tracking-[0.08em] uppercase px-3 mb-3 mt-6">
            Cài đặt
          </p>

          <Link
            to="/admin/settings"
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
              isActive("/admin/settings")
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive("/admin/settings")
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
              }`}
            >
              <Settings
                size={16}
                strokeWidth={isActive("/admin/settings") ? 2.5 : 2}
              />
            </div>
            Cấu hình
          </Link>
        </nav>

        {/* Bottom user card */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
              <LogOut size={15} />
            </div>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-[64px] shrink-0 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 gap-4 z-20">
          {/* Left: Page context */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div>
              <h2 className="text-[15px] font-bold text-slate-800 leading-none">
                Hệ thống Quản trị
              </h2>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5 leading-none">
                SinhVienJob Administration
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification bell */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors">
              <NotificationBell />
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-[12px] font-black shrink-0">
                  AD
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[13px] font-semibold text-slate-700 leading-none">
                    Administrator
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Quản trị viên
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDropdown && (
                <div className="absolute top-[calc(100%+6px)] right-0 w-[220px] bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3.5 border-b border-slate-50 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                    <p className="text-[14px] font-bold text-slate-800">
                      Administrator
                    </p>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      admin@sinhvienjob.vn
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
