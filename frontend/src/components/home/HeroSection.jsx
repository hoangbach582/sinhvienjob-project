import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, Sparkles, TrendingUp, ChevronRight, Flame, Zap, Clock, Code, Megaphone, Palette, ShoppingBag, GraduationCap as GradCap, Monitor } from 'lucide-react';
import Hero3DScene from './Hero3DScene';
import gsap from 'gsap';

const searchSuggestions = [
  { text: 'ReactJS Developer', category: 'IT', icon: Code, gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', trending: true },
  { text: 'Digital Marketing', category: 'Marketing', icon: Megaphone, gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)', trending: true },
  { text: 'UI/UX Designer', category: 'Design', icon: Palette, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', trending: false },
  { text: 'Nhân viên Bán hàng', category: 'Sales', icon: ShoppingBag, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', trending: false },
  { text: 'Thực tập sinh IT', category: 'Internship', icon: GradCap, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', trending: true },
  { text: 'Part-time Sinh viên', category: 'Flexible', icon: Clock, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', trending: false }
];

const quickCategories = [
  { label: 'Công nghệ', icon: Monitor, color: '#6366f1', bg: '#eef2ff', searchKey: 'React' },
  { label: 'Marketing', icon: Megaphone, color: '#8b5cf6', bg: '#f5f3ff', searchKey: 'Marketing' },
  { label: 'Thiết kế', icon: Palette, color: '#ec4899', bg: '#fdf2f8', searchKey: 'Thiết kế' },
  { label: 'Kinh doanh', icon: ShoppingBag, color: '#f59e0b', bg: '#fffbeb', searchKey: 'Bán hàng' },
];

// Generate hero particles
const heroParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 6 + 2,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 6,
  color: ['#818cf8', '#a78bfa', '#c084fc', '#6366f1', '#3b82f6'][Math.floor(Math.random() * 5)],
}));

// Shooting stars
const shootingStars = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 60}%`,
  left: `${Math.random() * 40}%`,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 8 + i * 5,
}));

function HeroSection({ keyword, setKeyword, location, setLocation, showSuggestions, setShowSuggestions, handleSearch, handleSuggestionClick }) {
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const searchRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge entrance
      gsap.from(badgeRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.2,
      });

      // Title word-by-word reveal
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.hero-word');
        gsap.from(words, {
          opacity: 0,
          y: 40,
          rotateX: -60,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.4,
        });
      }

      // Search bar slide up
      gsap.from(searchRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8,
      });

      // Tags stagger
      if (tagsRef.current) {
        const tags = tagsRef.current.querySelectorAll('.hero-tag');
        gsap.from(tags, {
          opacity: 0,
          x: -20,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 1.2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ width: '100%', background: 'linear-gradient(135deg, #070616 0%, #110c2e 30%, #1b1246 70%, #0a061c 100%)', zIndex: 30 }}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heroParticles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              top: s.top,
              left: s.left,
              '--duration': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="hero-grid" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
          {/* Left side - Text & Search */}
          <div style={{ position: 'relative', zIndex: 30 }}>
            {/* Badge */}
            <div ref={badgeRef}
              className="badge-pulse-glow"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 22px', borderRadius: '9999px', background: 'rgba(99,102,241,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(129,140,248,0.3)', fontSize: '13px', fontWeight: 700, color: '#e0e7ff', marginBottom: '32px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
              <Sparkles style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
              Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
            </div>

            {/* Title with word-by-word reveal */}
            <h1 ref={titleRef}
              className="text-glow"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '24px', perspective: '600px' }}>
              {'Tìm kiếm việc làm'.split(' ').map((word, i) => (
                <span key={i} className="hero-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{word}</span>
              ))}
              <br />
              {'phù hợp cho'.split(' ').map((word, i) => (
                <span key={`b-${i}`} className="hero-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{word}</span>
              ))}
              {' '}
              <motion.span
                whileHover={{ scale: 1.06, y: -4, filter: "drop-shadow(0px 10px 25px rgba(168, 85, 247, 0.5))" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="hero-word"
                style={{ display: 'inline-block', cursor: 'pointer', userSelect: 'none', background: 'linear-gradient(135deg, #c084fc, #818cf8, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textDecoration: 'underline', textDecorationColor: 'rgba(192,132,252,0.4)', textUnderlineOffset: '8px', textDecorationThickness: '3px' }}>
                Sinh Viên
              </motion.span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              style={{ maxWidth: '520px', fontSize: '1.0625rem', color: '#cbd5e1', fontWeight: 400, lineHeight: 1.7, marginBottom: '32px' }}>
              Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
            </motion.p>

            {/* Search Bar with glow focus */}
            <div ref={searchRef}
              style={{ width: '100%', position: 'relative', zIndex: 50, maxWidth: '600px' }}>
              <form onSubmit={handleSearch}
                className="search-form-glow"
                style={{ width: '100%', background: 'rgba(25, 20, 60, 0.5)', backdropFilter: 'blur(20px)', padding: '8px', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'row', gap: '0', alignItems: 'center', position: 'relative', zIndex: 20 }}>
                <div className="flex-1 flex items-center gap-3 px-4 py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <Search style={{ width: '20px', height: '20px', color: '#94a3b8', flexShrink: 0 }} />
                  <input type="text" placeholder="Vị trí tuyển dụng, kỹ năng, công ty..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                    style={{ width: '100%', fontSize: '15px', color: '#ffffff', border: 'none', background: 'transparent', outline: 'none' }} 
                    className="placeholder-slate-400" />
                </div>
                <div className="flex items-center gap-3 px-4 py-3" style={{ minWidth: '160px' }}>
                  <MapPin style={{ width: '20px', height: '20px', color: '#94a3b8', flexShrink: 0 }} />
                  <select value={location} onChange={(e) => setLocation(e.target.value)}
                    style={{ width: '100%', fontSize: '15px', color: '#ffffff', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}
                    className="appearance-none *:text-slate-800">
                    <option value="">Tất cả địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP.HCM">TP.HCM</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
                  className="btn-glow"
                  style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: 'white', fontWeight: 700, fontSize: '15px', borderRadius: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)' }}>
                  Tìm kiếm <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}><ArrowRight style={{ width: '18px', height: '18px' }} /></motion.span>
                </motion.button>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.25 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: '8px', background: 'white', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', textAlign: 'left', zIndex: 9999, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #fafbff 0%, #f8fafc 100%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Flame style={{ width: '12px', height: '12px', color: 'white' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Xu hướng tìm kiếm</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                          <Zap style={{ width: '10px', height: '10px', color: '#f59e0b' }} />
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#b45309' }}>HOT</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 8px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
                      {searchSuggestions.map((sug, i) => {
                        const SugIcon = sug.icon;
                        return (
                          <motion.button key={i} type="button" onClick={() => handleSuggestionClick(sug.text)}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.04 }}
                            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: sug.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <SugIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{sug.text}</span>
                                {sug.trending && (
                                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '1px 6px', borderRadius: '6px' }}>
                                    <TrendingUp style={{ width: '8px', height: '8px', display: 'inline' }} /> Hot
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>{sug.category}</span>
                            </div>
                            <ChevronRight style={{ width: '14px', height: '14px', color: '#cbd5e1' }} />
                          </motion.button>
                        );
                      })}
                    </div>
                    <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #f1f5f9', background: '#fafbff' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'block' }}>Danh mục phổ biến</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {quickCategories.map((cat, i) => {
                          const CatIcon = cat.icon;
                          return (
                            <button key={i} type="button" onClick={() => handleSuggestionClick(cat.searchKey)}
                              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 8px', borderRadius: '12px', border: '1px solid transparent', background: cat.bg, cursor: 'pointer', transition: 'all 0.2s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                              <CatIcon style={{ width: '18px', height: '18px', color: cat.color }} />
                              <span style={{ fontSize: '11px', fontWeight: 700, color: cat.color }}>{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick tags with stagger */}
            <div ref={tagsRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px', alignItems: 'center' }}>
              <span className="hero-tag" style={{ fontSize: '13px', color: '#64748b' }}>Phổ biến:</span>
              {['ReactJS', 'Marketing', 'Part-time', 'Thực tập'].map((tag) => (
                <motion.button key={tag}
                  className="hero-tag"
                  onClick={() => handleSuggestionClick(tag)}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#e2e8f0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right side - 3D Scene */}
          <Hero3DScene />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
