/**
 * RecentJobsTable – Bảng hiển thị tối đa 5 tin tuyển dụng gần đây
 * Props:
 *   jobs      – array of job objects
 *   loading   – boolean
 *   filter    – string, lọc theo status (vd: 'approved', 'pending', null = all)
 *   onNavigate– callback(path) để điều hướng
 */
import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Eye, ArrowRight, FileSearch } from "lucide-react";
import { TableRowSkeleton } from "./SkeletonCard";

// Badge cho loại hình công việc
function TypeBadge({ type }) {
  const config = {
    full_time: { label: "Full-time", bg: "#DBEAFE", color: "#1D4ED8" },
    part_time: { label: "Part-time", bg: "#D1FAE5", color: "#065F46" },
    internship: { label: "Internship", bg: "#FEF3C7", color: "#92400E" },
    remote: { label: "Remote", bg: "#EDE9FE", color: "#5B21B6" },
  };
  const c = config[type] || { label: type, bg: "#F1F5F9", color: "#475569" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        letterSpacing: "0.2px",
      }}
    >
      {c.label}
    </span>
  );
}

// Badge cho trạng thái
function StatusBadge({ status }) {
  const config = {
    approved: { label: "Đang mở", bg: "#D1FAE5", color: "#065F46" },
    pending: { label: "Chờ duyệt", bg: "#FEF3C7", color: "#92400E" },
    closed: { label: "Đã đóng", bg: "#F1F5F9", color: "#475569" },
    rejected: { label: "Từ chối", bg: "#FEE2E2", color: "#991B1B" },
  };
  const c = config[status] || {
    label: status,
    bg: "#F1F5F9",
    color: "#475569",
  };

  // Chấm tròn nhỏ phía trước (chỉ cho trạng thái active)
  const dot = status === "approved" && (
    <span
      style={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#10B981",
        marginRight: "5px",
        animation: "pulse 2s infinite",
      }}
    />
  );

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
        background: c.bg,
        color: c.color,
      }}
    >
      {dot}
      {c.label}
    </span>
  );
}

// Empty state đẹp
function EmptyState() {
  return (
    <tr>
      <td colSpan={5}>
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileSearch size={28} color="#10B981" />
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              margin: 0,
            }}
          >
            Chưa có tin tuyển dụng nào
          </p>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Hãy đăng tin đầu tiên để bắt đầu tuyển dụng!
          </p>
          <Link to="/employer/post-job">
            <button
              style={{
                marginTop: "4px",
                padding: "8px 20px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Đăng tin ngay
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

function RecentJobsTable({ jobs = [], loading = false, filter = null }) {
  // Lọc theo filter nếu có
  const displayJobs = filter ? jobs.filter((j) => j.status === filter) : jobs;

  // Chỉ lấy tối đa 5 tin
  const topJobs = displayJobs.slice(0, 5);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header section */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              padding: "6px",
              background: "#D1FAE5",
              borderRadius: "8px",
            }}
          >
            <Briefcase size={16} color="#10B981" />
          </div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#0F172A",
              margin: 0,
            }}
          >
            Tin tuyển dụng gần đây
          </h3>
          {filter && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                background: "#FEF3C7",
                color: "#92400E",
                padding: "2px 8px",
                borderRadius: "20px",
              }}
            >
              Đang lọc
            </span>
          )}
        </div>
        <Link
          to="/employer/posted-jobs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#10B981",
            textDecoration: "none",
            transition: "gap 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "8px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "4px")}
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      {/* Bảng */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Vị trí
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "12px",
                }}
              >
                Loại hình
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "12px",
                }}
              >
                Hồ sơ
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "12px",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "right",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "12px",
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: 3 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))
            ) : topJobs.length === 0 ? (
              <EmptyState />
            ) : (
              topJobs.map((job, idx) => (
                <JobRow key={job.id ?? idx} job={job} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Row riêng để quản lý hover state
function JobRow({ job }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <tr
      style={{
        borderTop: "1px solid #F1F5F9",
        background: hovered ? "#F8FAFC" : "#fff",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tiêu đề */}
      <td style={{ padding: "12px 20px" }}>
        <span style={{ fontWeight: 600, color: "#0F172A", fontSize: "13px" }}>
          {job.title}
        </span>
        {job.deadline && (
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
            Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
          </div>
        )}
      </td>

      {/* Loại hình */}
      <td style={{ padding: "12px" }}>
        <TypeBadge type={job.type} />
      </td>

      {/* Số hồ sơ */}
      <td style={{ padding: "12px", textAlign: "center" }}>
        <span
          style={{
            fontWeight: 700,
            color: (job.applications_count ?? 0) > 0 ? "#10B981" : "#94A3B8",
            fontSize: "14px",
          }}
        >
          {job.applications_count ?? 0}
        </span>
      </td>

      {/* Trạng thái */}
      <td style={{ padding: "12px" }}>
        <StatusBadge status={job.status} />
      </td>

      {/* Nút xem */}
      <td style={{ padding: "12px 20px", textAlign: "right" }}>
        <Link to={`/employer/applicants?jobId=${job.id}`}>
          <button
            className="hover-lift ripple-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 12px",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              background: hovered ? "#10B981" : "#fff",
              color: hovered ? "#fff" : "#374151",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Eye size={12} />
            Xem chi tiết
          </button>
        </Link>
      </td>
    </tr>
  );
}

export default RecentJobsTable;
