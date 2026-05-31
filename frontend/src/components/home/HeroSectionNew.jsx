import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, MapPin, Search, Star } from 'lucide-react';

const popularTags = ['ReactJS', 'Marketing', 'Part-time', 'Thực tập'];

function HeroSectionNew({ keyword, setKeyword, location, setLocation, handleSearch }) {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    params.append('keyword', tag);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="home-hero relative overflow-hidden bg-navy-deep">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-navy-deep" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-brand-light/20 blur-[120px]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="home-hero-shell relative mx-auto">
        <div className="home-hero-badge inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 text-xs font-medium text-white/90">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
        </div>

        <div className="home-hero-grid grid grid-cols-1 items-center lg:grid-cols-2">
          <div className="home-hero-copy text-center lg:text-left">
          <h1 className="text-pretty font-extrabold leading-tight text-white">
            Tìm kiếm việc làm phù hợp cho{' '}
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Sinh Viên
            </span>
          </h1>

          <p className="mx-auto text-pretty leading-relaxed text-white/70 lg:mx-0">
            Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
          </p>

          <form onSubmit={handleSearch} className="home-search rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="home-search-row flex flex-col md:flex-row">
              <label className="home-search-field flex flex-1 items-center gap-2">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Từ khóa tìm việc</span>
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>

              <label className="home-search-location relative flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate text-sm text-foreground">{location || 'Tất cả địa điểm'}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Chọn địa điểm</span>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Remote">Remote</option>
                </select>
              </label>

              <button
                type="submit"
                className="home-search-submit flex items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-r from-brand to-brand-light text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Tìm kiếm
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="home-popular flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-white/60">Phổ biến:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-lg border border-white/15 bg-white/5 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="home-hero-art relative hidden lg:block">
          <img
            src="/images/home/hero-briefcase.png"
            alt="Minh họa tìm kiếm việc làm cho sinh viên"
            width="640"
            height="640"
            decoding="async"
            className="mx-auto h-auto w-full max-w-lg drop-shadow-2xl"
          />
        </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionNew;
