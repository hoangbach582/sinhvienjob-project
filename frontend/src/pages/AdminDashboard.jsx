import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  ChevronRight,
  Award,
  Building2,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import ComparisonChart from "../components/admin/charts/ComparisonChart";
import TrendLineChart from "../components/admin/charts/TrendLineChart";
import IndustryBarChart from "../components/admin/charts/IndustryBarChart";
import JobTypePieChart from "../components/admin/charts/JobTypePieChart";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({ range: "month" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      const response = await axios.get(`${API_BASE_URL}/admin/reports/stats`, {
        params: filter,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter.range]);

  const handleExport = async (format) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      const response = await axios.get(`${API_BASE_URL}/admin/reports/export`, {
        params: { ...filter, type: format },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `report_${Date.now()}.${format === "excel" ? "xlsx" : "pdf"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Đang chuẩn bị tệp xuất...");
    } catch {
      toast.error("Lỗi khi xuất báo cáo");
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <RefreshCw className="animate-spin text-indigo-500 mb-3" size={32} />
        <span className="text-slate-500 font-medium text-sm">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  const {
    overview,
    month_comparison,
    trends,
    by_industry,
    by_job_type,
    top_companies,
    top_students,
  } = data || {};

  const statCards = [
    {
      icon: <Users size={20} />,
      label: "Người dùng",
      value: (overview?.total_students || 0) + (overview?.total_employers || 0),
      sub: `${overview?.total_students || 0} SV · ${overview?.total_employers || 0} NTL`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-100",
      trend: "+12%",
      up: true,
    },
    {
      icon: <Briefcase size={20} />,
      label: "Tin tuyển dụng",
      value: overview?.total_jobs || 0,
      sub: `Duyệt: ${overview?.approval_rate || 0}%`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      trend: "+5%",
      up: true,
    },
    {
      icon: <FileText size={20} />,
      label: "Đơn ứng tuyển",
      value: overview?.total_applications || 0,
      sub: "Tổng lượt nộp hồ sơ",
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-100",
      trend: "-2%",
      up: false,
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Đã được nhận",
      value: overview?.total_hired || 0,
      sub: `Chuyển đổi: ${overview?.conversion_rate || 0}%`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      ring: "ring-indigo-100",
      trend: "+8%",
      up: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Báo cáo & Thống kê
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Tổng quan hoạt động hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filter.range}
            onChange={(e) => setFilter({ range: e.target.value })}
            className="bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none cursor-pointer shadow-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
          </select>
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-3.5 rounded-xl shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap cursor-pointer"
          >
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.06,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center ring-1 ${card.ring} shrink-0`}
              >
                {card.icon}
              </div>
              <span
                className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  card.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-500"
                }`}
              >
                {card.up ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {card.trend}
              </span>
            </div>
            <div className="text-[22px] font-black text-slate-800 tracking-tight tabular-nums leading-none">
              {card.value.toLocaleString("vi-VN")}
            </div>
            <div className="text-[12.5px] font-semibold text-slate-600 mt-1">
              {card.label}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          title="So sánh tháng này vs tháng trước"
          icon={<BarChart3 size={16} className="text-slate-400" />}
        >
          <ComparisonChart data={month_comparison} />
        </ChartCard>
        <ChartCard
          title="Xu hướng tuyển dụng & ứng tuyển"
          icon={<TrendingUp size={16} className="text-slate-400" />}
        >
          <TrendLineChart data={trends} />
        </ChartCard>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          title="Top ngành nghề hot nhất"
          icon={<Layers size={16} className="text-slate-400" />}
        >
          <IndustryBarChart data={by_industry} />
        </ChartCard>
        <ChartCard
          title="Hình thức làm việc"
          icon={<PieChart size={16} className="text-slate-400" />}
        >
          <JobTypePieChart data={by_job_type} />
        </ChartCard>
      </div>

      {/* RANKINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Companies */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Building2 size={16} className="text-slate-400" />
              <h3 className="text-[14px] font-bold text-slate-800">
                Top 5 Công ty tích cực
              </h3>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {top_companies?.map((co, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-300 w-4 text-center shrink-0">
                  {idx + 1}
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {co.company_name?.[0]?.toUpperCase() || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-800 truncate">
                    {co.company_name}
                  </div>
                </div>
                <span className="shrink-0 text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {co.jobs_count} tin
                </span>
              </div>
            ))}
            {!top_companies?.length && (
              <div className="py-10 text-center text-slate-400 text-sm">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Award size={16} className="text-slate-400" />
              <h3 className="text-[14px] font-bold text-slate-800">
                Top 10 Sinh viên năng nổ
              </h3>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {top_students?.slice(0, 5).map((stu, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-300 w-4 text-center shrink-0">
                  {idx + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {stu.full_name?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-800 truncate">
                    {stu.full_name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {stu.app_count} đơn · {stu.hired_count} hired
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                    stu.hired_rate > 50
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {stu.hired_rate}%
                </span>
              </div>
            ))}
            {!top_students?.length && (
              <div className="py-10 text-center text-slate-400 text-sm">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[13.5px] font-bold text-slate-800">{title}</h3>
      </div>
      <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
        <MoreVertical size={14} />
      </button>
    </div>
    <div className="p-4">
      <div className="h-[240px]">{children}</div>
    </div>
  </div>
);

export default AdminDashboard;
