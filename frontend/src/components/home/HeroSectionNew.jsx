import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ArrowRight, Star } from 'lucide-react';

function HeroSectionNew({ keyword, setKeyword, location, setLocation, handleSearch }) {
  const navigate = useNavigate();
  const popularTags = ['ReactJS', 'Marketing', 'Part-time', 'Thực tập'];

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 85}%`,
        size: i % 3 === 0 ? 3 : 2,
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
    <section className="relative overflow-hidden bg-navy-deep pb-40 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-navy-deep" />
      <div className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" />
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-brand-light/20 blur-[120px]" />

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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 lg:mx-0">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
            Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
          </div>

          <h1 className="text-pretty text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
            Tìm kiếm việc làm
            <br />
            phù hợp cho
            <br />
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Sinh Viên
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 lg:mx-0">
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </p>

          <form onSubmit={handleSearch} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="relative flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 md:w-52">
                <div className="pointer-events-none flex items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate text-sm text-foreground">
                    {location || 'Tất cả địa điểm'}
                  </span>
                </div>
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
                <ChevronDown className="pointer-events-none h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer border-none"
              >
                Tìm kiếm
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 pb-1">
              <span className="text-xs font-medium text-white/60">Phổ biến:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="h-72 w-72 rounded-full border border-brand/25 opacity-50" />
            <div className="absolute h-96 w-96 rounded-full border border-brand-light/15 opacity-40" />
          </div>
          <img
            alt="Minh họa tìm kiếm việc làm cho sinh viên"
            width="640"
            height="640"
            decoding="async"
            className="relative mx-auto h-auto w-full max-w-lg drop-shadow-2xl float-element"
            src="/images/home/hero-briefcase.png"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSectionNew;
