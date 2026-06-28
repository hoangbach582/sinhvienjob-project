/**
 * SkeletonCard – Hiển thị shimmer loading placeholder cho StatCard
 * Sử dụng animation shimmer đã khai báo trong index.css
 */
import React from "react";

const shimmerStyle = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite",
  borderRadius: "8px",
};

// Skeleton cho 1 stat card
export function StatCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ ...shimmerStyle, height: "14px", width: "60%" }} />
        <div
          style={{
            ...shimmerStyle,
            height: "36px",
            width: "36px",
            borderRadius: "10px",
          }}
        />
      </div>
      <div style={{ ...shimmerStyle, height: "32px", width: "40%" }} />
      <div style={{ ...shimmerStyle, height: "12px", width: "50%" }} />
    </div>
  );
}

// Skeleton cho 1 dòng bảng
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "12px" }}>
          <div
            style={{
              ...shimmerStyle,
              height: "14px",
              width: i === 0 ? "70%" : "50%",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// Skeleton cho activity item
export function ActivityItemSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          ...shimmerStyle,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div style={{ ...shimmerStyle, height: "13px", width: "80%" }} />
        <div style={{ ...shimmerStyle, height: "11px", width: "30%" }} />
      </div>
    </div>
  );
}

export default { StatCardSkeleton, TableRowSkeleton, ActivityItemSkeleton };
