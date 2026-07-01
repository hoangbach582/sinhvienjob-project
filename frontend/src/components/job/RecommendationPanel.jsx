import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Star,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  History,
  TrendingUp,
  ChevronRight,
  Loader2,
} from "lucide-react";

/**
 * Panel trượt từ phải sang trái hiển thị việc làm gợi ý cá nhân hóa.
 *
 * Props:
 *   isOpen        – boolean, có hiển thị panel không
 *   onClose       – callback đóng panel
 *   searchHistory – string[], lịch sử tìm kiếm từ localStorage
 */
function RecommendationPanel({ isOpen, onClose, searchHistory = [] }) {
  const [jobs, setJobs] = useState([]);
  const [mode, setMode] = useState(null); // 'skills' | 'search_history' | 'latest'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const historyParam = searchHistory.slice(0, 5).join(",");
      const url = `${(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')}/jobs/recommendations${historyParam ? `?search_history=${encodeURIComponent(historyParam)}` : ""}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể tải gợi ý");

      const data = await res.json();
      setJobs(data.data || []);
      setMode(data.mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchHistory]);

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, fetchRecommendations]);

  const getModeInfo = () => {
    switch (mode) {
      case "skills":
        return {
          icon: <Sparkles className="w-4 h-4 text-violet-400" />,
          label: "Dựa trên kỹ năng của bạn",
          color: "text-violet-400",
          bg: "bg-violet-500/10 border-violet-500/20",
        };
      case "search_history":
        return {
          icon: <History className="w-4 h-4 text-blue-400" />,
          label: "Dựa trên lịch sử tìm kiếm",
          color: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/20",
        };
      default:
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
          label: "Việc làm mới nhất",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    const minM = min ? min / 1_000_000 : 0;
    const maxM = max ? max / 1_000_000 : 0;
    if (minM && maxM) return `${minM}–${maxM}tr`;
    if (minM) return `Từ ${minM}tr`;
    return `Đến ${maxM}tr`;
  };

  const getTypeLabel = (t) =>
    ({ full_time: "Toàn thời gian", part_time: "Bán thời gian", internship: "Thực tập" }[t] || t);

  const getTypeBg = (t) =>
    ({
      full_time: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      part_time: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      internship: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    }[t] || "bg-brand/15 text-brand-light border-brand/20");

  const modeInfo = getModeInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{
              width: "min(420px, 95vw)",
              background: "linear-gradient(180deg, #0f1535 0%, #0d1230 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
              padding: "1rem",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.08)", marginBottom: "0.8rem" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #823feb, #6366f1)" }}
                >
                  <Star className="w-4 h-4 text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base m-0 leading-tight">
                    Gợi ý cho bạn
                  </h2>
                  <p className="text-white/40 text-xs m-0">Được cá nhân hóa riêng</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Badge */}
            {mode && !loading && (
              <div className="px-5 pt-4 shrink-0" style={{ marginBottom: '0.8rem' }}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${modeInfo.bg} ${modeInfo.color}`} style={{ padding: '0.8rem' }}>
                  {modeInfo.icon}
                  {modeInfo.label}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loading && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Loader2 className="w-8 h-8 text-violet-400" />
                  </motion.div>
                  <p className="text-white/40 text-sm">Đang phân tích hồ sơ của bạn...</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button
                    onClick={fetchRecommendations}
                    className="px-4 py-2 rounded-lg text-sm text-white border border-white/10 hover:bg-white/5 transition-colors bg-transparent cursor-pointer"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!loading && !error && jobs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                  <Sparkles className="w-10 h-10 text-white/20" />
                  <p className="text-white/50 text-sm leading-relaxed">
                    Chưa tìm thấy gợi ý phù hợp.
                    <br />
                    Hãy thêm kỹ năng vào hồ sơ hoặc tìm kiếm thêm.
                  </p>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 transition-colors no-underline"
                  >
                    Cập nhật hồ sơ →
                  </Link>
                </div>
              )}

              {!loading &&
                !error &&
                jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/jobs/${job.id}`}
                      onClick={onClose}
                      className="block rounded-2xl p-4 border transition-all no-underline group hover:-translate-y-0.5"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.08)",
                        padding: "0.8rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(130,63,235,0.1)";
                        e.currentTarget.style.borderColor = "rgba(130,63,235,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                    >
                      {/* Company logo + name */}
                      <div className="flex items-start gap-3 mb-3" style={{ marginBottom: '1rem' }}>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {job.employer?.logo ? (
                            <img
                              src={job.employer.logo}
                              alt={job.employer?.company_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Briefcase className="w-5 h-5 text-white/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm m-0 truncate group-hover:text-violet-300 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-white/50 text-xs mt-0.5 m-0 truncate">
                            {job.employer?.company_name || "Công ty"}
                          </p>
                        </div>
                        {job.match_score > 0 && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 shrink-0">
                            <Star className="w-3 h-3 text-violet-400" fill="currentColor" />
                            <span className="text-violet-300 text-xs font-medium">{job.match_score}</span>
                          </div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getTypeBg(job.type)}`}
                          style={{ padding: '0.4rem' }}
                        >
                          {getTypeLabel(job.type)}
                        </span>
                        {job.location && (
                          <span className="inline-flex items-center gap-1 text-white/40 text-xs">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-white/40 text-xs ml-auto">
                          <Clock className="w-3 h-3" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-violet-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>

            {/* Footer CTA */}
            {!loading && jobs.length > 0 && (
              <div className="px-5 py-4 border-t shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Link
                  to="/jobs?recommended=true"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold no-underline transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #823feb, #6366f1)", padding: "0.6rem" }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Xem tất cả việc làm phù hợp
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RecommendationPanel;
