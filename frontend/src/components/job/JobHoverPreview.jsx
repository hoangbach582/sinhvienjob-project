import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Building2,
  DollarSign,
  GraduationCap,
} from "lucide-react";

/**
 * JobHoverPreview
 * Rendered as a Portal so it escapes overflow/z-index stacking contexts.
 *
 * Props:
 *  - job          : the job object
 *  - anchorRef    : React ref pointing to the job card element
 *  - visible      : boolean — show or hide
 *  - formatSalary : formatter fn
 *  - translateType: formatter fn
 */
function JobHoverPreview({ job, anchorRef, visible, formatSalary, translateType, onMouseEnter, onMouseLeave }) {
  const previewRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [side, setSide] = useState("right"); // "right" | "left"

  useEffect(() => {
    if (!visible || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const previewWidth = 340;
      const gap = 12;
      const viewportWidth = window.innerWidth;

      // Try placing to the right
      if (rect.right + gap + previewWidth <= viewportWidth) {
        setSide("right");
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.right + gap,
        });
      } else {
        // Place to the left
        setSide("left");
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left - previewWidth - gap,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, [visible, anchorRef]);

  if (!job) return null;

  const skills = job.required_skills
    ? Array.isArray(job.required_skills)
      ? job.required_skills
      : job.required_skills.split(",").map((s) => s.trim())
    : [];

  const descLines = job.description
    ? job.description.split("\n").filter((l) => l.trim()).slice(0, 3)
    : [];

  const getTypeBadgeColor = (type) => {
    const map = {
      full_time: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399" },
      part_time: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24" },
      internship: { bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)", color: "#f472b6" },
    };
    return map[type] || { bg: "rgba(130,63,235,0.15)", border: "rgba(130,63,235,0.3)", color: "#a78bfa" };
  };

  const badge = getTypeBadgeColor(job.type);

  const slideVariant = {
    hidden: {
      opacity: 0,
      x: side === "right" ? -12 : 12,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 380, damping: 28 },
    },
    exit: {
      opacity: 0,
      x: side === "right" ? -8 : 8,
      scale: 0.97,
      transition: { duration: 0.15 },
    },
  };

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={previewRef}
          variants={slideVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            width: 340,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          {/* Arrow pointer */}
          <div
            style={{
              position: "absolute",
              top: 24,
              ...(side === "right"
                ? { left: -8, borderRight: "8px solid rgba(25,20,65,0.98)", borderTop: "8px solid transparent", borderBottom: "8px solid transparent" }
                : { right: -8, borderLeft: "8px solid rgba(25,20,65,0.98)", borderTop: "8px solid transparent", borderBottom: "8px solid transparent" }),
              width: 0,
              height: 0,
            }}
          />

          <div
            style={{
              background: "linear-gradient(145deg, rgba(22,16,70,0.98) 0%, rgba(14,10,50,0.99) 100%)",
              border: "1px solid rgba(130,63,235,0.35)",
              borderRadius: "1.25rem",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Top gradient bar */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg, #823feb, #6366f1, #3b82f6)",
              }}
            />

            <div style={{ padding: "1.25rem" }}>
              {/* Header: Logo + Title + Company */}
              <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "0.875rem",
                    background: "linear-gradient(135deg, rgba(130,63,235,0.35) 0%, rgba(99,102,241,0.25) 100%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 800,
                    color: "white",
                    flexShrink: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {job.employer?.logo_url ? (
                    <img
                      src={job.employer.logo_url.startsWith("http") ? job.employer.logo_url : `http://127.0.0.1:8000${job.employer.logo_url}`}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.75rem" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    job.employer?.company_name?.substring(0, 2).toUpperCase() || "CT"
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      margin: 0,
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {job.title}
                  </h4>
                  <p
                    style={{
                      color: "rgba(167,139,250,0.9)",
                      fontSize: "0.78rem",
                      margin: "0.25rem 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Building2 size={11} />
                    {job.employer?.company_name || "Đang cập nhật"}
                  </p>
                </div>

                {/* Type badge */}
                <span
                  style={{
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {translateType(job.type)}
                </span>
              </div>

              {/* Key Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  marginBottom: "0.875rem",
                }}
              >
                <InfoChip icon={<MapPin size={12} />} label={job.location || "Chưa rõ"} color="#60a5fa" />
                <InfoChip icon={<DollarSign size={12} />} label={formatSalary(job.salary_min, job.salary_max)} color="#fbbf24" />
                <InfoChip
                  icon={<Users size={12} />}
                  label={job.vacancies ? `${job.vacancies} người` : "Không giới hạn"}
                  color="#a78bfa"
                />
                <InfoChip
                  icon={<Calendar size={12} />}
                  label={job.deadline ? new Date(job.deadline).toLocaleDateString("vi-VN") : "Chưa rõ"}
                  color="#f87171"
                />
              </div>

              {/* Description snippet */}
              {descLines.length > 0 && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "0.75rem",
                    padding: "0.75rem",
                    marginBottom: "0.875rem",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.72rem",
                      margin: 0,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Mô tả nhanh
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {descLines.map((line, i) => (
                      <li
                        key={i}
                        style={{
                          color: "rgba(255,255,255,0.65)",
                          fontSize: "0.75rem",
                          lineHeight: 1.5,
                          display: "flex",
                          gap: "0.4rem",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            marginTop: "0.45rem",
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#823feb",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {line.replace(/^[-•*]\s*/, "")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div style={{ marginBottom: "0.875rem" }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      margin: "0 0 0.4rem",
                    }}
                  >
                    Kỹ năng yêu cầu
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {skills.slice(0, 5).map((sk, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(130,63,235,0.12)",
                          border: "1px solid rgba(130,63,235,0.25)",
                          color: "rgba(200,180,255,0.85)",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.4rem",
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                    {skills.length > 5 && (
                      <span
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.35)",
                          fontSize: "0.68rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.4rem",
                        }}
                      >
                        +{skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0.75rem 0" }} />

              {/* CTA */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  to={`/job/${job.id}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                  }}
                >
                  Chi tiết
                </Link>
                <Link
                  to={`/job/${job.id}?apply=true`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.75rem",
                    background: "linear-gradient(135deg, #823feb, #6366f1)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 16px rgba(130,63,235,0.35)",
                  }}
                >
                  Ứng tuyển <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Small info chip */
function InfoChip({ icon, label, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "0.5rem",
        padding: "0.35rem 0.6rem",
        minWidth: 0,
      }}
    >
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "0.72rem",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default JobHoverPreview;
