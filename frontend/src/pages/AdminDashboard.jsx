import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, FileText, CheckCircle, TrendingUp, Download, 
  Calendar, Filter, RefreshCw, ChevronRight, Award, Building2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import Charts
import ComparisonChart from '../components/admin/charts/ComparisonChart';
import TrendLineChart from '../components/admin/charts/TrendLineChart';
import IndustryBarChart from '../components/admin/charts/IndustryBarChart';
import JobTypePieChart from '../components/admin/charts/JobTypePieChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({
    range: 'month',
    start_date: '',
    end_date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/reports/stats`, {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter.range]); // Re-fetch when range changes

  const handleExport = async (format, reportType = 'dashboard_summary') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/reports/export`, {
        params: { ...filter, type: format, report: reportType },
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Đang chuẩn bị tệp xuất...');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi xuất báo cáo');
    }
  };

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <RefreshCw className="animate-spin" size={32} color="#3B6FE8" />
        <span style={{ marginLeft: '12px', color: '#64748b' }}>Đang tải dữ liệu...</span>
      </div>
    );
  }

  const { overview, month_comparison, trends, by_industry, by_job_type, top_companies, top_students } = data || {};

  return (
    <div className="admin-dashboard-v2">
      {/* Header & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Báo cáo & Thống kê</h1>
          <p className="text-muted">Tổng quan tình hình hệ thống trong khoảng thời gian đã chọn</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="search-bar" style={{ margin: 0 }}>
             <select 
              value={filter.range} 
              onChange={(e) => setFilter({...filter, range: e.target.value})}
              className="form-input"
              style={{ width: '140px' }}
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
            </select>
          </div>
          
          <button className="btn btn-primary" onClick={() => handleExport('excel')}>
            <Download size={14} style={{ marginRight: '6px' }} /> Xuất Excel
          </button>
          <button className="btn btn-outline" onClick={() => handleExport('pdf')}>
            <FileText size={14} style={{ marginRight: '6px' }} /> Xuất PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dash-kpi" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard 
          icon={<Users size={20} color="#3B6FE8" />}
          label="Tổng Người dùng"
          value={overview?.total_students + overview?.total_employers}
          subtext={`${overview?.total_students} Sinh viên / ${overview?.total_employers} NTL`}
          color="#3B6FE8"
        />
        <StatCard 
          icon={<Briefcase size={20} color="#10b981" />}
          label="Tin tuyển dụng mới"
          value={overview?.total_jobs}
          subtext={`Tỷ lệ duyệt: ${overview?.approval_rate}%`}
          color="#10b981"
        />
        <StatCard 
          icon={<FileText size={20} color="#f59e0b" />}
          label="Tổng đơn ứng tuyển"
          value={overview?.total_applications}
          subtext="Lượt nộp hồ sơ"
          color="#f59e0b"
        />
        <StatCard 
          icon={<TrendingUp size={20} color="#6366f1" />}
          label="Tỷ lệ nhận việc (Hired)"
          value={overview?.total_hired}
          subtext={`Tỷ lệ CV: ${overview?.conversion_rate}%`}
          color="#6366f1"
        />
      </div>

      {/* Main Charts Row 1: Month Comparison & Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <ChartWrapper title="So sánh Tháng này vs Tháng trước">
          <ComparisonChart data={month_comparison} />
        </ChartWrapper>
        
        <ChartWrapper title="Xu hướng Tuyển dụng & Ứng tuyển (12 tháng)">
          <TrendLineChart data={trends} />
        </ChartWrapper>
      </div>

      {/* Main Charts Row 2: Industry & Job Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <ChartWrapper title="Top 10 Ngành nghề hot nhất">
          <IndustryBarChart data={by_industry} />
        </ChartWrapper>
        
        <ChartWrapper title="Phân bổ Hình thức làm việc">
          <JobTypePieChart data={by_job_type} />
        </ChartWrapper>
      </div>

      {/* Ranking Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <ChartWrapper title="Top 5 Công ty tích cực nhất">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên công ty</th>
                  <th style={{ textAlign: 'center' }}>Số tin đăng</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {top_companies?.map((co, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar" style={{ width: '28px', height: '28px' }}>{co.company_name[0]}</div>
                        <span style={{ fontWeight: '500' }}>{co.company_name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-blue">{co.jobs_count} tin</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" style={{ padding: '4px 8px' }}>Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartWrapper>

        <ChartWrapper title="Top 10 Sinh viên năng nổ">
           <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th style={{ textAlign: 'center' }}>Ứng tuyển</th>
                  <th style={{ textAlign: 'center' }}>Hired</th>
                  <th style={{ textAlign: 'right' }}>Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody>
                {top_students?.map((stu, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontWeight: '500' }}>{stu.full_name}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{stu.app_count}</td>
                    <td style={{ textAlign: 'center' }}>{stu.hired_count}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${stu.hired_rate > 50 ? 'badge-green' : 'badge-orange'}`}>
                        {stu.hired_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext, color }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span className="text-muted" style={{ fontSize: '12px', fontWeight: '500' }}>{label}</span>
      <div style={{ padding: '6px', background: `${color}15`, borderRadius: '8px' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{value}</div>
    <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {subtext}
    </div>
  </div>
);

const ChartWrapper = ({ title, children }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{title}</h3>
    </div>
    {children}
  </div>
);

export default AdminDashboard;