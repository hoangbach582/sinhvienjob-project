import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// Icon components cho từng loại thông báo
const ApprovedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "20px", width: "20px" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RejectedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "20px", width: "20px" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "20px", width: "20px" }}
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
);

const ApplicationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "20px", width: "20px" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Lấy icon + màu theo loại thông báo
const getNotificationMeta = (notification) => {
  const status = notification.data?.status;
  const type = notification.type || "";

  if (status === "approved") {
    return {
      icon: <ApprovedIcon />,
      bgColor: "#ECFDF5",
      iconColor: "#10B981",
      borderColor: "#A7F3D0",
      label: "Đã duyệt",
    };
  }
  if (status === "rejected") {
    return {
      icon: <RejectedIcon />,
      bgColor: "#FEF2F2",
      iconColor: "#EF4444",
      borderColor: "#FECACA",
      label: "Từ chối",
    };
  }
  if (type.includes("JobApplied") || type.includes("Application")) {
    return {
      icon: <ApplicationIcon />,
      bgColor: "#EFF6FF",
      iconColor: "#3B82F6",
      borderColor: "#BFDBFE",
      label: "Ứng tuyển",
    };
  }
  if (type.includes("AdminJobNotification")) {
    return {
      icon: <DefaultIcon />, // You can use a different icon if preferred
      bgColor: "#F5F3FF",
      iconColor: "#8B5CF6",
      borderColor: "#EDE9FE",
      label: "Việc làm mới",
    };
  }
  return {
    icon: <DefaultIcon />,
    bgColor: "#F3F4F6",
    iconColor: "#6B7280",
    borderColor: "#E5E7EB",
    label: "Thông báo",
  };
};

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, loading, unreadCount } =
    useNotifications();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const notificationsPageUrl =
    userRole === "employer"
      ? "/employer/notifications"
      : userRole === "admin"
        ? "/admin/jobs"
        : "/notifications";

  const handleNotificationClick = (notification) => {
    if (!notification.read_at) markAsRead(notification.id);
    if (notification.data?.action_url) {
      navigate(notification.data.action_url);
    }
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .notification-item:hover {
          background-color: #F9FAFB !important;
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          right: "0",
          marginTop: "8px",
          width: "380px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow:
            "0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          overflow: "hidden",
          zIndex: 1000,
          transformOrigin: "top right",
          animation: "dropdownSlide 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(to right, #F9FAFB, #FFFFFF)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3
              style={{
                margin: 0,
                fontWeight: "700",
                color: "#111827",
                fontSize: "16px",
              }}
            >
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  lineHeight: "1.4",
                }}
              >
                {unreadCount} mới
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                fontSize: "12px",
                color: "#10B981",
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                padding: "4px 10px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D1FAE5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ECFDF5";
              }}
            >
              Đọc tất cả
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ maxHeight: "420px", overflowY: "auto" }}>
          {loading && notifications.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "3px solid #F3F4F6",
                  borderTop: "3px solid #10B981",
                  borderRadius: "50%",
                  margin: "0 auto",
                  animation: "spin 0.8s linear infinite",
                }}
              ></div>
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#9CA3AF",
                  fontSize: "13px",
                }}
              >
                Đang tải thông báo...
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {notifications.slice(0, 8).map((notification) => {
                const meta = getNotificationMeta(notification);
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id}
                    className="notification-item"
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #F3F4F6",
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: isUnread ? "#FAFFFE" : "white",
                      transition: "background-color 0.15s ease",
                      borderLeft: isUnread
                        ? "3px solid #10B981"
                        : "3px solid transparent",
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          flexShrink: 0,
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: meta.bgColor,
                          color: meta.iconColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${meta.borderColor}`,
                        }}
                      >
                        {meta.icon}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#1F2937",
                              lineHeight: "1.5",
                              fontWeight: isUnread ? "600" : "400",
                              flex: 1,
                            }}
                          >
                            {notification.data?.message || "Thông báo mới"}
                          </p>
                          {isUnread && (
                            <span
                              style={{
                                flexShrink: 0,
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #10B981, #059669)",
                                marginTop: "6px",
                                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.15)",
                              }}
                            />
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "6px",
                          }}
                        >
                          {/* Status badge */}
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "600",
                              color: meta.iconColor,
                              backgroundColor: meta.bgColor,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              border: `1px solid ${meta.borderColor}`,
                              textTransform: "uppercase",
                              letterSpacing: "0.3px",
                            }}
                          >
                            {meta.label}
                          </span>

                          {/* Time */}
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#9CA3AF",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ height: "11px", width: "11px" }}
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
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true, locale: vi },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "32px", width: "32px", color: "#9CA3AF" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#6B7280",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Chưa có thông báo nào
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#9CA3AF",
                  fontSize: "12px",
                }}
              >
                Thông báo mới sẽ xuất hiện tại đây
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #F3F4F6",
            background: "linear-gradient(to right, #F9FAFB, #FFFFFF)",
            textAlign: "center",
          }}
        >
          <Link
            to={notificationsPageUrl}
            onClick={onClose}
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#10B981",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "8px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ECFDF5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Xem tất cả thông báo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "14px", width: "14px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
