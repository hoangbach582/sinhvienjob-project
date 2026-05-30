import React from 'react';
import { Users, Building2, Star, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10.000+',
    label: 'Sinh viên có việc',
    gradient: 'from-brand to-brand-light',
    iconBg: 'linear-gradient(135deg, #823feb 0%, #ad74ff 100%)',
  },
  {
    icon: Building2,
    value: '500+',
    label: 'Doanh nghiệp tin dùng',
    gradient: 'from-blue-500 to-cyan-400',
    iconBg: 'linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)',
  },
  {
    icon: Star,
    value: '98%',
    label: 'Hài lòng tuyển dụng',
    gradient: 'from-amber-400 to-orange-500',
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Bảo mật thông tin',
    gradient: 'from-emerald-400 to-teal-500',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  },
];

function StatsSection() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #120e2d 0%, #1a1050 50%, #0d0828 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '28px 32px',
          }}
        >
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label, iconBg }) => (
              <div key={label} className="flex items-center gap-4">
                <span
                  className="flex shrink-0 items-center justify-center rounded-xl"
                  style={{
                    width: '52px',
                    height: '52px',
                    background: iconBg,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <div>
                  <div
                    className="font-extrabold text-white"
                    style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
                  >
                    {value}
                  </div>
                  <div
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
