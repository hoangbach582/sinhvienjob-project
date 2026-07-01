import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  Users,
  Building,
  ArrowRight,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch((${API_BASE}) + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        let userWithInfo = { ...data.user };
        if (data.user.role === "student") {
          try {
            const profileRes = await fetch(
              (${API_BASE}) + "/profile",
              {
                headers: {
                  Authorization: `Bearer ${data.access_token}`,
                  Accept: "application/json",
                },
              },
            );
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              userWithInfo.name = profileData.full_name || data.user.email;
              userWithInfo.avatar = profileData.avatar || "";
            }
          } catch (e) {
            console.error("Không lấy được profile phụ:", e);
            userWithInfo.name = data.user.email;
          }
        } else {
          userWithInfo.name = data.user.email;
        }

        login(data.access_token, userWithInfo);

        if (data.user.role === "employer") {
          navigate("/employer/dashboard");
        } else if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else if (response.status === 403 && data.requires_verification) {
        navigate("/verify-email-notice", {
          state: { email: data.email || formData.email },
        });
      } else {
        setErrorMsg(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg("Không thể kết nối đến máy chủ. Hãy bật php artisan serve!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(
        (${API_BASE}) + "/auth/google/url",
        {
          headers: { Accept: "application/json" },
        },
      );
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(
          data.message || "Không thể lấy đường dẫn đăng nhập Google.",
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="home-page h-screen w-full bg-[#08051c] flex flex-col font-sans text-white relative overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#823feb] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4f46e5] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* Simplified Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a
            className="flex items-center gap-2.5 no-underline"
            href="/"
            data-discover="true"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-graduation-cap h-5 w-5 text-brand"
                aria-hidden="true"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
            </span>
            <span className="text-lg font-bold text-white">SinhVienJob</span>
          </a>
          <div className="hidden items-center gap-4 lg:flex">
            <Link to="/jobs" className="hover:text-white transition-colors">
              Tìm việc
            </Link>
            <Link
              to="/companies"
              className="hover:text-white transition-colors"
            >
              Công ty
            </Link>
            <Link
              to="/employer/login"
              className="hover:text-white transition-colors"
            >
              Dành cho NTD
            </Link>
          </div>

          <button
            type="button"
            className="border-none bg-transparent text-white lg:hidden cursor-pointer"
            aria-label="Mở menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu h-6 w-6"
              aria-hidden="true"
            >
              <path d="M4 5h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 19h16"></path>
            </svg>
          </button>
        </nav>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden md:flex flex-col items-start"
          >
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Chào mừng trở lại <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-light to-[#823feb]">
                Sinh viên
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Đăng nhập để khám phá hàng ngàn cơ hội việc làm phù hợp với bạn.
            </p>

            {/* Placeholder for 3D Illustration */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 bg-linear-to-b from-[#823feb]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-[#823feb]/30 rounded-[100%] blur-xl"></div>

              <div className="w-full h-full relative float-element flex items-center justify-center">
                {/* Simulated 3D character with shapes */}
                <div className="relative z-10 w-48 h-64 bg-linear-to-br from-[#4f46e5] to-[#823feb] rounded-3xl shadow-2xl flex flex-col items-center p-6 border border-white/10">
                  <div className="w-20 h-20 rounded-full bg-white/20 mb-4 border-2 border-white/30 backdrop-blur-sm"></div>
                  <div className="w-32 h-24 bg-white/10 rounded-xl border border-white/20 mt-auto flex items-center justify-center backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white/30"></div>
                  </div>
                </div>
                {/* Floating props */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-brand-light/40 rounded-2xl backdrop-blur-md border border-white/20 animate-pulse flex items-center justify-center">
                  <Star className="text-white w-8 h-8" />
                </div>
                <div className="absolute bottom-20 left-4 w-12 h-12 bg-blue-500/40 rounded-full backdrop-blur-md border border-white/20 animate-bounce delay-150"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-[#120e2d]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Đăng nhập tài khoản sinh viên
                </h2>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập email của bạn"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#823feb] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mật khẩu"
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#823feb] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-light hover:text-white transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-linear-to-r from-[#a45bff] via-[#8f4bff] to-[#7b3fff] hover:opacity-90 text-white font-medium rounded-xl transition-all btn-glow shadow-lg shadow-[#823feb]/20 flex justify-center items-center hover-lift ripple-button"
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>

              <div className="mt-8 flex items-center">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-xs text-gray-500">
                  hoặc tiếp tục với
                </span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors hover-lift ripple-button"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-gray-400">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-brand-light hover:text-white font-medium transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Login;
