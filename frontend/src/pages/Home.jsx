import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import SaveButton from '../components/SaveButton';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  GraduationCap, 
  Star, 
  Users, 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Code, 
  Megaphone, 
  PenTool, 
  DollarSign, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  Clock
} from 'lucide-react';

// ==========================================
// CÁC DỮ LIỆU ĐĨNH (CONSTANTS) CỦA TRANG CHỦ
// ==========================================

// Gợi ý tìm kiếm nhanh
const searchSuggestions = [
  { text: 'ReactJS', category: 'IT' },
  { text: 'Marketing', category: 'Truyền thông' },
  { text: 'Thiết kế đồ họa', category: 'Design' },
  { text: 'Bán hàng', category: 'Sales' },
  { text: 'Thực tập sinh', category: 'Hình thức' },
  { text: 'Part-time', category: 'Hình thức' }
];

// Danh mục ngành nghề nổi bật
const categories = [
  { id: 'it', name: 'Công nghệ thông tin', count: '120+ việc làm', icon: Code, color: 'from-blue-500 to-indigo-500', searchKey: 'React' },
  { id: 'marketing', name: 'Marketing & PR', count: '95+ việc làm', icon: Megaphone, color: 'from-purple-500 to-pink-500', searchKey: 'Marketing' },
  { id: 'design', name: 'Thiết kế & Media', count: '64+ việc làm', icon: PenTool, color: 'from-pink-500 to-rose-500', searchKey: 'Thiết kế' },
  { id: 'sales', name: 'Kinh doanh & Bán lẻ', count: '80+ việc làm', icon: DollarSign, color: 'from-amber-500 to-orange-500', searchKey: 'Bán hàng' },
  { id: 'languages', name: 'Ngôn ngữ & Dịch thuật', count: '45+ việc làm', icon: Globe, color: 'from-emerald-500 to-teal-500', searchKey: 'Dịch thuật' },
  { id: 'admin', name: 'Hành chính & HR', count: '38+ việc làm', icon: Users, color: 'from-cyan-500 to-blue-500', searchKey: 'Nhân sự' }
];

// Lợi thế nền tảng
const benefits = [
  { 
    title: 'Việc làm đã xác thực', 
    desc: '100% tin tuyển dụng được kiểm duyệt chặt chẽ, nói không với lừa đảo, đa cấp.', 
    icon: ShieldCheck, 
    color: 'text-blue-600 bg-blue-50/50' 
  },
  { 
    title: 'Lịch làm việc linh hoạt', 
    desc: 'Hàng ngàn việc làm part-time giúp bạn tối ưu hóa quỹ thời gian học tập.', 
    icon: Clock, 
    color: 'text-indigo-600 bg-indigo-50/50' 
  },
  { 
    title: 'Hỗ trợ tạo CV chuẩn ATS', 
    desc: 'Công cụ viết CV trực tuyến hoàn toàn miễn phí, xuất bản PDF chuyên nghiệp.', 
    icon: FileSpreadsheet, 
    color: 'text-purple-600 bg-purple-50/50' 
  },
  { 
    title: 'Cơ hội phát triển tốt', 
    desc: 'Thực tập sinh tại các tập đoàn lớn có cơ hội ký hợp đồng chính thức sau kỳ thực tập.', 
    icon: TrendingUp, 
    color: 'text-amber-600 bg-amber-50/50' 
  }
];

// Doanh nghiệp tiêu biểu
const topCompanies = [
  { name: 'FPT Software', logo: 'FPT', industry: 'IT & Phần mềm', jobs: '24 tin tuyển' },
  { name: 'Tập đoàn MoMo', logo: 'MoMo', industry: 'Fintech & Thanh toán', jobs: '12 tin tuyển' },
  { name: 'Shopee Việt Nam', logo: 'Shopee', industry: 'Thương mại điện tử', jobs: '18 tin tuyển' },
  { name: 'VNG Corporation', logo: 'VNG', industry: 'Game & Cloud Service', jobs: '15 tin tuyển' },
  { name: 'Techcombank', logo: 'TCB', industry: 'Ngân hàng & Tài chính', jobs: '8 tin tuyển' },
  { name: 'Viettel Group', logo: 'Viettel', industry: 'Viễn thông & Công nghệ', jobs: '20 tin tuyển' }
];

// Dữ liệu fallback dự phòng
const mockJobs = [
  {
    id: 1,
    title: 'Lập trình viên Frontend (ReactJS/VueJS)',
    type: 'part_time',
    location: 'Hà Nội',
    salary_min: 5000000,
    salary_max: 8000000,
    employer: { company_name: 'FPT Software' }
  },
  {
    id: 2,
    title: 'Thực tập sinh Truyền thông & Digital Marketing',
    type: 'internship',
    location: 'TP.HCM',
    salary_min: 3000000,
    salary_max: 5000000,
    employer: { company_name: 'Tập đoàn MoMo' }
  },
  {
    id: 3,
    title: 'Thiết kế đồ họa (UI/UX Designer Intern)',
    type: 'internship',
    location: 'Remote',
    salary_min: 2000000,
    salary_max: 4000000,
    employer: { company_name: 'VNG Corporation' }
  },
  {
    id: 4,
    title: 'Nhân viên Hỗ trợ Khách hàng Bán thời gian',
    type: 'part_time',
    location: 'TP.HCM',
    salary_min: 4000000,
    salary_max: 6000000,
    employer: { company_name: 'The Coffee House' }
  },
  {
    id: 5,
    title: 'Thực tập sinh Quản trị Nhân sự (HR Intern)',
    type: 'internship',
    location: 'Hà Nội',
    salary_min: null,
    salary_max: null,
    employer: { company_name: 'Techcombank' }
  },
  {
    id: 6,
    title: 'Lập trình viên Backend NodeJS (Junior/Fresh)',
    type: 'full_time',
    location: 'Hà Nội',
    salary_min: 10000000,
    salary_max: 15000000,
    employer: { company_name: 'Rikkeisoft' }
  }
];

// ==========================================
// CÁC SUB-COMPONENT PHỤC VỤ TRANG CHỦ
// ==========================================

// 1. HERO SECTION - Tiêu đề lớn + Mô tả + Thanh tìm kiếm lớn dạng glassmorphism
function HeroSection({
  keyword,
  setKeyword,
  location,
  setLocation,
  showSuggestions,
  setShowSuggestions,
  handleSearch,
  handleSuggestionClick
}) {
  return (
    <section style={{ width: '100%', textAlign: 'center' }} className="relative bg-linear-to-br from-blue-50/70 via-indigo-50/40 to-purple-50/60 py-24 lg:py-32 border-b border-slate-200/40">
      {/* Vòng tròn gradient trang trí nền */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />

      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Huy hiệu nhỏ trên tiêu đề */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '9999px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '32px' }}
        >
          <Sparkles style={{ width: '16px', height: '16px', color: '#A855F7' }} />
          Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
        </motion.div>

        {/* Tiêu đề chính */}
        <div style={{ marginBottom: '20px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ 
              fontSize: 'clamp(1.5rem, 4.5vw, 3.25rem)', 
              fontWeight: 900, 
              color: '#0f172a', 
              lineHeight: 1.2, 
              letterSpacing: '-0.02em', 
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            Tìm kiếm việc làm phù hợp cho <br />
            <motion.span 
              whileHover={{ 
                scale: 1.06,
                y: -4,
                filter: "drop-shadow(0px 10px 15px rgba(99, 102, 241, 0.25))"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="inline-block bg-linear-to-r from-brand-blue via-brand-indigo to-brand-purple bg-clip-text text-transparent cursor-pointer select-none"
            >
              Sinh Viên
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.0625rem', color: '#475569', fontWeight: 500, lineHeight: 1.7 }}
          >
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </motion.p>
        </div>

        {/* Thanh Tìm Kiếm */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ padding: '24px 0', width: '100%' }}
        >
          <form 
            onSubmit={handleSearch}
            className="w-full bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center relative z-20"
          >
            {/* Ô nhập từ khóa */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2.5 border-b md:border-b-0 md:border-r border-slate-100 relative">
              <Search className="w-5.5 h-5.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Vị trí tuyển dụng, kỹ năng, công ty..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                className="w-full text-base text-slate-800 placeholder-slate-400 border-none bg-transparent outline-none focus:ring-0"
              />
              
              {/* Dropdown Gợi ý Từ khóa */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{ position: 'absolute', left: 0, top: 'calc(100% + 12px)', width: '420px', maxWidth: '90vw', background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9', textAlign: 'left', padding: '16px', zIndex: 9999 }}
                  >
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '10px' }}>Gợi ý tìm kiếm</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {searchSuggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSuggestionClick(sug.text)}
                          style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{sug.text}</span>
                          <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, whiteSpace: 'nowrap' }}>{sug.category}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ô chọn địa điểm */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2.5 border-b md:border-b-0 border-slate-100 md:border-none">
              <MapPin className="w-5.5 h-5.5 text-slate-400 shrink-0" />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-base text-slate-700 border-none bg-transparent outline-none cursor-pointer focus:ring-0"
              >
                <option value="">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Nút Tìm kiếm lớn */}
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.02, boxShadow: '0 12px 20px -3px rgba(59, 130, 246, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-linear-to-r from-brand-blue via-brand-indigo to-brand-purple hover:opacity-95 text-white font-extrabold text-base rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              Tìm kiếm
              <ArrowRight className="w-4.5 h-4.5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// 2. STATS BAR - Căn giữa bên dưới Hero Section
function StatsSection() {
  return (
    <section style={{ width: '100%', background: 'white', borderBottom: '1px solid #e2e8f0', padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ width: '100%', maxWidth: '896px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}
      >
        {[
          { icon: <Users style={{ width: 24, height: 24, color: '#3B82F6' }} />, value: '10.000+', label: 'Sinh viên có việc', border: true },
          { icon: <Building2 style={{ width: 24, height: 24, color: '#6366F1' }} />, value: '500+', label: 'Doanh nghiệp tin dùng', border: true },
          { icon: <Star style={{ width: 24, height: 24, color: '#FBBF24' }} />, value: '98%', label: 'Hài lòng tuyển dụng', border: true },
          { icon: <GraduationCap style={{ width: 24, height: 24, color: '#10B981' }} />, value: '100%', label: 'Bảo mật thông tin', border: false },
        ].map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRight: stat.border ? '1px solid #f1f5f9' : 'none', padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{stat.icon}</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{stat.value}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// 3. JOB CATEGORIES SECTION - Tìm việc theo danh mục ngành nghề (6 Category Cards vuông)
function CategoriesSection({ categories, navigate }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
      <div className="text-center space-y-3 mb-16">
        <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          Khám Phá
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tìm việc theo danh mục ngành nghề</h2>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => navigate(`/jobs?keyword=${cat.searchKey}`)}
              whileHover={{ 
                y: -8, 
                scale: 1.03,
                boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
                borderColor: '#3B82F6' 
              }}
              className="bg-white rounded-3xl p-6 border border-slate-200/60 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square gap-4 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${cat.color} flex items-center justify-center shadow-lg shadow-indigo-500/10 text-white group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-400">
                  {cat.count}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// Card công việc con (JobCard) - Thiết kế đồng đều chiều cao, các trường căn lề thẳng hàng
function JobCard({ job, navigate, formatSalary, translateType, getTypeBadgeStyles }) {
  return (
    <motion.div
      layout
      whileHover={{ 
        y: -8, 
        boxShadow: '0 25px 35px -10px rgba(59, 130, 246, 0.08), 0 10px 20px -10px rgba(59, 130, 246, 0.04)',
        borderColor: '#6366F1'
      }}
      onClick={() => navigate(`/job/${job.id}`)}
      className="bg-white rounded-3xl border border-slate-200/60 p-6 cursor-pointer flex flex-col justify-between h-full transition-all duration-300 group"
    >
      <div>
        {/* Logo công ty và Nút lưu tin */}
        <div className="flex justify-between items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center font-black text-base text-slate-500 group-hover:border-indigo-200 transition-colors overflow-hidden shrink-0 shadow-inner">
            {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SaveButton jobId={job.id} size={16} />
          </div>
        </div>

        {/* Tiêu đề việc làm */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-brand-indigo transition-colors line-clamp-2 mb-1.5 leading-snug min-h-14 flex items-start">
          {job.title}
        </h3>

        {/* Tên công ty */}
        <p className="text-xs sm:text-sm font-semibold text-slate-500 truncate mb-5">
          {job.employer?.company_name || 'Đang cập nhật'}
        </p>
      </div>

      {/* Thông tin metadata và nhãn việc làm */}
      <div className="space-y-4 pt-4 border-t border-slate-100 mt-auto">
        {/* Địa điểm & Lương */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
          <span className="flex items-center gap-1.5 truncate max-w-[55%]">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="text-amber-600 flex items-center gap-1 shrink-0 font-extrabold">
            💰 {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>

        {/* Action details & tag loại hình */}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border ${getTypeBadgeStyles(job.type)}`}>
            {translateType(job.type)}
          </span>
          <span className="text-xs sm:text-sm font-bold text-brand-indigo group-hover:text-brand-purple flex items-center gap-0.5 transition-colors">
            Chi tiết
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// 4. LATEST JOBS SECTION - Việc làm mới nhất (Lưới 3 cột, bộ lọc tab, nút khám phá tất cả)
function LatestJobsSection({
  loading,
  filteredJobs,
  activeTab,
  setActiveTab,
  navigate,
  formatSalary,
  translateType,
  getTypeBadgeStyles,
  // eslint-disable-next-line no-unused-vars
  JobSkeleton
}) {
  return (
    <section className="bg-slate-50/50 border-y border-slate-200/40 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section của Jobs */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Cập Nhật Liên Tục
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Việc làm mới nhất dành cho bạn</h2>
            <p className="text-sm sm:text-base text-slate-500">Các tin tuyển dụng HOT tuyển gấp, đã được duyệt chất lượng cao.</p>
          </div>

          {/* Tabs lọc nhanh */}
          <div className="flex flex-wrap justify-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40 shrink-0 self-center lg:self-end">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold border-none transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-white text-brand-blue shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setActiveTab('part_time')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold border-none transition-all cursor-pointer ${
                activeTab === 'part_time' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Bán thời gian
            </button>
            <button 
              onClick={() => setActiveTab('internship')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold border-none transition-all cursor-pointer ${
                activeTab === 'internship' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Thực tập sinh
            </button>
            <button 
              onClick={() => setActiveTab('full_time')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold border-none transition-all cursor-pointer ${
                activeTab === 'full_time' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Toàn thời gian
            </button>
          </div>
        </div>

        {/* Grid Jobs - Tối ưu 3 cột giúp khoảng trống thở tốt hơn */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => <JobSkeleton key={n} />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy việc làm</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Hiện tại chưa có công việc mới nào thuộc hình thức này. Vui lòng chọn bộ lọc khác.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.slice(0, 6).map((job) => (
                <JobCard 
                  key={job.id}
                  job={job}
                  navigate={navigate}
                  formatSalary={formatSalary}
                  translateType={translateType}
                  getTypeBadgeStyles={getTypeBadgeStyles}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Nút Xem tất cả nổi bật ở bên dưới */}
        <div className="text-center mt-16">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200/80 text-slate-700 font-extrabold text-sm shadow-sm hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer"
          >
            Khám phá tất cả công việc
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// 5. WHY CHOOSE US SECTION - Lợi thế đặc quyền của SinhVienJob
function BenefitsSection({ benefits }) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Đặc Quyền Tìm Việc
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tại sao chọn SinhVienJob?</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt đầu hành trình sự nghiệp dễ dàng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 space-y-6"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${benefit.color} shadow-inner`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{benefit.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 6. TOP COMPANIES SECTION - Doanh nghiệp tiêu biểu đang tuyển dụng mạnh
function CompaniesSection({ topCompanies, navigate }) {
  return (
    <section className="bg-slate-50/50 border-t border-slate-200/40 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
            Đối Tác Tuyển Dụng
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Công ty đang tuyển dụng mạnh</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {topCompanies.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ 
                y: -8, 
                borderColor: '#6366F1', 
                boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.1)' 
              }}
              onClick={() => navigate('/companies')}
              className="bg-white rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between items-center text-center cursor-pointer aspect-square shadow-sm transition-all duration-300 group"
            >
              {/* Logo đại diện doanh nghiệp */}
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform overflow-hidden font-black text-slate-700 text-sm tracking-wider">
                {comp.logo}
              </div>
              
              {/* Tên & Ngành nghề */}
              <div className="space-y-1 w-full">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">{comp.name}</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold truncate">{comp.industry}</p>
              </div>
              
              {/* Badge số tin tuyển dụng */}
              <div className="text-[10px] font-extrabold text-brand-indigo bg-indigo-50 px-2.5 py-1 rounded-md">
                {comp.jobs}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nút điều hướng phụ */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/companies')}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-purple hover:text-brand-indigo bg-transparent border-none cursor-pointer group"
          >
            Khám phá tất cả các doanh nghiệp đối tác
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENT CHÍNH TRANG CHỦ (HOME PAGE)
// ==========================================
function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, part_time, internship, full_time
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/latest');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          setJobs(mockJobs);
        }
      } catch (error) {
        console.error("Lỗi khi tải việc làm:", error);
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = activeTab === 'all' 
    ? jobs 
    : jobs.filter(job => job.type === activeTab);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSuggestionClick = (text) => {
    setKeyword(text);
    setShowSuggestions(false);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    
    if (minMil && maxMil) return `${minMil} - ${maxMil}tr`;
    if (minMil) return `Từ ${minMil}tr`;
    if (maxMil) return `Lên tới ${maxMil}tr`;
    return 'Thỏa thuận';
  };

  const translateType = (type) => {
    const types = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'internship': 'Thực tập sinh'
    };
    return types[type] || type;
  };

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'part_time':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'internship':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'full_time':
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  // Skeleton Card tải dữ liệu việc làm
  const JobSkeleton = () => (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-200" />
        <div className="w-6 h-6 rounded-full bg-slate-200" />
      </div>
      <div className="space-y-2 py-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="h-px bg-slate-100 w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded-full w-20" />
        <div className="h-5 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="w-full bg-[#FAFBFE] min-h-screen">
        {/* 1. HERO SECTION */}
        <HeroSection 
          keyword={keyword}
          setKeyword={setKeyword}
          location={location}
          setLocation={setLocation}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
        />

        {/* 2. FLOATING STATS BAR */}
        <StatsSection />

        {/* 3. CATEGORIES SECTION */}
        <CategoriesSection 
          categories={categories}
          navigate={navigate}
        />

        {/* 4. LATEST JOBS SECTION */}
        <LatestJobsSection 
          loading={loading}
          filteredJobs={filteredJobs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigate={navigate}
          formatSalary={formatSalary}
          translateType={translateType}
          getTypeBadgeStyles={getTypeBadgeStyles}
          JobSkeleton={JobSkeleton}
        />

        {/* 5. BENEFITS SECTION */}
        <BenefitsSection 
          benefits={benefits}
        />

        {/* 6. COMPANIES SECTION */}
        <CompaniesSection 
          topCompanies={topCompanies}
          navigate={navigate}
        />
      </div>
    </MainLayout>
  );
}

export default Home;