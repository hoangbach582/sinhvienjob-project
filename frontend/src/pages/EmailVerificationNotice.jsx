import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

function EmailVerificationNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Nếu truy cập trực tiếp mà không có email, điều hướng về login
  if (!email) {
    navigate("/login");
    return null;
  }

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const response = await fetch(
        (import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + "/email/verification/resend",
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
        setMessage(
          data.message || "Email xác minh đã được gửi lại thành công!",
        );
      } else {
        setErrorMsg(data.message || "Có lỗi xảy ra khi gửi lại email.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        style={{ marginTop: "5.188rem", padding: "2rem" }}
        className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#08051c] min-h-[calc(100vh-140px)]"
      >
        {/* Background glow for the container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#823feb] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="bg-[#120e2d]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl max-w-[450px] w-full relative z-10">
          <div className="text-center">
            <div className="mb-8 relative inline-flex justify-center items-center mt-2">
              {/* The circle gradient behind the envelope */}
              <div className="absolute inset-0 bg-linear-to-tr from-[#4f46e5] to-brand-light rounded-full blur-xl opacity-40"></div>
              <div className="relative w-24 h-24 rounded-full bg-linear-to-b from-white/10 to-transparent border border-white/20 flex items-center justify-center backdrop-blur-md">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Checkmark badge */}
                <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-linear-to-r from-brand-light to-[#823feb] flex items-center justify-center border-2 border-[#120e2d] shadow-lg">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                {/* Sparkles */}
                <svg
                  className="absolute -top-3 -left-3 text-brand-light w-4 h-4 animate-pulse"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                <svg
                  className="absolute top-1 -right-5 text-[#823feb] w-3 h-3 animate-pulse delay-100"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                <svg
                  className="absolute bottom-4 -left-7 text-white/50 w-2 h-2 animate-pulse delay-200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                <svg
                  className="absolute -bottom-2 -right-3 text-brand-light/60 w-5 h-5 animate-pulse delay-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Xác minh tài khoản của bạn
            </h2>

            <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
              Chúng tôi đã gửi một email xác minh đến địa chỉ{" "}
              <strong className="text-white font-medium">{email}</strong>. Vui
              lòng kiểm tra hộp thư đến (và hộp thư rác) để hoàn tất việc đăng
              ký.
            </p>

            {message && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm text-center mb-6">
                {message}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center mb-6">
                {errorMsg}
              </div>
            )}

            <div style={{ marginTop: "1rem" }} className="flex flex-col gap-4">
              <button
                style={{ padding: "1rem" }}
                className="w-full py-3.5 px-4 bg-linear-to-r from-[#a45bff] via-[#8f4bff] to-[#7b3fff] hover:opacity-90 text-white font-medium rounded-xl transition-all shadow-lg shadow-[#823feb]/20 flex justify-center items-center gap-2"
                onClick={handleResend}
                disabled={loading}
              >
                <Mail className="w-5 h-5" />
                {loading ? "Đang gửi..." : "Gửi lại email xác minh"}
              </button>

              <Link
                to="/login"
                style={{ padding: "1rem" }}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default EmailVerificationNotice;
