/**
 * ActivityFeed – Danh sách 5 hoạt động gần đây nhất
 * Props:
 *   activities – array of activity objects:
 *     { id, type, message, time, actor }
 *   loading    – boolean
 */
import React from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Bell,
  Briefcase,
  UserCheck,
  Clock,
} from "lucide-react";
import { ActivityItemSkeleton } from "./SkeletonCard";

// Map type → icon và màu
const ACTIVITY_CONFIG = {
  new_application: {
    icon: FileText,
    color: "#3B82F6",
    bg: "#EFF6FF",
    label: "Hồ sơ mới",
  },
  job_approved: {
    icon: CheckCircle,
    color: "#10B981",
    bg: "#ECFDF5",
    label: "Tin được duyệt",
  },
  job_rejected: {
    icon: XCircle,
    color: "#EF4444",
    bg: "#FEF2F2",
    label: "Tin bị từ chối",
  },
  application_hired: {
    icon: UserCheck,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    label: "Đã tuyển",
  },
  new_job_posted: {
    icon: Briefcase,
    color: "#F59E0B",
    bg: "#FFFBEB",
    label: "Đăng tin mới",
  },
  default: { icon: Bell, color: "#64748B", bg: "#F8FAFC", label: "Thông báo" },
};

// Format thời gian tương đối (VD: "2 giờ trước")
function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

// Empty state
function EmptyActivity() {
  return (
    <div
      style={{
        padding: "32px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Clock size={32} color="#CBD5E1" />
      <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
        Chưa có hoạt động nào gần đây
      </p>
    </div>
  );
}

// 1 item activity
function ActivityItem({ activity }) {
  const [hovered, setHovered] = React.useState(false);
  const cfg = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.default;
  const IconComponent = cfg.icon;

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "12px 16px",
        borderRadius: "10px",
        background: hovered ? "#F8FAFC" : "transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon circle */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: cfg.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: `1px solid ${cfg.color}20`,
        }}
      >
        <IconComponent size={16} color={cfg.color} />
      </div>

      {/* Nội dung */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#374151",
            fontWeight: 500,
            lineHeight: "1.4",
            // Truncate dài quá 2 dòng
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {activity.message}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94A3B8" }}>
          {formatRelativeTime(activity.time)}
        </p>
      </div>

      {/* Type label nhỏ */}
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: cfg.color,
          background: cfg.bg,
          padding: "2px 7px",
          borderRadius: "20px",
          flexShrink: 0,
          alignSelf: "center",
        }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

function ActivityFeed({ activities = [], loading = false }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            padding: "6px",
            background: "#EFF6FF",
            borderRadius: "8px",
          }}
        >
          <Bell size={16} color="#3B82F6" />
        </div>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#0F172A",
            margin: 0,
          }}
        >
          Hoạt động gần đây
        </h3>
      </div>

      {/* List */}
      <div style={{ padding: "8px" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <ActivityItemSkeleton key={i} />
          ))
        ) : activities.length === 0 ? (
          <EmptyActivity />
        ) : (
          activities
            .slice(0, 5)
            .map((act, idx) => (
              <ActivityItem key={act.id ?? idx} activity={act} />
            ))
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;
