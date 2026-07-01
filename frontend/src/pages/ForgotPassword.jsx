import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch(
        (${API_BASE}) + "/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(
          data.message ||
            "Link đặt lại mật khẩu đã được gửi vào email của bạn!",
        );
        setEmail(""); // Xóa form sau khi gửi thành công
      } else {
        // Xử lý lỗi validation (422) hoặc lỗi khác
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setErrorMsg(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setErrorMsg(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg("Không thể kết nối đến máy chủ. Hãy bật php artisan serve!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page min-h-screen bg-[#08051c] flex flex-col font-sans text-white relative overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#823feb] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4f46e5] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-[#6366f1] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      {/* Animated grid lines (subtle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(130,63,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(130,63,235,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      ></div>

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
          {/* Left Column: Illustration & Text */}
          <div className="hidden md:flex flex-col items-start">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Khôi phục <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad74ff] to-[#823feb]">
                mật khẩu
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Đừng lo, chỉ cần vài bước đơn giản là bạn sẽ lấy lại được quyền
              truy cập tài khoản.
            </p>

            {/* Animated Illustration */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 bg-gradient-to-b from-[#823feb]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-[#823feb]/30 rounded-[100%] blur-xl"></div>

              <div className="w-full h-full relative float-element flex items-center justify-center">
                {/* Key/Lock illustration */}
                <div className="relative z-10">
                  {/* Main card */}
                  <div
                    style={{
                      width: "200px",
                      height: "260px",
                      background: "linear-gradient(145deg, #4f46e5, #823feb)",
                      borderRadius: "24px",
                      boxShadow: "0 25px 60px rgba(130, 63, 235, 0.4)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      gap: "16px",
                    }}
                  >
                    {/* Lock icon */}
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    {/* Email line mockup */}
                    <div
                      style={{
                        width: "100%",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        gap: "8px",
                      }}
                    >
                      <Mail className="w-4 h-4 text-white/50" />
                      <div
                        style={{
                          width: "60%",
                          height: "8px",
                          borderRadius: "4px",
                          background: "rgba(255,255,255,0.2)",
                        }}
                      ></div>
                    </div>
                    {/* Button mockup */}
                    <div
                      style={{
                        width: "100%",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #a45bff, #7b3fff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Send className="w-4 h-4 text-white" />
                      <div
                        style={{
                          width: "40%",
                          height: "8px",
                          borderRadius: "4px",
                          background: "rgba(255,255,255,0.4)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Floating props */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-[#ad74ff]/40 rounded-2xl backdrop-blur-md border border-white/20 animate-pulse flex items-center justify-center">
                  <ShieldCheck className="text-white w-8 h-8" />
                </div>
                <div
                  className="absolute bottom-24 left-4 w-14 h-14 bg-emerald-500/30 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center"
                  style={{ animation: "bounce 2s ease-in-out infinite" }}
                >
                  <CheckCircle className="text-emerald-300 w-7 h-7" />
                </div>
                <div
                  className="absolute top-20 left-8 w-10 h-10 bg-blue-500/30 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center"
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                >
                  <Sparkles className="text-blue-300 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#120e2d]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
              {/* Header Icon */}
              <div className="text-center mb-8">
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background:
                      "linear-gradient(135deg, rgba(130,63,235,0.3), rgba(79,70,229,0.3))",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <KeyRound className="w-7 h-7 text-[#ad74ff]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Quên mật khẩu?
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu
                  cho bạn.
                </p>
              </div>

              {/* Thông báo thành công */}
              {successMsg && (
                <div
                  className="mb-6 p-4 rounded-xl text-sm text-center leading-relaxed"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#6ee7b7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Thành công!</span>
                  </div>
                  {successMsg}
                </div>
              )}

              {/* Thông báo lỗi */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Form nhập email */}
              {!successMsg && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="forgot-password-email"
                        type="email"
                        placeholder="Nhập email đã đăng ký"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#823feb] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-password-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#a45bff] via-[#8f4bff] to-[#7b3fff] hover:opacity-90 text-white font-medium rounded-xl transition-all btn-glow shadow-lg shadow-[#823feb]/20 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi link đặt lại mật khẩu
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Nếu đã gửi thành công, cho gửi lại */}
              {successMsg && (
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMsg("");
                  }}
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex justify-center items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Gửi lại email
                </button>
              )}

              {/* Divider */}
              <div className="mt-8 flex items-center">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-xs text-gray-500">hoặc</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              {/* Link quay lại đăng nhập */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#ad74ff] hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại Đăng nhập
                </Link>
              </div>

              {/* Help text */}
              <div className="mt-6 text-center text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-[#ad74ff] hover:text-white font-medium transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
                <span>Bảo mật SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500/60" />
                <span>Email xác thực</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
