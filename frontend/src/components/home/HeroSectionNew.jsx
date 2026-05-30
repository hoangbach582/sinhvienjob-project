import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ArrowRight, Star } from 'lucide-react';

function HeroSectionNew({ keyword, setKeyword, location, setLocation, handleSearch }) {
  const navigate = useNavigate();
  const popularTags = ['ReactJS', 'Marketing', 'Part-time', 'Thực tập'];

  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 90}%`,
        size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
        delay: `${(i % 8) * 0.4}s`,
        duration: `${2.5 + (i % 5) * 0.6}s`,
      })),
    []
  );

  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    params.append('keyword', tag);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #08051c 0%, #120e2d 40%, #1a1050 70%, #0d0828 100%)',
        paddingTop: '88px',
        paddingBottom: '64px',
        minHeight: '580px',
      }}
    >
      {/* Background glow blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: '-80px',
          top: '0',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,63,235,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '-100px',
          top: '150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173,116,255,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          right: '30%',
          bottom: '0',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Star particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="hero-star absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              '--delay': star.delay,
              '--duration': star.duration,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: text content */}
        <div className="text-center lg:text-left">
          {/* Badge pill */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 lg:mx-0"
            style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
          >
            <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
            <span className="text-xs font-medium text-white/90">
              Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-extrabold text-white leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', lineHeight: '1.12' }}
          >
            Tìm kiếm việc làm
            <br />
            phù hợp cho{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ad74ff 0%, #823feb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sinh Viên
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 lg:mx-0">
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 search-form-glow"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '14px',
            }}
          >
            <div className="flex flex-col gap-2.5 md:flex-row">
              {/* Keyword input */}
              <div
                className="flex flex-1 items-center gap-2.5 rounded-xl bg-white px-4 py-3"
              >
                <Search className="h-4.5 w-4.5 shrink-0" style={{ color: '#9ca3af' }} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* Location select */}
              <div
                className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-3 md:w-52"
              >
                <MapPin className="h-4 w-4 shrink-0" style={{ color: '#9ca3af' }} aria-hidden="true" />
                <span className="flex-1 truncate text-sm text-gray-800">
                  {location || 'Tất cả địa điểm'}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0" style={{ color: '#9ca3af' }} aria-hidden="true" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Chọn địa điểm"
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #823feb 0%, #ad74ff 100%)',
                  boxShadow: '0 8px 24px rgba(130,63,235,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                Tìm kiếm
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Popular tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Phổ biến:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-white/15"
                  style={{
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Right: 3D illustration */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center">
          {/* Orbit rings */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1.5px solid rgba(130,63,235,0.25)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="pointer-events-none absolute"
            style={{
              width: '440px',
              height: '440px',
              borderRadius: '50%',
              border: '1px solid rgba(173,116,255,0.12)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <img
            alt="Minh họa tìm kiếm việc làm cho sinh viên"
            width="600"
            height="600"
            decoding="async"
            className="relative float-element drop-shadow-2xl"
            style={{ maxWidth: '480px', width: '100%', height: 'auto' }}
            src="/images/home/hero-briefcase.png"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSectionNew;
