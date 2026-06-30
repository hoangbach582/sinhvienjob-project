import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Briefcase, CheckCircle, Bookmark, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/student/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <MainLayout>
      <div
        className="w-full h-full min-h-screen"
        style={{
          background: "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
          textAlign: "center",
          padding: "100px",
          color: "#94a3b8",
        }}
      >
        Đang tải dữ liệu...
      </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className="w-full h-full min-h-screen"
        style={{
          background: "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}
        >
        <h1
          style={{
            fontSize: "28px",
            color: "#f8fafc",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          Tổng quan hoạt động
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          Theo dõi quá trình ứng tuyển và các công việc đã lưu của bạn.
        </p>

        {/* Thống kê Card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <Briefcase size={28} />
            </div>
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Số đơn đã nộp
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#f8fafc",
                }}
              >
                {stats?.total_applications || 0}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <CheckCircle size={28} />
            </div>
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Được chấp nhận
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#f8fafc",
                }}
              >
                {stats?.accepted_applications || 0}
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <Bookmark size={28} />
            </div>
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Việc làm đã lưu
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#f8fafc",
                }}
              >
                {stats?.saved_jobs_count || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
          }}
        >
          {/* Cột trái: Ứng tuyển gần đây */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={20} color="#6366f1" />
                Ứng tuyển gần đây
              </h2>
              <Link
                to="/applications"
                style={{
                  color: "#6366f1",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Xem tất cả
              </Link>
            </div>

            {stats?.recent_applications &&
            stats.recent_applications.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {stats.recent_applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.02)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: "#f8fafc",
                          fontSize: "16px",
                          margin: "0 0 6px 0",
                          fontWeight: "600",
                        }}
                      >
                        {app.job?.title || "Việc làm không còn tồn tại"}
                      </h4>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "14px",
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {app.job?.employer?.company?.company_name ||
                            "Công ty ẩn danh"}
                        </span>
                        <span style={{ fontSize: "10px" }}>•</span>
                        <span>
                          {formatDistanceToNow(new Date(app.created_at), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "500",
                          backgroundColor:
                            app.status === "accepted"
                              ? "rgba(16, 185, 129, 0.1)"
                              : app.status === "rejected"
                                ? "rgba(239, 68, 68, 0.1)"
                                : "rgba(245, 158, 11, 0.1)",
                          color:
                            app.status === "accepted"
                              ? "#10b981"
                              : app.status === "rejected"
                                ? "#ef4444"
                                : "#f59e0b",
                        }}
                      >
                        {app.status === "accepted"
                          ? "Được nhận"
                          : app.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "40px 0",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Bạn chưa nộp đơn ứng tuyển nào.
              </div>
            )}
          </div>

          {/* Cột phải: Gợi ý */}
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#f8fafc",
                marginBottom: "20px",
              }}
            >
              Mẹo dành cho bạn
            </h2>
            <div
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px dashed rgba(99, 102, 241, 0.3)",
                flex: 1,
              }}
            >
              <h4
                style={{
                  color: "#818cf8",
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                }}
              >
                Hoàn thiện hồ sơ
              </h4>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0 0 20px 0",
                }}
              >
                Những hồ sơ có đầy đủ kỹ năng và dự án cá nhân có tỷ lệ được nhà
                tuyển dụng chú ý cao hơn 70%.
              </p>
              <Link
                to="/profile"
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "#6366f1",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cập nhật ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}

export default StudentDashboard;
