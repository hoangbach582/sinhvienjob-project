import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function StatsSectionNew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <section className="bg-hero-dark relative overflow-hidden pb-12 z-20" ref={ref}>
      {/* Stats panel - This sits inside hero-dark background to match design */}
      <div className="mx-6 lg:mx-10 mt-8 rounded-3xl bg-grad-stats-panel shadow-[0_18px_40px_rgba(12,18,73,0.35)] px-10 py-10 relative z-10 hover-glow" style={{ marginBottom: '1rem' }}>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
          style={{ padding: '1rem' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          
          {/* Stat 1 */}
          <motion.div className="flex items-center justify-center gap-4 hover-lift" variants={itemVariants}>
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Students icon" className="w-full h-full object-contain" src="/images/home/stat-icon-students.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-white leading-tight">
                10.000+
              </div>
              <div className="text-white/70 text-sm mt-1">
                Sinh viên có việc
              </div>
            </div>
          </motion.div>
          
          {/* Stat 2 */}
          <motion.div className="flex items-center justify-center gap-4 hover-lift" variants={itemVariants}>
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Businesses icon" className="w-full h-full object-contain" src="/images/home/stat-icon-businesses.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-white leading-tight">
                500+
              </div>
              <div className="text-white/70 text-sm mt-1">
                Doanh nghiệp tin dùng
              </div>
            </div>
          </motion.div>
          
          {/* Stat 3 */}
          <motion.div className="flex items-center justify-center gap-4 hover-lift" variants={itemVariants}>
            <div className="w-[69px] h-[83px] shrink-0">
              <img alt="Satisfaction icon" className="w-full h-full object-contain" src="/images/home/stat-icon-satisfaction.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-white leading-tight">
                98%
              </div>
              <div className="text-white/70 text-sm mt-1">
                Hài lòng tuyển dụng
              </div>
            </div>
          </motion.div>
          
          {/* Stat 4 */}
          <motion.div className="flex items-center justify-center gap-4 hover-lift" variants={itemVariants}>
            <div className="w-[70px] h-[83px] flex-shrink-0">
              <img alt="Security icon" className="w-full h-full object-contain" src="/images/home/stat-icon-security.png" />
            </div>
            <div>
              <div className="text-[28px] font-bold text-white leading-tight">
                100%
              </div>
              <div className="text-white/70 text-sm mt-1">
                Bảo mật thông tin
              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSectionNew;
