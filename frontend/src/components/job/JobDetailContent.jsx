import React from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Star,
  Building2,
  Users,
  Calendar,
  ChevronRight,
  GraduationCap,
  Clock,
  Award,
  Eye,
  UserCheck,
  Briefcase,
} from "lucide-react";

function JobDetailContent({ job }) {
  const skills = job.required_skills || [
    "ReactJS",
    "JavaScript",
    "HTML/CSS",
    "Git",
  ];

  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: job.applications_count || 0,
      label: "Đã ứng tuyển",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: job.deadline ? new Date(job.deadline).toLocaleDateString("vi-VN") : "Không thời hạn",
      label: "Hạn nộp",
      color: "#10b981",
      bg: "rgba(16,185,129,0.12)",
    },
  ];

  // Shared card style
  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    borderRadius: "1rem",
    padding: "1.5rem",
  };

  const cardStyleLg = {
    ...cardStyle,
    padding: "1.5rem 2rem",
  };

  return (
    <section
      style={{
        padding: "2.5rem 2rem",
        background: "linear-gradient(180deg, #0d1040 0%, #09144B 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        {/* === TWO-COLUMN: Left Sidebar + Right Main Content === */}
        <div
          style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
          className="flex-col lg:flex-row"
        >
          {/* LEFT SIDEBAR */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
            className="w-full lg:w-80 order-2 lg:order-1"
          >
            {/* Company Info Card */}
            <div style={cardStyle}>
              <h3
                className="text-white font-semibold text-base flex items-center gap-2"
                style={{ marginBottom: "1.25rem" }}
              >
                <Building2 className="w-4 h-4 text-brand-light" /> Thông tin
                công ty
              </h3>
              <div
                className="flex items-center gap-4"
                style={{ marginBottom: "1.25rem" }}
              >
                <div
                  className="flex items-center justify-center text-lg font-bold shrink-0"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "0.75rem",
                    background:
                      "linear-gradient(135deg, rgba(130,63,235,0.3), rgba(99,102,241,0.2))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {job.employer?.company_name?.substring(0, 2).toUpperCase() ||
                    "CT"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">
                      {job.employer?.company_name || "Đang cập nhật"}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    style={{ marginTop: "0.25rem" }}
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">
                      4.8
                    </span>
                    <span className="text-white/40 text-xs">
                      (120 đánh giá)
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "1.25rem",
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> 5,000+ nhân viên
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Ngân hàng / Tài chính
                </div>
              </div>
              <div
                style={{
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    Hạn nộp hồ sơ
                  </span>
                  <span className="text-red-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />{" "}
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("vi-VN")
                      : "31/05/2026"}
                  </span>
                </div>
              </div>
              <Link
                to={job.employer?.id ? `/companies/${job.employer.id}` : "#"}
                className="no-underline hover-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  borderRadius: "0.75rem",
                  padding: "0.625rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  marginTop: "0.5rem",
                  transition: "opacity 0.2s",
                }}
              >
                Xem công ty <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Job Overview Card */}
            <div style={cardStyle}>
              <h3
                className="text-white font-semibold text-base flex items-center gap-2"
                style={{ marginBottom: "1.25rem" }}
              >
                <Award className="w-4 h-4 text-brand-light" /> Tổng quan công
                việc
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Cấp bậc",
                    value: "Intern",
                    icon: <GraduationCap className="w-4 h-4" />,
                  },
                  {
                    label: "Kinh nghiệm",
                    value: job.experience || "Không yêu cầu",
                    icon: <Clock className="w-4 h-4" />,
                  },
                  {
                    label: "Số lượng tuyển",
                    value: job.vacancies
                      ? `${job.vacancies} người`
                      : "Không giới hạn",
                    icon: <Users className="w-4 h-4" />,
                  },
                  {
                    label: "Địa điểm làm việc",
                    value: job.location || "Chưa cập nhật",
                    icon: <Building2 className="w-4 h-4" />,
                  },
                  {
                    label: "Địa chỉ cụ thể",
                    value: job.specific_address || "Chưa cập nhật",
                    icon: <UserCheck className="w-4 h-4" />,
                  },
                  {
                    label: "Thời gian làm việc",
                    value: job.working_hours || "Chưa cập nhật",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {item.icon} {item.label}
                    </span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
            className="w-full order-1 lg:order-2"
          >
            {/* Job Description */}
            <div style={cardStyleLg}>
              <h3
                className="text-white font-semibold text-lg flex items-center gap-2"
                style={{ marginBottom: "1rem" }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "20px",
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, #823feb, #6366f1)",
                  }}
                />
                <Briefcase className="w-4 h-4 text-brand-light" />
                Mô tả công việc
              </h3>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              >
                {job.description ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {job.description
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((line, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              marginTop: "0.5rem",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: "#823feb",
                            }}
                          />
                          <span>{line.replace(/^[-•*]\s*/, "")}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  "Chưa có mô tả"
                )}
              </div>
            </div>

            {/* Requirements */}
            <div style={cardStyleLg}>
              <h3
                className="text-white font-semibold text-lg flex items-center gap-2"
                style={{ marginBottom: "1rem" }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "20px",
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, #823feb, #6366f1)",
                  }}
                />
                <GraduationCap className="w-4 h-4 text-brand-light" />
                Yêu cầu ứng viên
              </h3>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              >
                {job.requirements ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {job.requirements
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((line, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              marginTop: "0.5rem",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: "#823feb",
                            }}
                          />
                          <span>{line.replace(/^[-•*]\s*/, "")}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  "Chưa có yêu cầu"
                )}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div style={cardStyleLg}>
                <h3
                  className="text-white font-semibold text-lg flex items-center gap-2"
                  style={{ marginBottom: "1rem" }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "20px",
                      borderRadius: "999px",
                      background: "linear-gradient(180deg, #10b981, #059669)",
                    }}
                  />
                  <Star className="w-4 h-4 text-emerald-400" />
                  Quyền lợi
                </h3>
                <div
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {job.benefits
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((line, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              marginTop: "0.5rem",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: "#10b981",
                            }}
                          />
                          <span>{line.replace(/^[-•*]\s*/, "")}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Skills */}
            <div style={cardStyleLg}>
              <h3
                className="text-white font-semibold text-lg flex items-center gap-2"
                style={{ marginBottom: "1rem" }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "20px",
                    borderRadius: "999px",
                    background: "linear-gradient(180deg, #f59e0b, #f97316)",
                  }}
                />
                <Award className="w-4 h-4 text-amber-400" />
                Kỹ năng
              </h3>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}
              >
                {(Array.isArray(skills) ? skills : skills.split(",")).map(
                  (skill, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "0.625rem 1.25rem",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.8)",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        transition: "all 0.2s",
                      }}
                    >
                      {typeof skill === "string" ? skill.trim() : skill}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === QUICK STATS BAR (Replaces old Thống kê công việc) === */}
        <div style={{ ...cardStyleLg, marginTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            }}
            className="flex-wrap"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: "0.75rem",
                  padding: "1.25rem 2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: s.bg,
                  border: `1px solid ${s.color}22`,
                  minWidth: "250px",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: `${s.color}25`,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="text-white font-bold"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.875rem",
                      marginTop: "0.125rem",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobDetailContent;
