/**
 * StatCard – Card thống kê KPI cho Employer Dashboard
 * Props:
 *   icon       – React element (Lucide icon)
 *   label      – Tên chỉ số (VD: "Tin đang hoạt động")
 *   value      – Giá trị hiển thị (số)
 *   trend      – % tăng/giảm so với tháng trước (VD: 12.5)
 *   trendUp    – boolean, true = tăng (xanh), false = giảm (đỏ)
 *   color      – Màu accent (VD: "#10b981")
 *   bgColor    – Màu nền nhạt của icon container
 *   onClick    – Callback khi click vào card
 *   active     – boolean, card đang được chọn/active
 */
import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color,
  bgColor,
  onClick,
  active,
}) {
  const [hovered, setHovered] = useState(false);

  // Style động dựa trên hover và active state
  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${active ? color : hovered ? color + "60" : "#E2E8F0"}`,
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s ease",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
    boxShadow: hovered
      ? `0 8px 24px ${color}25`
      : active
        ? `0 4px 12px ${color}20`
        : "0 1px 3px rgba(0,0,0,0.06)",
    position: "relative",
    overflow: "hidden",
  };

  // Vạch màu bên trái (accent line)
  const accentLine = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
    background: color,
    borderRadius: "16px 0 0 16px",
    opacity: active || hovered ? 1 : 0,
    transition: "opacity 0.2s ease",
  };

  // Badge "Đang xem" khi active
  const activeBadge = active && (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: color + "15",
        color: color,
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "20px",
        border: `1px solid ${color}30`,
      }}
    >
      Đang lọc
    </div>
  );

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : undefined}
      aria-pressed={active}
    >
      {/* Accent line bên trái */}
      <div style={accentLine} />

      {activeBadge}

      {/* Row 1: Label + Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#64748B" }}>
          {label}
        </span>
        <div
          style={{
            padding: "8px",
            background: bgColor || color + "18",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
            transform: hovered
              ? "rotate(-5deg) scale(1.1)"
              : "rotate(0deg) scale(1)",
          }}
        >
          {icon}
        </div>
      </div>

      {/* Row 2: Giá trị số lớn */}
      <div
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "#0F172A",
          letterSpacing: "-0.5px",
          lineHeight: 1,
          marginBottom: "10px",
        }}
      >
        {value ?? "–"}
      </div>

      {/* Row 3: Trend indicator */}
      {trend !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: trendUp ? "#10B981" : "#EF4444",
            fontWeight: 500,
          }}
        >
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(trend)}% so với tháng trước</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
