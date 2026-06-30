/**
 * QuickActions – Nút hành động nhanh nổi bật trên Dashboard
 * Props:
 *   onPostJob   – callback khi click "Đăng tin"
 *   onApplicants– callback khi click "Xem hồ sơ"
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, ChevronRight, Sparkles } from "lucide-react";

function ActionButton({
  icon: Icon,
  label,
  description,
  gradient,
  textColor,
  onClick,
  secondary,
}) {
  const [hovered, setHovered] = useState(false);

  if (secondary) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="hover-lift ripple-button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "14px 18px",
          background: hovered ? "#F8FAFC" : "#fff",
          border: "1.5px solid " + (hovered ? "#10B981" : "#E2E8F0"),
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              background: hovered ? "#ECFDF5" : "#F8FAFC",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <Icon size={18} color={hovered ? "#10B981" : "#64748B"} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#0F172A",
              }}
            >
              {label}
            </p>
            <p
              style={{ margin: "2px 0 0", fontSize: "12px", color: "#94A3B8" }}
            >
              {description}
            </p>
          </div>
        </div>
        <ChevronRight
          size={16}
          color={hovered ? "#10B981" : "#CBD5E1"}
          style={{
            transition: "transform 0.2s, color 0.2s",
            transform: hovered ? "translateX(4px)" : "none",
          }}
        />
      </button>
    );
  }

  // Primary button (gradient nổi bật)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hover-lift ripple-button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "18px 20px",
        background: hovered
          ? "linear-gradient(135deg, #059669, #047857)"
          : "linear-gradient(135deg, #10B981, #059669)",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered
          ? "0 8px 24px rgba(16, 185, 129, 0.4)"
          : "0 4px 12px rgba(16, 185, 129, 0.25)",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hiệu ứng shimmer trên primary button */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-60%",
          width: "40%",
          height: "200%",
          background: "rgba(255,255,255,0.12)",
          transform: "rotate(25deg)",
          pointerEvents: "none",
          transition: "left 0.5s ease",
          left: hovered ? "120%" : "-60%",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} color="#fff" />
        </div>
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {label}
            <Sparkles size={13} color="rgba(255,255,255,0.7)" />
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: "12px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <ChevronRight
        size={20}
        color="rgba(255,255,255,0.7)"
        style={{
          transition: "transform 0.2s",
          transform: hovered ? "translateX(4px)" : "none",
          flexShrink: 0,
        }}
      />
    </button>
  );
}

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#0F172A",
          margin: "0 0 16px",
        }}
      >
        ⚡ Thao tác nhanh
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Primary: Đăng tin mới */}
        <ActionButton
          icon={PlusCircle}
          label="Đăng tin tuyển dụng mới"
          description="Tiếp cận hàng nghìn sinh viên ngay hôm nay"
          onClick={() => navigate("/employer/post-job")}
        />

        {/* Secondary: Xem hồ sơ */}
        <ActionButton
          icon={Users}
          label="Xem hồ sơ ứng viên tiềm năng"
          description="Xem và quản lý tất cả đơn ứng tuyển"
          onClick={() => navigate("/employer/applicants")}
          secondary
        />
      </div>
    </div>
  );
}

export default QuickActions;
