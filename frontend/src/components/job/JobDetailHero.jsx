import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Share2,
  BadgeCheck,
  Flame,
  Code2,
  Monitor,
  Braces,
} from "lucide-react";

// Pre-computed star positions to avoid Math.random during render
const STARS = Array.from({ length: 30 }, (_, i) => ({
  w: 1 + ((i * 7 + 3) % 20) / 10,
  top: (i * 13 + 7) % 100,
  left: (i * 17 + 11) % 100,
  dur: 2 + ((i * 11 + 5) % 30) / 10,
  delay: ((i * 7 + 3) % 30) / 10,
}));

function JobDetailHero({
  job,
  formatSalary,
  translateType,
  hasApplied,
  isApplying,
  onApply,
  isSaved,
  onSaveJob,
  onShare,
}) {
  const applicantCount =
    job.applications_count !== undefined ? job.applications_count : 0;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "8rem",
        paddingBottom: "0",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        minHeight: "0",
        background:
          "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
      }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="hero-star"
            style={{
              width: `${s.w}px`,
              height: `${s.w}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--duration": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Gradient orbs */}
      <div
        className="absolute top-10 right-10 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #823feb 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-20 w-60 h-60 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
          <Link
            to="/"
            className="hover:text-white transition-colors no-underline text-white/50"
          >
            Trang chủ
          </Link>
          <span>›</span>
          <Link
            to="/jobs"
            className="hover:text-white transition-colors no-underline text-white/50"
          >
            Tìm việc
          </Link>
          <span>›</span>
          <span className="text-white/80 truncate max-w-[200px]">
            {job.title}
          </span>
        </nav>

        <div
          style={{
            background: "rgba(119, 77, 237, 0.15)",
            borderRadius: "1.25rem",
            padding: "2rem 2.5rem",
            marginTop: "1rem",
            border: "1px solid rgba(130,63,235,0.15)",
          }}
          className="flex flex-col lg:flex-row gap-8 items-start"
        >
          {/* Left content */}
          <div className="flex-1 min-w-0">
            {/* HOT badge */}
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-4"
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316)",
              }}
            >
              <Flame className="w-3.5 h-3.5" /> HOT
            </span>

            <h1
              className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ marginTop: "1rem" }}
            >
              {job.title}
            </h1>

            {/* Company */}
            <div
              className="flex items-center gap-2.5 mb-5"
              style={{ marginTop: "1rem" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #823feb, #6366f1)",
                  color: "white",
                }}
              >
                {job.employer?.company_name?.substring(0, 2).toUpperCase() ||
                  "CT"}
              </div>
              <span className="text-white font-semibold text-base">
                {job.employer?.company_name || "Đang cập nhật"}
              </span>
              <BadgeCheck className="w-5 h-5 text-blue-400" />
            </div>

            {/* Meta row */}
            <div
              style={{ marginTop: "1rem" }}
              className="flex items-center gap-5 flex-wrap text-sm text-white/70 mb-6"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />{" "}
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Toàn thời gian
              </span>
              <span
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(130,63,235,0.2)",
                  border: "1px solid rgba(130,63,235,0.3)",
                }}
              >
                <Briefcase className="w-3.5 h-3.5 text-brand-light" />{" "}
                <span className="text-brand-light">
                  {translateType(job.type)}
                </span>
              </span>
            </div>

            {/* CTA buttons */}
            <div
              style={{ marginTop: "1rem" }}
              className="flex items-center gap-3 flex-wrap mb-5"
            >
              <button
                onClick={onApply}
                disabled={isApplying || hasApplied}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-white font-semibold text-sm border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed hover-lift ripple-button"
                style={{
                  background:
                    isApplying || hasApplied
                      ? "#475569"
                      : "linear-gradient(135deg, #823feb, #6366f1)",
                  minWidth: "180px",
                }}
              >
                {hasApplied
                  ? "✅ Đã ứng tuyển"
                  : isApplying
                    ? "Đang gửi..."
                    : "Ứng tuyển ngay"}
              </button>
              <div
                onClick={onSaveJob}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/15 hover-lift"
                style={{
                  border: isSaved
                    ? "1px solid rgba(239, 68, 68, 0.5)"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: isSaved
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <span className={isSaved ? "text-red-400" : "text-white/70"}>
                  {isSaved ? "♥" : "♡"}
                </span>
                <span
                  className={
                    isSaved
                      ? "text-red-400 text-sm font-medium"
                      : "text-white/80 text-sm font-medium"
                  }
                >
                  {isSaved ? "Đã lưu" : "Lưu tin"}
                </span>
              </div>
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-white/80 text-sm font-medium bg-transparent cursor-pointer transition-colors hover:bg-white/15 border hover-lift"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
            </div>

            {/* Applicant count */}
            <div
              className="flex items-center gap-3"
              style={{ marginTop: "1rem" }}
            >
              <div className="flex -space-x-2">
                {["#6366f1", "#ec4899", "#f59e0b", "#10b981"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-navy-deep flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-white/60 text-sm">
                Đã có{" "}
                <span className="text-white font-semibold">
                  {applicantCount}
                </span>{" "}
                ứng viên ứng tuyển
              </span>
            </div>
          </div>

          {/* Right illustration - enhanced tech visual */}
          <div className="hidden lg:flex items-center justify-center w-80 h-72 relative shrink-0">
            {/* Main floating card */}
            <div
              className="w-52 h-52 rounded-2xl float-element"
              style={{
                background:
                  "linear-gradient(135deg, rgba(130,63,235,0.3), rgba(99,102,241,0.2))",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #823feb, #6366f1)",
                  }}
                >
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-xs font-medium">
                  Cơ hội nghề nghiệp
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div
              className="absolute top-0 right-2 w-12 h-12 rounded-lg float-element flex items-center justify-center"
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(255,255,255,0.08)",
                animationDelay: "1s",
              }}
            >
              <Braces className="w-5 h-5 text-indigo-400/60" />
            </div>
            <div
              className="absolute bottom-6 left-0 w-10 h-10 rounded-lg float-element flex items-center justify-center"
              style={{
                background: "rgba(130,63,235,0.2)",
                border: "1px solid rgba(255,255,255,0.08)",
                animationDelay: "2s",
              }}
            >
              <Code2 className="w-4 h-4 text-purple-400/60" />
            </div>
            <div
              className="absolute top-8 left-4 text-4xl text-white/8 font-mono float-element"
              style={{ animationDelay: "0.5s" }}
            >
              {"{ }"}
            </div>
            <div
              className="absolute bottom-2 right-6 text-2xl text-white/8 font-mono float-element"
              style={{ animationDelay: "1.5s" }}
            >
              {"</>"}
            </div>

            {/* Glowing dots */}
            <div className="absolute top-16 right-16 w-2 h-2 rounded-full bg-brand-light/30 animate-pulse" />
            <div
              className="absolute bottom-16 left-10 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobDetailHero;
