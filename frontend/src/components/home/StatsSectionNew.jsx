import React from 'react';

function StatsSectionNew() {
  return (
    <section className="bg-hero-dark relative overflow-hidden pb-12 z-20">
      {/* Stats panel - This sits inside hero-dark background to match design */}
      <div className="mt-8 mx-4 lg:mx-8 rounded-3xl bg-grad-stats-panel shadow-[0_18px_40px_rgba(12,18,73,0.35)] px-8 py-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4">
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Students icon" className="w-full h-full object-contain" src="/images/home/stat-icon-students.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-foreground leading-tight">
                10.000+
              </div>
              <div className="text-muted text-sm mt-1">
                Sinh viên có việc
              </div>
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="flex items-center gap-4">
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Businesses icon" className="w-full h-full object-contain" src="/images/home/stat-icon-businesses.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-foreground leading-tight">
                500+
              </div>
              <div className="text-muted text-sm mt-1">
                Doanh nghiệp tin dùng
              </div>
            </div>
          </div>
          
          {/* Stat 3 */}
          <div className="flex items-center gap-4">
            <div className="w-[69px] h-[83px] flex-shrink-0">
              <img alt="Satisfaction icon" className="w-full h-full object-contain" src="/images/home/stat-icon-satisfaction.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-foreground leading-tight">
                98%
              </div>
              <div className="text-muted text-sm mt-1">
                Hài lòng tuyển dụng
              </div>
            </div>
          </div>
          
          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Security icon" className="w-full h-full object-contain" src="/images/home/stat-icon-security.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-foreground leading-tight">
                100%
              </div>
              <div className="text-muted text-sm mt-1">
                Bảo mật thông tin
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default StatsSectionNew;
