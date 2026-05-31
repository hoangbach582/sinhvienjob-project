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
    <section className="relative overflow-hidden bg-navy-deep pb-40 pt-28 sm:pt-32">
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 lg:mx-0">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
            Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
          </div>

          <h1 className="text-pretty text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Tìm kiếm việc làm phù hợp cho{' '}
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
                  onChange={(event) => setKeyword(event.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="relative flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 md:w-52">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate text-sm text-foreground">{location || 'Tất cả địa điểm'}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
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

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-opacity hover:opacity-90 cursor-pointer"
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
    </section>
  );
}

export default HeroSectionNew;
