import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const prevCountRef = useRef(unreadCount);

  // Animation khi có thông báo mới
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Keyframe animations inline */}
      <style>{`
        @keyframes bellShake {
          0% { transform: rotate(0); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-14deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          75% { transform: rotate(4deg); }
          100% { transform: rotate(0); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: translate(50%, -50%) scale(1); }
          50% { transform: translate(50%, -50%) scale(1.2); }
        }
        @keyframes bellGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.15); }
        }
      `}</style>

      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="notification-bell-button"
          style={{
            position: "relative",
            padding: "10px",
            color: "#6B7280",
            backgroundColor: isOpen ? "#F3F4F6" : "transparent",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
            animation: isAnimating
              ? "bellShake 0.6s ease-in-out, bellGlow 1s ease-in-out"
              : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F3F4F6";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: "22px", width: "22px" }}
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
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1px 5px",
                fontSize: "10px",
                fontWeight: "700",
                lineHeight: "1",
                color: "white",
                transform: "translate(50%, -50%)",
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                borderRadius: "9999px",
                minWidth: "18px",
                height: "18px",
                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.4)",
                animation: isAnimating
                  ? "badgePulse 0.6s ease-in-out 2"
                  : "none",
                border: "2px solid white",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
      </div>
    </>
  );
};

export default NotificationBell;
