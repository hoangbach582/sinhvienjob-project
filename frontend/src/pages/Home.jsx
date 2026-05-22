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

// 1. HERO SECTION - Premium gradient background with animated orbs
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
    <section className="relative overflow-hidden py-28 lg:py-36" style={{ width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)' }}>
      {/* Animated gradient orbs */}
      <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      {/* Grid pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 }} />

      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 22px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: 700, color: '#c7d2fe', marginBottom: '32px' }}
        >
          <Sparkles style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
          Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
        </motion.div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '24px', textAlign: 'center' }}
          >
            Tìm kiếm việc làm phù hợp cho <br />
            <motion.span 
              whileHover={{ scale: 1.06, y: -4, filter: "drop-shadow(0px 10px 25px rgba(129, 140, 248, 0.5))" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', userSelect: 'none' }}
            >
              Sinh Viên
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ maxWidth: '580px', margin: '0 auto', fontSize: '1.0625rem', color: '#94a3b8', fontWeight: 500, lineHeight: 1.7 }}
          >
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ padding: '24px 0', width: '100%' }}
        >
          <form 
            onSubmit={handleSearch}
            style={{ width: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: '8px', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'row', gap: '0', alignItems: 'center', position: 'relative', zIndex: 20 }}
            className="flex-col md:flex-row"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 relative" style={{ borderRight: '1px solid #e2e8f0' }}>
              <Search style={{ width: '20px', height: '20px', color: '#94a3b8', flexShrink: 0 }} />
              <input 
                type="text" 
                placeholder="Vị trí tuyển dụng, kỹ năng, công ty..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                style={{ width: '100%', fontSize: '15px', color: '#1e293b', border: 'none', background: 'transparent', outline: 'none' }}
              />
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{ position: 'absolute', left: 0, top: 'calc(100% + 12px)', width: '420px', maxWidth: '90vw', background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', textAlign: 'left', padding: '16px', zIndex: 9999 }}
                  >
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '10px' }}>Gợi ý tìm kiếm</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {searchSuggestions.map((sug, i) => (
                        <button key={i} type="button" onClick={() => handleSuggestionClick(sug.text)}
                          style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{sug.text}</span>
                          <span style={{ fontSize: '10px', background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{sug.category}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <MapPin style={{ width: '20px', height: '20px', color: '#94a3b8', flexShrink: 0 }} />
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', fontSize: '15px', color: '#475569', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <motion.button type="submit" 
              whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 800, fontSize: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
            >
              Tìm kiếm
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </motion.button>
          </form>
        </motion.div>

        {/* Quick search tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
        >
          <span style={{ fontSize: '13px', color: '#64748b' }}>Phổ biến:</span>
          {['ReactJS', 'Marketing', 'Part-time', 'Thực tập'].map((tag) => (
            <button key={tag} onClick={() => handleSuggestionClick(tag)}
              style={{ padding: '4px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#c7d2fe', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 2. STATS BAR - Floating glassmorphism card
function StatsSection() {
  const stats = [
    { icon: <Users style={{ width: 22, height: 22 }} />, value: '10.000+', label: 'Sinh viên có việc', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    { icon: <Building2 style={{ width: 22, height: 22 }} />, value: '500+', label: 'Doanh nghiệp tin dùng', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { icon: <Star style={{ width: 22, height: 22 }} />, value: '98%', label: 'Hài lòng tuyển dụng', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { icon: <GraduationCap style={{ width: 22, height: 22 }} />, value: '100%', label: 'Bảo mật thông tin', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  ];
  return (
    <section style={{ width: '100%', background: '#f8fafc', padding: '0 24px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 20 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ width: '100%', maxWidth: '960px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '28px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center', marginTop: '-40px' }}
      >
        {stats.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -4, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 8px', borderRadius: '16px', cursor: 'default', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {stat.icon}
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{stat.value}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// 3. JOB CATEGORIES SECTION
function CategoriesSection({ categories, navigate }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div className="text-center space-y-4 mb-16">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '9999px', background: '#ede9fe', fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          ✦ Khám Phá
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Tìm việc theo danh mục ngành nghề</h2>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>Chọn nhóm ngành bạn mong muốn để tiếp cận hàng trăm việc làm đang chờ đón.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => navigate(`/jobs?keyword=${cat.searchKey}`)}
              whileHover={{ y: -10, scale: 1.04 }}
              style={{ background: 'white', borderRadius: '20px', padding: '28px 16px', border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', transition: 'box-shadow 0.3s, border-color 0.3s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              className="group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-tr ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent style={{ width: '28px', height: '28px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', lineHeight: 1.3 }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
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

// JobCard with gradient top accent
function JobCard({ job, navigate, formatSalary, translateType, getTypeBadgeStyles }) {
  const gradients = {
    'part_time': 'linear-gradient(135deg, #10b981, #14b8a6)',
    'internship': 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'full_time': 'linear-gradient(135deg, #3b82f6, #6366f1)',
  };
  return (
    <motion.div
      layout
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
      onClick={() => navigate(`/job/${job.id}`)}
      style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', transition: 'all 0.3s', overflow: 'hidden' }}
      className="group"
      onMouseEnter={e => e.currentTarget.style.borderColor = '#a5b4fc'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
    >
      {/* Gradient accent bar */}
      <div style={{ height: '4px', background: gradients[job.type] || gradients.full_time }} />

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', color: '#475569', flexShrink: 0 }}>
            {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <SaveButton jobId={job.id} size={16} />
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginBottom: '6px', minHeight: '44px', transition: 'color 0.2s', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          className="group-hover:text-indigo-600"
        >
          {job.title}
        </h3>

        <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {job.employer?.company_name || 'Đang cập nhật'}
        </p>
      </div>

      <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
            {job.location}
          </span>
          <span style={{ color: '#f59e0b', fontWeight: 800 }}>
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getTypeBadgeStyles(job.type)}`}>
            {translateType(job.type)}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '2px', transition: 'color 0.2s' }}
            className="group-hover:text-purple-600"
          >
            Chi tiết
            <ChevronRight style={{ width: '16px', height: '16px' }} className="group-hover:translate-x-0.5 transition-transform" />
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
    <section style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '80px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="text-center lg:text-left">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '9999px', background: '#eef2ff', fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'center' }} className="lg:self-start">
              🔥 Cập Nhật Liên Tục
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Việc làm mới nhất dành cho bạn</h2>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Các tin tuyển dụng HOT tuyển gấp, đã được duyệt chất lượng cao.</p>
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

        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/jobs')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
          >
            Khám phá tất cả công việc
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// 5. WHY CHOOSE US - Dark section with glass benefit cards
function BenefitsSection({ benefits }) {
  const gradients = [
    'linear-gradient(135deg, #3b82f6, #6366f1)',
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #8b5cf6, #a855f7)',
    'linear-gradient(135deg, #f59e0b, #f97316)',
  ];
  return (
    <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-50px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '12px', fontWeight: 700, color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            ✦ Đặc Quyền Tìm Việc
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>Tại sao chọn SinhVienJob?</h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>Chúng tôi đem lại những giải pháp thiết thực nhất để sinh viên bắt đầu hành trình sự nghiệp dễ dàng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', padding: '32px 24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '4px solid', borderImage: gradients[idx] + ' 1', transition: 'all 0.3s' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: gradients[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                  <IconComponent style={{ width: '24px', height: '24px' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, fontWeight: 500 }}>{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 6. TOP COMPANIES - Horizontal card layout
function CompaniesSection({ topCompanies, navigate }) {
  const companyColors = [
    { bg: '#dbeafe', text: '#1d4ed8' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#fef3c7', text: '#b45309' },
    { bg: '#d1fae5', text: '#047857' },
    { bg: '#e0e7ff', text: '#4338ca' },
    { bg: '#fee2e2', text: '#b91c1c' },
  ];
  return (
    <section style={{ background: 'white', padding: '96px 0', borderTop: '1px solid #e2e8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '9999px', background: '#faf5ff', fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            🏢 Đối Tác Tuyển Dụng
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '12px' }}>Công ty đang tuyển dụng mạnh</h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {topCompanies.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -8, scale: 1.03 }}
              onClick={() => navigate('/companies')}
              style={{ background: 'white', borderRadius: '20px', padding: '24px 16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', gap: '14px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              className="group"
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: companyColors[idx]?.bg || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', color: companyColors[idx]?.text || '#475569', letterSpacing: '0.05em' }}
                className="group-hover:scale-110 transition-transform duration-300"
              >
                {comp.logo}
              </div>
              <div style={{ width: '100%' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.name}</h3>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.industry}</p>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '4px 12px', borderRadius: '8px' }}>
                {comp.jobs}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/companies')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
          >
            Khám phá tất cả các doanh nghiệp đối tác
            <ChevronRight style={{ width: '16px', height: '16px' }} />
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