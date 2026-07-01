import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const getInitialRole = () => {
    if (location.state?.role) return location.state.role;
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam === "employer" || roleParam === "student") return roleParam;
    return "student";
  };

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(getInitialRole());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { email, password, role };
    if (role === "student") payload.full_name = fullName;
    if (role === "employer") payload.company_name = companyName;

    try {
      const response = await fetch((${API_BASE}) + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_verification) {
          navigate("/verify-email-notice", { state: { email } });
        } else {
          const userWithInfo = {
            ...data.user,
            name: fullName || companyName || "",
          };

          login(data.token || data.access_token, userWithInfo);
          setStep(3); // Success step
          setTimeout(() => {
            window.location.href =
              role === "employer" ? "/employer/dashboard" : "/";
          }, 1500);
        }
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          setError(errorMessages);
        } else {
          setError(data.message || "Đăng ký thất bại!");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setStep(2);
    setError("");
  };

  return (
    <div className="home-page min-h-screen bg-[#08051c] flex flex-col font-sans text-white relative overflow-hidden">
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-12">
        <div className="w-full max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-400 text-lg">
            Tham gia cộng đồng SinhVienJob ngay hôm nay
          </p>
        </div>

        {/* Stepper */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-linear-to-r from-brand-light to-[#823feb] z-0 transition-all duration-500"
              style={{
                width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
              }}
            ></div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? "bg-linear-to-br from-[#a45bff] to-[#7b3fff] text-white shadow-lg shadow-[#823feb]/30" : "bg-[#1a1636] text-gray-400 border border-white/10"}`}
              >
                1
              </div>
              <span
                className={`text-xs font-medium ${step >= 1 ? "text-white" : "text-gray-500"}`}
              >
                Chọn loại tài khoản
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? "bg-linear-to-br from-[#a45bff] to-[#7b3fff] text-white shadow-lg shadow-[#823feb]/30" : "bg-[#1a1636] text-gray-400 border border-white/10"}`}
              >
                2
              </div>
              <span
                className={`text-xs font-medium ${step >= 2 ? "text-white" : "text-gray-500"}`}
              >
                Thông tin tài khoản
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 3 ? "bg-linear-to-br from-[#a45bff] to-[#7b3fff] text-white shadow-lg shadow-[#823feb]/30" : "bg-[#1a1636] text-gray-400 border border-white/10"}`}
              >
                3
              </div>
              <span
                className={`text-xs font-medium ${step >= 3 ? "text-white" : "text-gray-500"}`}
              >
                Hoàn tất
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="grid md:grid-cols-2 gap-6 w-full mb-10">
              {/* Student Card */}
              <div
                onClick={() => setRole("student")}
                className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden ${role === "student" ? "bg-[#1a153c] border-[#823feb] shadow-xl shadow-[#823feb]/20" : "bg-white/5 border-white/10 hover:border-white/30"}`}
              >
                {role === "student" && (
                  <div className="absolute inset-0 bg-linear-to-b from-[#823feb]/10 to-transparent pointer-events-none"></div>
                )}

                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors ${role === "student" ? "bg-[#823feb]/20" : "bg-white/10 group-hover:bg-white/20"}`}
                >
                  <GraduationCap
                    className={`w-12 h-12 ${role === "student" ? "text-brand-light" : "text-gray-400 group-hover:text-white"}`}
                  />
                </div>
                <h3
                  className={`text-2xl font-bold mb-3 ${role === "student" ? "text-white" : "text-gray-300"}`}
                >
                  Sinh viên
                </h3>
                <p className="text-gray-400 text-sm">
                  Tìm kiếm việc làm phù hợp với kỹ năng và thời gian của bạn
                </p>

                {role === "student" && (
                  <div className="absolute top-4 right-4 text-brand-light">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Employer Card */}
              <div
                onClick={() => setRole("employer")}
                className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden ${role === "employer" ? "bg-[#0f2c25] border-[#10b981] shadow-xl shadow-[#10b981]/20" : "bg-white/5 border-white/10 hover:border-white/30"}`}
              >
                {role === "employer" && (
                  <div className="absolute inset-0 bg-linear-to-b from-[#10b981]/10 to-transparent pointer-events-none"></div>
                )}

                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors ${role === "employer" ? "bg-[#10b981]/20" : "bg-white/10 group-hover:bg-white/20"}`}
                >
                  <Briefcase
                    className={`w-12 h-12 ${role === "employer" ? "text-[#34d399]" : "text-gray-400 group-hover:text-white"}`}
                  />
                </div>
                <h3
                  className={`text-2xl font-bold mb-3 ${role === "employer" ? "text-white" : "text-gray-300"}`}
                >
                  Nhà tuyển dụng
                </h3>
                <p className="text-gray-400 text-sm">
                  Tìm kiếm ứng viên chất lượng cho doanh nghiệp của bạn
                </p>

                {role === "employer" && (
                  <div className="absolute top-4 right-4 text-[#34d399]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Benefits List based on Role */}
            <div className="w-full max-w-md bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-md">
              <h4 className="text-sm font-semibold text-white mb-4">
                Với tài khoản{" "}
                {role === "student" ? "sinh viên" : "nhà tuyển dụng"}, bạn sẽ
                được:
              </h4>
              <ul className="space-y-3">
                {role === "student" ? (
                  <>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />{" "}
                      Tìm kiếm hàng ngàn việc làm phù hợp
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />{" "}
                      Tạo CV chuyên nghiệp miễn phí
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />{" "}
                      Nhận gợi ý việc làm thông minh
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0" />{" "}
                      Kết nối trực tiếp với nhà tuyển dụng
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />{" "}
                      Đăng tin tuyển dụng miễn phí
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />{" "}
                      Tìm kiếm hồ sơ ứng viên chất lượng
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />{" "}
                      Quản lý chiến dịch tuyển dụng hiệu quả
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />{" "}
                      Nâng cao thương hiệu tuyển dụng
                    </li>
                  </>
                )}
              </ul>

              <button
                onClick={handleNextStep}
                className={`w-full max-w-md py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover-lift ripple-button ${role === "student" ? "bg-linear-to-r from-[#a45bff] to-[#7b3fff] hover:opacity-90 shadow-[#823feb]/20" : "bg-linear-to-r from-[#059669] to-[#10b981] hover:opacity-90 shadow-[#10b981]/20"}`}
              >
                Tiếp tục <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Form Input */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-[#120e2d]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center mb-6">
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${role === "student" ? "bg-[#823feb]/20" : "bg-[#10b981]/20"}`}
                >
                  {role === "student" ? (
                    <GraduationCap className="w-6 h-6 text-brand-light" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-[#34d399]" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Thông tin tài khoản
                </h2>
                <p className="text-sm text-gray-400">
                  Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center whitespace-pre-wrap">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {role === "student" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="VD: Nguyễn Văn A"
                        className={`w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${role === "student" ? "focus:ring-[#823feb]" : "focus:ring-[#10b981]"}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tên công ty
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="VD: Công ty TNHH Công nghệ..."
                        className={`w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${role === "student" ? "focus:ring-[#823feb]" : "focus:ring-[#10b981]"}`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập địa chỉ email"
                      className={`w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${role === "student" ? "focus:ring-[#823feb]" : "focus:ring-[#10b981]"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className={`w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${role === "student" ? "focus:ring-[#823feb]" : "focus:ring-[#10b981]"}`}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10 hover-lift ripple-button"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-2/3 py-3.5 px-4 flex items-center justify-center gap-2 hover:opacity-90 text-white font-medium rounded-xl transition-all shadow-lg hover-lift ripple-button ${role === "student" ? "bg-linear-to-r from-[#a45bff] to-[#7b3fff] shadow-[#823feb]/20" : "bg-linear-to-r from-[#059669] to-[#10b981] shadow-[#10b981]/20"}`}
                  >
                    {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto text-center"
          >
            <div
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl ${role === "student" ? "bg-[#823feb]/20 shadow-[#823feb]/20 text-brand-light" : "bg-[#10b981]/20 shadow-[#10b981]/20 text-[#34d399]"}`}
            >
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Đăng ký thành công!
            </h2>
            <p className="text-gray-400">
              Đang chuyển hướng bạn đến{" "}
              {role === "student" ? "trang chủ" : "bảng điều khiển"}...
            </p>
          </motion.div>
        )}

        <div className="mt-12 text-center text-sm text-gray-400">
          Đã có tài khoản?{" "}
          <Link
            to={role === "student" ? "/login" : "/employer/login"}
            className={`font-medium transition-colors ${role === "student" ? "text-brand-light hover:text-white" : "text-[#34d399] hover:text-white"}`}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Register;
