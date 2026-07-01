import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchMyApplications = useCallback(async (page) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem trang này!");
      navigate("/login");
      return;
    }
    
    if (page === 1) setLoading(true);

    try {
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api')}/applications/me?page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (page === 1) {
          setApplications(result.data);
        } else {
          setApplications(prev => [...prev, ...result.data]);
        }
        setHasMore(page < result.last_page);
      } else {
        console.error("Lỗi khi tải lịch sử ứng tuyển");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      if (page === 1) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchMyApplications(1);
  }, [fetchMyApplications]);

  useEffect(() => {
    if (currentPage > 1) {
      // eslint-disable-next-line
      fetchMyApplications(currentPage);
    }
  }, [currentPage, fetchMyApplications]);

  const { lastElementRef, isFetching } = useInfiniteScroll(async () => {
    setCurrentPage(prev => prev + 1);
  }, hasMore);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        text: "Đang chờ duyệt",
        color: "#a5b4fc",
        bg: "rgba(99, 102, 241, 0.1)",
        border: "rgba(99, 102, 241, 0.2)",
        glow: "rgba(99, 102, 241, 0.15)",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 22h14" />
            <path d="M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          </svg>
        ),
      },
      reviewing: {
        text: "Đang xem xét",
        color: "#fbbf24",
        bg: "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.2)",
        glow: "rgba(245, 158, 11, 0.15)",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        ),
      },
      interview: {
        text: "Hẹn phỏng vấn",
        color: "#34d399",
        bg: "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.2)",
        glow: "rgba(16, 185, 129, 0.15)",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        ),
      },
      accepted: {
        text: "Trúng tuyển",
        color: "#4ade80",
        bg: "rgba(34, 197, 94, 0.1)",
        border: "rgba(34, 197, 94, 0.2)",
        glow: "rgba(34, 197, 94, 0.15)",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ),
      },
      rejected: {
        text: "Từ chối",
        color: "#f87171",
        bg: "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.2)",
        glow: "rgba(239, 68, 68, 0.15)",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ),
      },
    };

    return configs[status] || configs["pending"];
  };

  if (loading)
    return (
      <MainLayout>
        <div
          style={{
            backgroundColor: "#0B0F19",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#94a3b8" }}>Đang tải lịch sử ứng tuyển...</div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div
        style={{
          marginTop: "48px",
          backgroundColor: "#0B0F19",
          minHeight: "100vh",
          padding: "40px 0",
        }}
      >
        <div
          style={{ maxWidth: "1170px", margin: "0 auto", padding: "0 20px" }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a5b4fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  color: "#f8fafc",
                  margin: "0 0 4px 0",
                  fontWeight: 600,
                }}
              >
                Công việc đã ứng tuyển
              </h2>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
                Theo dõi trạng thái các công việc bạn đã ứng tuyển
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div
              style={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
                padding: "60px 40px",
                textAlign: "center",
                borderRadius: "16px",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "16px",
                  marginBottom: "16px",
                }}
              >
                Bạn chưa ứng tuyển công việc nào.
              </p>
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  borderRadius: "8px",
                  color: "#818cf8",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(99, 102, 241, 0.2)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "rgba(99, 102, 241, 0.1)")
                }
              >
                Khám phá việc làm ngay →
              </Link>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {applications.map((app) => {
                const config = getStatusConfig(app.status);

                return (
                  <div
                    key={app.id}
                    style={{
                      position: "relative",
                      background:
                        "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)",
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 35px -10px rgba(0, 0, 0, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px -10px rgba(0, 0, 0, 0.5)";
                    }}
                  >
                    {/* Glow effect */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "250px",
                        height: "250px",
                        background: `radial-gradient(circle at top right, ${config.glow}, transparent 70%)`,
                        pointerEvents: "none",
                      }}
                    ></div>

                    {/* Left: Logo */}
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "8px",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          app.job.employer?.logo_url
                            ? app.job.employer.logo_url.startsWith("http")
                              ? app.job.employer.logo_url
                              : `http://127.0.0.1:8000${app.job.employer.logo_url}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(app.job.employer?.company_name || "CT")}&background=random&color=fff&size=150`
                        }
                        alt={app.job.employer?.company_name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.job.employer?.company_name || "CT")}&background=random&color=fff&size=150`;
                        }}
                      />
                    </div>

                    {/* Middle: Info */}
                    <div style={{ flex: 1, zIndex: 1 }}>
                      <Link
                        to={`/job/${app.job.id}`}
                        style={{
                          fontSize: "18px",
                          color: "#f8fafc",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#818cf8")}
                        onMouseLeave={(e) => (e.target.style.color = "#f8fafc")}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a5b4fc"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        {app.job.title}
                      </Link>

                      <div
                        style={{
                          display: "flex",
                          gap: "24px",
                          color: "#94a3b8",
                          fontSize: "14px",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          {app.job.employer?.company_name || "Đang cập nhật"}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Đã nộp:{" "}
                          {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            fontSize: "12px",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {app.job.job_type || "Full-time"}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            fontSize: "12px",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {app.job.location || "Hà Nội"}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            fontSize: "12px",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="2"
                              y="7"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          {app.job.category || "Đồ họa"}
                        </span>
                      </div>
                    </div>

                    {/* Right: Badge & Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 16px",
                          borderRadius: "100px",
                          backgroundColor: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                          fontSize: "14px",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {config.icon}
                        {config.text}
                      </div>

                      <button
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#cbd5e1",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.05)";
                          e.currentTarget.style.color = "#cbd5e1";
                        }}
                        onClick={() => navigate(`/job/${app.job.id}`)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {hasMore && !loading && (
            <div ref={lastElementRef} className="flex justify-center py-8">
              {isFetching && (
                <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AppliedJobs;
