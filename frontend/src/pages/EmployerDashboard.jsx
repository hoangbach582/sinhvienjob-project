/**
 * EmployerDashboard – Trang Tổng quan của Nhà tuyển dụng
 *
 * Cấu trúc:
 *  ┌─ Header (tiêu đề + nút refresh)
 *  ├─ StatCards x4 (clickable, trend arrow)
 *  ├─ Quick Actions + Activity Feed (2 cột)
 *  ├─ Charts (Line + Pie)
 *  └─ Recent Jobs Table
 *
 * API Endpoints:
 *  - GET /api/employer/dashboard/stats
 *  - GET /api/employer/jobs/recent
 *  - GET /api/employer/applications/recent
 *
 * Fallback: Nếu API chưa sẵn sàng → dùng MOCK_DATA bên dưới
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Briefcase, Clock, FileText, TrendingUp,
  RefreshCw, LayoutDashboard,
} from 'lucide-react';

import { jobService } from '../services/jobService';
import StatCard from '../components/employer/dashboard/StatCard';
import { StatCardSkeleton } from '../components/employer/dashboard/SkeletonCard';
import RecentJobsTable from '../components/employer/dashboard/RecentJobsTable';
import ActivityFeed from '../components/employer/dashboard/ActivityFeed';
import DashboardCharts from '../components/employer/dashboard/DashboardCharts';
import QuickActions from '../components/employer/dashboard/QuickActions';

// ============================================================
// MOCK DATA – Dùng khi API chưa sẵn sàng
// ============================================================
const MOCK_STATS = {
  active_jobs:        { value: 12, trend: 20,  trendUp: true  },
  pending_jobs:       { value: 3,  trend: -25, trendUp: false },
  total_applications: { value: 87, trend: 14,  trendUp: true  },
  monthly_applications:{ value: 24, trend: 9.5, trendUp: true  },
};

const MOCK_JOBS = [
  { id: 1, title: 'Lập trình viên Frontend React', type: 'part_time',  applications_count: 23, status: 'approved', deadline: '2026-06-01' },
  { id: 2, title: 'Backend Developer (Laravel)',    type: 'full_time',  applications_count: 15, status: 'approved', deadline: '2026-05-30' },
  { id: 3, title: 'UI/UX Designer Intern',          type: 'internship', applications_count: 8,  status: 'pending',  deadline: '2026-05-25' },
  { id: 4, title: 'Data Analyst',                   type: 'full_time',  applications_count: 31, status: 'approved', deadline: '2026-06-15' },
  { id: 5, title: 'Mobile Developer (Flutter)',     type: 'remote',     applications_count: 5,  status: 'closed',   deadline: null },
];

const MOCK_ACTIVITIES = [
  { id: 1, type: 'new_application',    message: 'Nguyễn Văn A vừa nộp hồ sơ vào vị trí Lập trình viên Frontend React',        time: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 2, type: 'job_approved',       message: 'Tin tuyển dụng "Backend Developer (Laravel)" đã được Admin duyệt thành công', time: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: 'new_application',    message: 'Trần Thị B đã ứng tuyển vào vị trí Data Analyst',                              time: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 4, type: 'application_hired',  message: 'Bạn đã đánh dấu Lê Văn C là "Đã tuyển" cho vị trí UI/UX Designer',          time: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 5, type: 'new_job_posted',     message: 'Tin tuyển dụng "Mobile Developer (Flutter)" đã được đăng và đang chờ duyệt', time: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
];

// Tạo mock data 7 ngày cho Line chart
const MOCK_TREND = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    label: d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
    count: Math.floor(Math.random() * 8) + 2,
  };
});

const MOCK_JOB_TYPE = [
  { type: 'full_time',  count: 35 },
  { type: 'part_time',  count: 28 },
  { type: 'internship', count: 18 },
  { type: 'remote',     count: 6  },
];

// ============================================================
// Config cho 4 StatCards
// ============================================================
const STAT_CARD_CONFIG = [
  {
    key: 'active_jobs',
    label: 'Tin đang hoạt động',
    icon: Briefcase,
    color: '#10B981',
    filterStatus: 'approved',
  },
  {
    key: 'pending_jobs',
    label: 'Tin chờ phê duyệt',
    icon: Clock,
    color: '#F59E0B',
    filterStatus: 'pending',
  },
  {
    key: 'total_applications',
    label: 'Tổng hồ sơ nhận được',
    icon: FileText,
    color: '#3B82F6',
    filterStatus: null, // Không filter
  },
  {
    key: 'monthly_applications',
    label: 'Hồ sơ tháng này',
    icon: TrendingUp,
    color: '#8B5CF6',
    filterStatus: null,
  },
];

// ============================================================
// COMPONENT CHÍNH
// ============================================================
function EmployerDashboard() {
  // ── State ──
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({ trend: [], jobType: [] });
  const [refreshing, setRefreshing] = useState(false);

  // State để biết card nào đang active (dùng để filter bảng)
  const [activeFilter, setActiveFilter] = useState(null); // null | 'approved' | 'pending' ...

  const navigate = useNavigate();

  // ── Fetch data ──
  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Gọi cả 3 API song song (Promise.allSettled để không lỗi nếu 1 cái fail)
      const [statsRes, jobsRes, appsRes] = await Promise.allSettled([
        jobService.getDashboardStats(),
        jobService.getRecentJobs(),
        jobService.getRecentApplications(),
      ]);

      // Xử lý stats
      if (statsRes.status === 'fulfilled' && statsRes.value && statsRes.value.success) {
        const statsData = statsRes.value.data;
        setStats(statsData);
        if (statsData.chart_trend)   setChartData(prev => ({ ...prev, trend: statsData.chart_trend }));
        if (statsData.chart_job_type) setChartData(prev => ({ ...prev, jobType: statsData.chart_job_type }));
      } else {
        // API chưa sẵn sàng hoặc lỗi → dùng mock
        setStats(MOCK_STATS);
        setChartData({ trend: MOCK_TREND, jobType: MOCK_JOB_TYPE });
        if (!isRefresh) console.info('📊 Dashboard đang dùng mock data cho Stats');
      }

      // Xử lý recent jobs
      if (jobsRes.status === 'fulfilled' && jobsRes.value && jobsRes.value.success) {
        const jobData = jobsRes.value.data;
        setRecentJobs(Array.isArray(jobData) ? jobData : MOCK_JOBS);
      } else {
        setRecentJobs(MOCK_JOBS);
        if (!isRefresh) console.info('📊 Dashboard đang dùng mock data cho Jobs');
      }

      // Xử lý activities
      if (appsRes.status === 'fulfilled' && appsRes.value && appsRes.value.success) {
        const appData = appsRes.value.data;
        setActivities(Array.isArray(appData) ? appData : MOCK_ACTIVITIES);
      } else {
        setActivities(MOCK_ACTIVITIES);
        if (!isRefresh) console.info('📊 Dashboard đang dùng mock data cho Activities');
      }

      // Toast chỉ hiện khi refresh thủ công
      if (isRefresh) {
        toast.success('Dữ liệu đã được cập nhật!', { icon: '✅', duration: 2000 });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // Fallback toàn bộ sang mock
      setStats(MOCK_STATS);
      setRecentJobs(MOCK_JOBS);
      setActivities(MOCK_ACTIVITIES);
      setChartData({ trend: MOCK_TREND, jobType: MOCK_JOB_TYPE });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Tự động làm mới mỗi 5 phút
    const interval = setInterval(() => fetchAll(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // ── Handler: click vào stat card để filter bảng bên dưới ──
  const handleCardClick = (filterStatus) => {
    setActiveFilter(prev => prev === filterStatus ? null : filterStatus);
    // Cuộn xuống bảng tin tuyển dụng
    const el = document.getElementById('recent-jobs-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Helper: lấy value + trend của stat card ──
  const getCardData = (key) => {
    if (!stats) return { value: 0, trend: undefined, trendUp: undefined };
    const stat = stats[key];
    if (typeof stat === 'object' && stat !== null) return stat;
    return { value: stat ?? 0, trend: undefined, trendUp: undefined };
  };

  // ── Render ──
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* ===== HEADER ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px',
            background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
            borderRadius: '12px',
          }}>
            <LayoutDashboard size={22} color="#10B981" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Tổng quan
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '2px 0 0' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Nút refresh */}
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px',
            background: refreshing ? '#F1F5F9' : '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            fontSize: '13px', fontWeight: 500,
            color: '#475569',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!refreshing) e.currentTarget.style.borderColor = '#10B981'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <RefreshCw
            size={14}
            style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
          />
          {refreshing ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {/* ===== 4 STAT CARDS ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '20px',
      }}
        className="stats-grid"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STAT_CARD_CONFIG.map(cfg => {
              const { value, trend, trendUp } = getCardData(cfg.key);
              const IconComp = cfg.icon;
              const isActive = cfg.filterStatus && activeFilter === cfg.filterStatus;

              return (
                <StatCard
                  key={cfg.key}
                  label={cfg.label}
                  value={value}
                  trend={trend}
                  trendUp={trendUp}
                  color={cfg.color}
                  icon={<IconComp size={18} color={cfg.color} />}
                  onClick={cfg.filterStatus ? () => handleCardClick(cfg.filterStatus) : undefined}
                  active={isActive}
                />
              );
            })
        }
      </div>

      {/* ===== QUICK ACTIONS + ACTIVITY FEED ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: '16px',
        marginBottom: '20px',
        alignItems: 'start',
      }}
        className="mid-grid"
      >
        <QuickActions />
        <ActivityFeed activities={activities} loading={loading} />
      </div>

      {/* ===== BIỂU ĐỒ ===== */}
      <div style={{ marginBottom: '20px' }}>
        <DashboardCharts
          applicationTrend={chartData.trend}
          jobTypeBreakdown={chartData.jobType}
          loading={loading}
        />
      </div>

      {/* ===== BẢNG TIN TUYỂN DỤNG GẦN ĐÂY ===== */}
      <div id="recent-jobs-section" style={{
        scrollMarginTop: '16px',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <RecentJobsTable
          jobs={recentJobs}
          loading={loading}
          filter={activeFilter}
        />

        {/* Ghi chú nếu đang filter */}
        {activeFilter && !loading && (
          <div style={{
            marginTop: '10px',
            padding: '10px 14px',
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>
              Đang lọc theo trạng thái: <strong>
                {activeFilter === 'approved' ? 'Đang mở' : activeFilter === 'pending' ? 'Chờ duyệt' : activeFilter}
              </strong>
            </span>
            <button
              onClick={() => setActiveFilter(null)}
              style={{
                background: 'none', border: 'none',
                color: '#B45309', fontWeight: 600, cursor: 'pointer',
                fontSize: '12px', padding: 0,
              }}
            >
              Xóa bộ lọc ✕
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default EmployerDashboard;