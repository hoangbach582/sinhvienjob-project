import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// Icons
const ApprovedIcon = () => (
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RejectedIcon = () => (
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
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DefaultIcon = () => (
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
);

const ApplicationIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

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
      labelBg: "#D1FAE5",
    };
  }
  if (status === "rejected") {
    return {
      icon: <RejectedIcon />,
      bgColor: "#FEF2F2",
      iconColor: "#EF4444",
      borderColor: "#FECACA",
      label: "Từ chối",
      labelBg: "#FEE2E2",
    };
  }
  if (type.includes("JobApplied") || type.includes("Application")) {
    return {
      icon: <ApplicationIcon />,
      bgColor: "#EFF6FF",
      iconColor: "#3B82F6",
      borderColor: "#BFDBFE",
      label: "Ứng tuyển",
      labelBg: "#DBEAFE",
    };
  }
  return {
    icon: <DefaultIcon />,
    bgColor: "#F3F4F6",
    iconColor: "#6B7280",
    borderColor: "#E5E7EB",
    label: "Thông báo",
    labelBg: "#F3F4F6",
  };
};

const EmployerNotifications = () => {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
    unreadCount,
  } = useNotifications();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, approved, rejected
  const navigate = useNavigate();

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await fetchNotifications(nextPage);
    if (data && data.next_page_url) {
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read_at;
    if (filter === "approved") return n.data?.status === "approved";
    if (filter === "rejected") return n.data?.status === "rejected";
    return true;
  });

  const filterButtons = [
    { key: "all", label: "Tất cả", count: notifications.length },
    { key: "unread", label: "Chưa đọc", count: unreadCount },
    {
      key: "approved",
      label: "Đã duyệt",
      count: notifications.filter((n) => n.data?.status === "approved").length,
    },
    {
      key: "rejected",
      label: "Từ chối",
      count: notifications.filter((n) => n.data?.status === "rejected").length,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
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
                fontSize: "24px",
                fontWeight: "800",
                color: "#0F172A",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "22px", width: "22px", color: "white" }}
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
              </span>
              Thông báo
            </h1>
            <p
              style={{
                color: "#64748B",
                marginTop: "6px",
                fontSize: "14px",
                marginLeft: "52px",
              }}
            >
              Cập nhật trạng thái tin tuyển dụng và hoạt động mới
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                color: "#059669",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D1FAE5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ECFDF5";
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
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            marginLeft: "52px",
            flexWrap: "wrap",
          }}
        >
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border:
                  filter === btn.key
                    ? "1px solid #10B981"
                    : "1px solid #E2E8F0",
                backgroundColor: filter === btn.key ? "#ECFDF5" : "#fff",
                color: filter === btn.key ? "#059669" : "#64748B",
                fontWeight: filter === btn.key ? "600" : "400",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {btn.label}
              {btn.count > 0 && (
                <span
                  style={{
                    backgroundColor: filter === btn.key ? "#10B981" : "#E2E8F0",
                    color: filter === btn.key ? "white" : "#64748B",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "1px 6px",
                    borderRadius: "9999px",
                    lineHeight: "1.4",
                  }}
                >
                  {btn.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        {filteredNotifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredNotifications.map((notification) => {
              const meta = getNotificationMeta(notification);
              const isUnread = !notification.read_at;

              return (
                <div
                  key={notification.id}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #F1F5F9",
                    position: "relative",
                    display: "flex",
                    gap: "16px",
                    backgroundColor: isUnread ? "#FAFFFE" : "white",
                    borderLeft: isUnread
                      ? "4px solid #10B981"
                      : "4px solid transparent",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isUnread
                      ? "#FAFFFE"
                      : "white";
                  }}
                  onClick={() => {
                    if (!notification.read_at) markAsRead(notification.id);
                    if (notification.data?.action_url)
                      navigate(notification.data.action_url);
                  }}
                >
                  {/* Icon */}
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: meta.bgColor,
                        color: meta.iconColor,
                        border: `1px solid ${meta.borderColor}`,
                      }}
                    >
                      {meta.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            color: "#1E293B",
                            lineHeight: "1.5",
                            fontWeight: isUnread ? "600" : "400",
                          }}
                        >
                          {notification.data?.message || "Thông báo mới"}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Status badge */}
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: meta.iconColor,
                              backgroundColor: meta.bgColor,
                              padding: "3px 8px",
                              borderRadius: "6px",
                              border: `1px solid ${meta.borderColor}`,
                            }}
                          >
                            {meta.label}
                          </span>

                          {/* Job title */}
                          {notification.data?.job_title && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748B",
                                fontWeight: "500",
                              }}
                            >
                              {notification.data.job_title}
                            </span>
                          )}

                          {/* Time */}
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#94A3B8",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ height: "12px", width: "12px" }}
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

                      {/* Action buttons */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexShrink: 0,
                        }}
                      >
                        {isUnread && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            title="Đánh dấu đã đọc"
                            style={{
                              padding: "6px",
                              backgroundColor: "#ECFDF5",
                              border: "1px solid #A7F3D0",
                              borderRadius: "8px",
                              cursor: "pointer",
                              color: "#10B981",
                              transition: "all 0.15s",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#D1FAE5";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#ECFDF5";
                            }}
                          >
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Xóa thông báo"
                          style={{
                            padding: "6px",
                            backgroundColor: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: "8px",
                            cursor: "pointer",
                            color: "#EF4444",
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#FEE2E2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FEF2F2";
                          }}
                        >
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
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load more */}
            {hasMore && filter === "all" && (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  style={{
                    padding: "10px 28px",
                    border: "1px solid #10B981",
                    color: "#10B981",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ECFDF5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  {loading ? "Đang tải..." : "Xem thêm thông báo"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: "80px 24px", textAlign: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "40px", width: "40px", color: "#10B981" }}
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
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1E293B",
                margin: 0,
              }}
            >
              {filter === "all"
                ? "Chưa có thông báo nào"
                : "Không có thông báo phù hợp"}
            </h3>
            <p style={{ color: "#94A3B8", marginTop: "8px", fontSize: "14px" }}>
              {filter === "all"
                ? "Khi có tin tuyển dụng được duyệt hoặc có ứng viên mới, thông báo sẽ xuất hiện tại đây."
                : "Hãy thử chọn bộ lọc khác để xem thông báo."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerNotifications;
