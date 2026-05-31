import React from 'react';
import { Building2, ShieldCheck, Star, Users } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10.000+',
    label: 'Sinh viên có việc',
    gradient: 'bg-gradient-to-br from-brand to-brand-light',
  },
  {
    icon: Building2,
    value: '500+',
    label: 'Doanh nghiệp tin dùng',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
  },
  {
    icon: Star,
    value: '98%',
    label: 'Hài lòng tuyển dụng',
    gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Bảo mật thông tin',
    gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
];

function StatsSection() {
  return (
    <div className="home-stats relative z-20 mx-auto">
      <div className="home-stats-panel rounded-2xl border border-white/10 bg-navy/90 shadow-2xl shadow-navy-deep/40 backdrop-blur">
        <div className="home-stats-grid grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="home-stat-item flex items-center">
              <span className={`home-stat-icon flex shrink-0 items-center justify-center rounded-xl ${stat.gradient} shadow-lg`}>
                {React.createElement(stat.icon, { className: 'h-6 w-6 text-white sm:h-7 sm:w-7', 'aria-hidden': true })}
              </span>
              <div>
                <div className="home-stat-value font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="home-stat-label text-white/60">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
