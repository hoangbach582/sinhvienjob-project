import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function StatsSectionNew() {
  const ref = useRef(null); // Ref dùng để xác định phần tử DOM cần theo dõi
  
  // Hook useInView của Framer Motion: Kích hoạt khi phần tử cuộn vào màn hình
  // margin: "-50px" nghĩa là phần tử phải hiện ra ít nhất 50px mới bắt đầu hiệu ứng
  // once: true nghĩa là hiệu ứng chỉ chạy 1 lần duy nhất khi cuộn xuống
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // --- CẤU HÌNH HIỆU ỨNG (VARIANTS) CHO CONTAINER CHỨA TẤT CẢ ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      // staggerChildren: Mỗi phần tử con bên trong sẽ trễ 0.15s so với phần tử trước nó (Hiệu ứng xuất hiện lần lượt)
      transition: { staggerChildren: 0.15 } 
    }
  };

  // --- CẤU HÌNH HIỆU ỨNG CHO TỪNG Ô THỐNG KÊ (ITEM) ---
  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Trạng thái ẩn: Mờ và nằm tụt xuống dưới 30px
    visible: { 
      opacity: 1, 
      y: 0, // Trạng thái hiện: Rõ dần và trượt lên vị trí gốc (0px)
      transition: { type: "spring", stiffness: 100, damping: 12 } // Hiệu ứng lò xo (Spring) tạo cảm giác nảy nhẹ
    }
  };

  return (
    // <section> chứa background màu gradient tối để khớp với phần Hero phía trên
    <section className="bg-hero-dark relative overflow-hidden pb-12 z-20" ref={ref}>
      {/* 
        Stats panel - Khối hình chữ nhật nổi bật chứa 4 con số thống kê
        Sử dụng shadow và bo góc lớn (rounded-3xl) để tạo độ sâu 3D 
      */}
      <div className="mx-6 lg:mx-10 mt-8 rounded-3xl bg-grad-stats-panel shadow-[0_18px_40px_rgba(12,18,73,0.35)] px-10 py-10 relative z-10 hover-glow" style={{ marginBottom: '1rem' }}>
        
        {/* Bọc toàn bộ các cục thống kê bằng thẻ <motion.div> của Framer Motion */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
          style={{ padding: '1rem' }}
          variants={containerVariants}
          initial="hidden" // Bắt đầu ở trạng thái hidden
          animate={isInView ? "visible" : "hidden"} // Đổi sang visible khi người dùng cuộn tới
        >
          
          {/* Ô Thống kê 1: Số lượng sinh viên */}
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
          
          {/* Ô Thống kê 2: Doanh nghiệp */}
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
          
          {/* Ô Thống kê 3: Tỷ lệ hài lòng */}
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
          
          {/* Ô Thống kê 4: Bảo mật */}
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
