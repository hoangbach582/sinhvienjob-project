import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

const Notifications = () => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
  } = useNotifications();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.read_at);

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await fetchNotifications(nextPage);
    if (data && data.next_page_url) {
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar />

      <main
        style={{
          flexGrow: 1,
          margin: "58px auto",
          width: "100%",
          maxWidth: "896px",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Thông báo của bạn
              </h1>
              <p style={{ color: "#6B7280", marginTop: "4px" }}>
                Cập nhật những tin tức mới nhất về công việc và ứng tuyển
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              style={{
                padding: "8px 16px",
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                color: "#374151",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "16px", width: "16px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Đánh dấu tất cả là đã đọc
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              borderBottom: "1px solid #E5E7EB",
              paddingBottom: "8px",
            }}
          >
            <button
              onClick={() => setActiveTab("all")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                color: activeTab === "all" ? "#2563EB" : "#6B7280",
                borderBottom:
                  activeTab === "all" ? "2px solid #2563EB" : "none",
                paddingBottom: "8px",
              }}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                color: activeTab === "unread" ? "#2563EB" : "#6B7280",
                borderBottom:
                  activeTab === "unread" ? "2px solid #2563EB" : "none",
                paddingBottom: "8px",
              }}
            >
              Chưa đọc
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #F3F4F6",
            overflow: "hidden",
          }}
        >
          {filteredNotifications.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #F3F4F6",
                    position: "relative",
                    display: "flex",
                    gap: "16px",
                    backgroundColor: !notification.read_at
                      ? "#F0F7FF"
                      : "white",
                    transition: "background-color 0.2s",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: !notification.read_at
                          ? "#DBEAFE"
                          : "#F3F4F6",
                        color: !notification.read_at ? "#2563EB" : "#9CA3AF",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ height: "24px", width: "24px" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Link
                        to={notification.data.action_url || "#"}
                        onClick={() =>
                          !notification.read_at && markAsRead(notification.id)
                        }
                        style={{
                          fontSize: "18px",
                          color: "#1F2937",
                          textDecoration: "none",
                          display: "block",
                          marginBottom: "4px",
                          fontWeight: !notification.read_at ? "700" : "500",
                          lineHeight: "1.25",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#2563EB")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#1F2937")
                        }
                      >
                        {notification.data.message}
                      </Link>
                      {!notification.read_at && (
                        <span
                          style={{
                            backgroundColor: "#2563EB",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            marginTop: "8px",
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#9CA3AF",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ height: "16px", width: "16px" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginTop: "12px",
                      }}
                    >
                      {!notification.read_at && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            fontSize: "14px",
                            color: "#2563EB",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          fontSize: "14px",
                          color: "#EF4444",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    style={{
                      padding: "8px 24px",
                      border: "1px solid #2563EB",
                      color: "#2563EB",
                      backgroundColor: "white",
                      borderRadius: "9999px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#EFF6FF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {loading ? "Đang tải..." : "Xem thêm thông báo"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "80px", textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "#F3F4F6",
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "48px", width: "48px", color: "#D1D5DB" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#374151",
                  margin: 0,
                }}
              >
                Hộp thư thông báo trống
              </h3>
              <p style={{ color: "#9CA3AF", marginTop: "8px" }}>
                Bạn chưa có bất kỳ thông báo nào lúc này.
              </p>
              <Link
                to="/jobs"
                style={{
                  marginTop: "32px",
                  display: "inline-block",
                  padding: "12px 32px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  borderRadius: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)",
                }}
              >
                Khám phá việc làm ngay
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
