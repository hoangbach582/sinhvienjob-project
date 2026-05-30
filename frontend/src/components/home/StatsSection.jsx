import React from 'react';
import { Users, Building2, Star, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10.000+',
    label: 'Sinh viên có việc',
    gradient: 'from-brand to-brand-light',
  },
  {
    icon: Building2,
    value: '500+',
    label: 'Doanh nghiệp tin dùng',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Star,
    value: '98%',
    label: 'Hài lòng tuyển dụng',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Bảo mật thông tin',
    gradient: 'from-emerald-400 to-teal-500',
  },
];

function StatsSection() {
  return (
    <div className="relative z-20 mx-auto -mt-24 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-navy/90 p-6 shadow-2xl shadow-navy-deep/40 backdrop-blur sm:p-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, gradient }) => (
            <div key={label} className="flex items-center gap-3 sm:gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg sm:h-14 sm:w-14`}>
                <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xl font-extrabold text-white sm:text-2xl">{value}</div>
                <div className="text-xs text-white/60 sm:text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
