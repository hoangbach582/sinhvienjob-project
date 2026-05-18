/**
 * DashboardCharts – 2 biểu đồ Recharts cho Employer Dashboard
 *   1. LineChart – Hồ sơ nhận được theo 7 ngày gần nhất
 *   2. PieChart  – Tỷ lệ hồ sơ theo loại công việc
 *
 * Props:
 *   applicationTrend – array [{ date, count }] cho Line chart
 *   jobTypeBreakdown – array [{ type, count }] cho Pie chart
 *   loading          – boolean
 */
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Sector,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

// Màu sắc cho Pie chart
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

// Label map cho job type
const TYPE_LABEL = {
  full_time:  'Full-time',
  part_time:  'Part-time',
  internship: 'Thực tập',
  remote:     'Remote',
};

// Custom tooltip cho Line chart
function CustomLineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F172A',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <p style={{ color: '#94A3B8', fontSize: '11px', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: '#10B981', fontSize: '16px', fontWeight: 700, margin: 0 }}>
        {payload[0].value} hồ sơ
      </p>
    </div>
  );
}

// Custom tooltip cho Pie chart
function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <p style={{ color: '#94A3B8', fontSize: '11px', margin: '0 0 4px' }}>
        {TYPE_LABEL[payload[0].name] || payload[0].name}
      </p>
      <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: 0 }}>
        {payload[0].value} hồ sơ ({payload[0].payload.percent?.toFixed(1)}%)
      </p>
    </div>
  );
}

// Skeleton cho chart area
function ChartSkeleton() {
  return (
    <div style={{
      height: '200px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: '12px',
    }} />
  );
}

// Wrapper card cho mỗi chart
function ChartCard({ title, subtitle, icon: Icon, iconColor, iconBg, children, loading }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          padding: '7px',
          background: iconBg,
          borderRadius: '9px',
          display: 'flex',
        }}>
          <Icon size={16} color={iconColor} />
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {loading ? <ChartSkeleton /> : children}
    </div>
  );
}

function DashboardCharts({ applicationTrend = [], jobTypeBreakdown = [], loading = false }) {
  // Tính percent cho Pie
  const total = jobTypeBreakdown.reduce((s, d) => s + (d.count || 0), 0);
  const pieData = jobTypeBreakdown.map(d => ({
    name: d.type,
    value: d.count,
    percent: total > 0 ? (d.count / total) * 100 : 0,
  }));

  // Custom label cho Pie (hiện % ở ngoài)
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Bỏ qua slice < 5%
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: '11px', fontWeight: 700 }}>
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    }}
      className="dashboard-charts-grid"
    >
      {/* ==== LINE CHART: Hồ sơ theo 7 ngày ==== */}
      <ChartCard
        title="Hồ sơ nhận được"
        subtitle="7 ngày gần nhất"
        icon={TrendingUp}
        iconColor="#10B981"
        iconBg="#ECFDF5"
        loading={loading}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={applicationTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ==== PIE CHART: Tỷ lệ theo loại hình ==== */}
      <ChartCard
        title="Phân bổ loại hình"
        subtitle="Tỷ lệ hồ sơ theo loại công việc"
        icon={PieIcon}
        iconColor="#3B82F6"
        iconBg="#EFF6FF"
        loading={loading}
      >
        {pieData.length === 0 ? (
          <div style={{
            height: '200px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#CBD5E1', fontSize: '13px',
          }}>
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={35}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: '11px', color: '#475569' }}>
                    {TYPE_LABEL[value] || value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

export default DashboardCharts;
