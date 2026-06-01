import React from 'react';

const stats = [
  {
    image: '/images/home/stat-icon-students.png',
    value: '10.000+',
    label: 'Sinh viên có việc',
  },
  {
    image: '/images/home/stat-icon-businesses.png',
    value: '500+',
    label: 'Doanh nghiệp tin dùng',
  },
  {
    image: '/images/home/stat-icon-satisfaction.png',
    value: '98%',
    label: 'Hài lòng tuyển dụng',
  },
  {
    image: '/images/home/stat-icon-security.png',
    value: '100%',
    label: 'Bảo mật thông tin',
  },
];

function StatsSection() {
  return (
    <div className="home-stats-glass-wrap">
      <div className="home-stats-glass">
        {stats.map((stat) => (
          <div key={stat.label} className="home-stat-glass-item">
            <img
              src={stat.image}
              alt=""
              className="home-stat-glass-icon"
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
            <div>
              <div className="home-stat-glass-value">{stat.value}</div>
              <div className="home-stat-glass-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection;
