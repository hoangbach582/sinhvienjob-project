import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import HomeNavbar from "../components/home/HomeNavbar";
import FooterNew from "../components/FooterNew";
import JobDetailHero from "../components/job/JobDetailHero";
import NotificationBell from "../components/notifications/NotificationBell";
import SEOHead from "../components/SEOHead";
import JobDetailContent from "../components/job/JobDetailContent";
import { JobDetailSimilar } from "../components/job/JobDetailSections";
import { toast } from "react-hot-toast";

function JobDetail() {
  const { id } = useParams(); // Lấy ID công việc từ trên URL (VD: /job/123 -> id = 123)
  const navigate = useNavigate(); // Hook chuyển trang
  const location = useLocation(); // Lấy thông tin URL hiện tại (để đọc query params)
  const { isLoggedIn, userRole } = useAuth(); // Lấy trạng thái đăng nhập từ Global Context

  // --- STATE QUẢN LÝ THÔNG TIN CÔNG VIỆC ---
  const [job, setJob] = useState(null); // Lưu trữ dữ liệu chi tiết công việc
  const [loading, setLoading] = useState(true); // Trạng thái màn hình loading (Spinner)
  const [isApplying, setIsApplying] = useState(false); // Trạng thái lúc đang bấm "Nộp CV" (ngăn double-click)
  const [hasApplied, setHasApplied] = useState(false); // Xác định xem người dùng đã ứng tuyển job này chưa
  const [isSaved, setIsSaved] = useState(false); // Xác định xem người dùng đã lưu job này chưa

  // --- STATE DÀNH RIÊNG CHO MODAL (Popup) ỨNG TUYỂN VÀ YÊU CẦU ĐĂNG NHẬP ---
  const [showApplyModal, setShowApplyModal] = useState(false); // Hiển thị / Ẩn modal nộp CV
  const [coverLetter, setCoverLetter] = useState(""); // Nội dung thư ngỏ (Cover letter)
  const [loginPromptParams, setLoginPromptParams] = useState({ show: false, message: "" }); // Modal báo cần đăng nhập

  // --- STATE CHO TÍNH NĂNG UPLOAD CV NÂNG CAO ---
  const [cvOption, setCvOption] = useState("profile"); // Người dùng chọn dùng CV có sẵn ('profile') hay tải CV mới ('upload')
  const [customCvFile, setCustomCvFile] = useState(null); // Chứa file CV mà người dùng vừa tải lên
  const [isDragging, setIsDragging] = useState(false); // Trạng thái UX khi người dùng kéo thả file vào ô upload

  const [applyMessage, setApplyMessage] = useState({ text: "", type: "" }); // Thông báo kết quả sau khi ấn Nộp CV

  /**
   * USE-EFFECT: TẢI CHI TIẾT CÔNG VIỆC KHI MỞ TRANG
   * Chạy tự động mỗi khi ID trên URL thay đổi.
   */
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        // Nếu đã đăng nhập, đính kèm token để Backend biết user là ai
        // Mục đích: Trả về trường `has_applied` và `is_saved` (biết user đã nộp hay lưu chưa)
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')}/jobs/${id}`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setJob(data); // Cập nhật dữ liệu ra màn hình
          if (token) {
            setHasApplied(data.has_applied);
            setIsSaved(data.is_saved);
          } else {
            setHasApplied(false);
            setIsSaved(false);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết việc làm:", err);
      } finally {
        setLoading(false); // Dừng hiệu ứng loading
      }
    };

    fetchJobDetail();
  }, [id]);

  /**
   * HÀM MỞ MODAL ỨNG TUYỂN
   * Mục đích: Kiểm tra các điều kiện nghiêm ngặt trước khi cho phép nộp CV
   */
  const handleOpenApply = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");

    // Lỗi 1: User đang là Guest (Chưa đăng nhập)
    if (!token || !isLoggedIn) {
      setLoginPromptParams({
        show: true,
        message: "Bạn cần đăng nhập tài khoản Sinh viên để ứng tuyển. Đi đến trang Đăng nhập ngay?"
      });
      return;
    }

    // Lỗi 2: Đăng nhập bằng tài khoản Nhà tuyển dụng hoặc Admin (Không cho phép nộp CV)
    if (userRole !== "student") {
      alert("Chỉ tài khoản Sinh viên mới có quyền nộp CV ứng tuyển!");
      return;
    }

    // Nếu qua hết chốt chặn, mở Modal và reset dữ liệu cũ trong form
    setShowApplyModal(true);
    setApplyMessage({ text: "", type: "" });
    setCvOption("profile"); // Mặc định chọn cách lấy CV có sẵn
    setCustomCvFile(null);
  };

  const handleSaveJob = async () => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    if (!token || !isLoggedIn) {
      setLoginPromptParams({
        show: true,
        message: "Bạn cần đăng nhập tài khoản Sinh viên để lưu việc làm. Đi đến trang Đăng nhập ngay?"
      });
      return;
    }

    if (userRole !== "student") {
      alert("Chỉ tài khoản Sinh viên mới có quyền lưu việc làm!");
      return;
    }

    try {
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')}/jobs/${id}/save`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setIsSaved((prev) => !prev);
        toast.success(!isSaved ? "Lưu tin thành công" : "Đã bỏ lưu việc làm");
      } else {
        toast.error("Có lỗi xảy ra khi lưu việc làm!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối!");
    }
  };

  // Auto-open apply modal if ?apply=true
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("apply") === "true" && job && !loading) {
      // Small timeout to allow UI to settle
      setTimeout(() => {
        handleOpenApply();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, job, loading]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Xem công việc ${job.title} trên SinhVienJob`,
          url: url,
        });
      } catch (err) {
        console.error("Lỗi chia sẻ:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Đã sao chép đường dẫn vào bộ nhớ tạm!");
      } catch (err) {
        console.error("Lỗi sao chép:", err);
      }
    }
  };

  // --- HÀM XỬ LÝ KÉO THẢ VÀ KIỂM TRA FILE ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Kiểm tra dung lượng (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setApplyMessage({ text: "Kích thước file vượt quá 5MB!", type: "error" });
      return;
    }

    // Kiểm tra định dạng đuôi file
    const validExtensions = ["pdf", "doc", "docx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setApplyMessage({
        text: "Chỉ hỗ trợ định dạng .pdf, .doc, .docx!",
        type: "error",
      });
      return;
    }

    setCustomCvFile(file);
    setApplyMessage({ text: "", type: "" }); // Xóa lỗi nếu chọn file đúng
  };

  /**
   * HÀM XỬ LÝ GỬI FORM ỨNG TUYỂN LÊN BACKEND
   * Mục đích: Gọi API POST /jobs/{id}/apply, đính kèm file CV và Cover Letter
   */
  const submitApplication = async (e) => {
    e.preventDefault(); // Ngăn chặn việc reload trang khi submit form

    // Kiểm tra: Nếu chọn Upload mà quên chọn file thì chặn lại
    if (cvOption === "upload" && !customCvFile) {
      setApplyMessage({
        text: "Vui lòng chọn hoặc kéo thả file CV của bạn!",
        type: "error",
      });
      return;
    }

    setIsApplying(true); // Hiển thị nút "Đang gửi hồ sơ..."
    setApplyMessage({ text: "", type: "" });

    // Sử dụng FormData (thay vì JSON) để có thể upload file qua HTTP Request
    const formData = new FormData();
    if (coverLetter) formData.append("cover_letter", coverLetter);

    // Chỉ đính kèm file thật lên FormData nếu người dùng chọn tab Upload
    // Nếu chọn Profile, Backend sẽ tự động lấy file CV cũ trong Database dựa theo Token
    if (cvOption === "upload" && customCvFile) {
      formData.append("cv_file", customCvFile);
    }

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')}/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Bắt buộc phải có token
          },
          body: formData, // Đẩy dữ liệu file + text lên
        },
      );

      const data = await response.json();

      if (response.ok) {
        setApplyMessage({
          text: data.message || "Ứng tuyển thành công!",
          type: "success",
        });
        setHasApplied(true); // Biến nút "Nộp CV" thành "Đã ứng tuyển"
        setTimeout(() => setShowApplyModal(false), 2000); // Tự động đóng modal sau 2s
      } else {
        setApplyMessage({
          text: data.message || "Có lỗi xảy ra!",
          type: "error",
        });
      }
    } catch {
      setApplyMessage({
        text: "Lỗi kết nối! Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsApplying(false); // Tắt hiệu ứng loading trên nút
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return "Thỏa thuận";
  };

  const translateType = (type) => {
    const types = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      internship: "Thực tập sinh",
      remote: "Làm việc từ xa",
      collaborator: "Cộng tác viên",
    };
    return types[type] || type;
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="home-page min-h-screen flex flex-col "
        style={{
          background:
            "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-white/20 border-t-brand-light rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="home-page min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 text-lg mb-4">
              Không tìm thấy công việc này!
            </p>
            <Link
              to="/jobs"
              className="text-brand-light hover:underline no-underline text-sm"
            >
              ← Quay lại danh sách việc làm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={job?.title || "Chi tiết công việc"} 
        description={job ? `Ứng tuyển ngay công việc ${job.title} tại ${job.employer?.company_name}` : "Chi tiết công việc part-time, internship tại SinhVienJob"} 
        image={job?.employer?.logo_url ? (job.employer.logo_url.startsWith('http') ? job.employer.logo_url : `http://127.0.0.1:8000${job.employer.logo_url}`) : null}
      />
      <div 
        className="home-page min-h-screen flex flex-col pt-24 pb-12"
        style={{
          background:
            "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
      <HomeNavbar />

      {/* --- LOGIN PROMPT MODAL --- */}
      <AnimatePresence>
      {loginPromptParams.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-2xl overflow-hidden w-full max-w-[400px] mx-5 text-center shadow-2xl"
            style={{
              padding: "2rem",
              background: "rgba(18,14,45,0.98)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(130,63,235,0.15)", border: "1px solid rgba(130,63,235,0.3)" }}>
              <span className="text-3xl">🔒</span>
            </div>
            
            <h3 className="text-white font-bold text-xl mb-3">
              Yêu cầu đăng nhập
            </h3>
            
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {loginPromptParams.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setLoginPromptParams({ show: false, message: "" })}
                className="flex-1 py-2.5 rounded-xl text-white/70 font-semibold text-sm border cursor-pointer hover:bg-white/5 transition-colors hover-lift ripple-button"
                style={{
                  background: "transparent",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setLoginPromptParams({ show: false, message: "" });
                  navigate("/login");
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm border-none cursor-pointer hover:opacity-90 transition-opacity hover-lift ripple-button"
                style={{
                  background: "linear-gradient(135deg, #823feb, #6366f1)",
                }}
              >
                Đăng nhập
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* --- APPLY MODAL (Dark themed) --- */}
      <AnimatePresence>
      {showApplyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-2xl overflow-hidden w-full max-w-[550px] mx-5"
            style={{
              padding: "1rem",
              background: "rgba(18,14,45,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                borderRadius: "1rem",
                padding: "1rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h3 className="text-white font-bold text-lg m-0">
                Nộp CV Ứng Tuyển
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-white/40 hover:text-white bg-transparent border-none text-xl cursor-pointer transition-colors"
              >
                ✖
              </button>
            </div>

            <div className="p-6">
              {applyMessage.text && (
                <div
                  className={`p-3 mb-5 rounded-xl text-sm font-medium text-center ${applyMessage.type === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                >
                  {applyMessage.type === "success"
                    ? `✅ ${applyMessage.text}`
                    : `❌ ${applyMessage.text}`}
                </div>
              )}

              <form
                onSubmit={submitApplication}
                className="flex flex-col gap-6"
              >
                <div>
                  <label
                    style={{ margin: "1rem 0 0.4rem" }}
                    className="block text-sm text-white/80 mb-3 font-semibold"
                  >
                    Tệp CV đính kèm <span className="text-red-400">*</span>
                  </label>

                  {/* 2 LỰA CHỌN (TABS) */}
                  <div className="flex gap-3 mb-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="cvOption"
                        value="profile"
                        checked={cvOption === "profile"}
                        onChange={() => setCvOption("profile")}
                        className="hidden"
                      />
                      <div
                        className={`p-3 text-center rounded-xl text-sm font-medium transition-all ${cvOption === "profile" ? "text-brand-light" : "text-white/50"}`}
                        style={{
                          background:
                            cvOption === "profile"
                              ? "rgba(130,63,235,0.15)"
                              : "rgba(255,255,255,0.05)",
                          border:
                            cvOption === "profile"
                              ? "1px solid rgba(130,63,235,0.4)"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        📂 Dùng CV trong Hồ sơ
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="cvOption"
                        value="upload"
                        checked={cvOption === "upload"}
                        onChange={() => setCvOption("upload")}
                        className="hidden"
                      />
                      <div
                        className={`p-3 text-center rounded-xl text-sm font-medium transition-all ${cvOption === "upload" ? "text-brand-light" : "text-white/50"}`}
                        style={{
                          background:
                            cvOption === "upload"
                              ? "rgba(130,63,235,0.15)"
                              : "rgba(255,255,255,0.05)",
                          border:
                            cvOption === "upload"
                              ? "1px solid rgba(130,63,235,0.4)"
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        💻 Tải lên CV mới
                      </div>
                    </label>
                  </div>

                  {/* KHU VỰC HIỂN THỊ THEO LỰA CHỌN */}
                  {cvOption === "profile" ? (
                    <div
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        marginTop: "1rem",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <span className="text-xl">💡</span>
                      <p className="m-0 text-sm text-emerald-400/90 leading-relaxed">
                        Hệ thống sẽ tự động trích xuất{" "}
                        <b>CV hiện tại trong Hồ sơ cá nhân</b> của bạn để gửi
                        cho nhà tuyển dụng.
                      </p>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="p-8 rounded-xl text-center transition-all"
                      style={{
                        margin: '1rem 0 0',
                        border: isDragging
                          ? "2px dashed rgba(130,63,235,0.6)"
                          : "2px dashed rgba(255,255,255,0.2)",
                        background: isDragging
                          ? "rgba(130,63,235,0.05)"
                          : "rgba(255,255,255,0.02)",
                      }}
                    >
                      {customCvFile ? (
                        <div>
                          <div className="text-3xl mb-2">📄</div>
                          <p className="m-0 mb-1 text-white font-semibold text-sm">
                            {customCvFile.name}
                          </p>
                          <p className="m-0 mb-4 text-white/40 text-xs">
                            {(customCvFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <span
                            onClick={() => setCustomCvFile(null)}
                            className="text-red-400 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-lg"
                            style={{
                              border: "1px solid rgba(239,68,68,0.3)",
                              background: "rgba(239,68,68,0.1)",
                            }}
                          >
                            Xóa file này
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl mb-3 text-white/30">☁️</div>
                          <p className="m-0 mb-2 text-white/70 font-medium text-sm">
                            Kéo thả file CV của bạn vào đây
                          </p>
                          <p className="m-0 mb-4 text-white/40 text-xs">
                            Hỗ trợ định dạng .pdf, .doc, .docx (Dưới 5MB)
                          </p>
                          <label
                            className="cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-semibold text-brand-light"
                            style={{
                              padding: '0.6rem', margin: '1rem',
                              background: "rgba(130,63,235,0.15)",
                              border: "1px solid rgba(130,63,235,0.3)",
                            }}
                          >
                            Hoặc chọn file từ máy
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{ marginBottom: "0.4rem" }}
                    className="block text-sm text-white/80 mb-2 font-semibold"
                  >
                    Thư ngỏ (Cover Letter)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Viết một vài dòng giới thiệu bản thân và lý do bạn ứng tuyển..."
                    rows="4"
                    className="w-full p-3 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-vertical box-border"
                    style={{
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isApplying || applyMessage.type === "success"}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-base border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed hover-lift ripple-button"
                  style={{
                    padding: "1rem",
                    background: "linear-gradient(135deg, #823feb, #6366f1)",
                  }}
                >
                  {isApplying ? "Đang gửi hồ sơ..." : "🚀 Gửi CV Ngay"}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      {/* --- KẾT THÚC KHỐI MODAL --- */}

      <JobDetailHero
        job={job}
        formatSalary={formatSalary}
        translateType={translateType}
        hasApplied={hasApplied}
        isApplying={isApplying}
        onApply={handleOpenApply}
        isSaved={isSaved}
        onSaveJob={handleSaveJob}
        onShare={handleShare}
      />

      <JobDetailContent job={job} />

      <JobDetailSimilar
        currentJobId={id}
        formatSalary={formatSalary}
        translateType={translateType}
      />

      <FooterNew />
    </div>
    </>
  );
}

export default JobDetail;
