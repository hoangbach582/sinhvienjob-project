import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, MapPin, Search, Star } from 'lucide-react';

const popularTags = ['ReactJS', 'Marketing', 'Part-time', 'Thực tập'];

const generateStars = () =>
  [...Array(20)].map((_, i) => ({
    top: `${((i * 17 + 7) % 100)}%`,
    left: `${((i * 23 + 11) % 100)}%`,
    width: `${(i % 3) + 2}px`,
    height: `${(i % 3) + 2}px`,
    '--duration': `${2.5 + (i % 5) * 0.6}s`,
    '--delay': `${(i % 8) * 0.4}s`,
  }));

const initialStars = generateStars();

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
      <div className="hero-stars" aria-hidden="true">
        {initialStars.map((style, i) => (
          <div key={i} className="hero-star" style={style} />
        ))}
      </div>

      <div className="home-hero-shell relative mx-auto">
        <div className="home-hero-badge inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 text-xs font-medium text-white/90">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          Nền Tảng Tìm Việc Làm Sinh Viên Số 1 Việt Nam
        </div>

        <div className="home-hero-grid grid grid-cols-1 items-center lg:grid-cols-2">
          <div className="home-hero-copy text-center lg:text-left">
            <h1 className="text-pretty font-extrabold leading-tight text-white">
              Tìm kiếm việc làm <br className="hidden lg:block" />
              phù hợp cho{' '}
              <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
                Sinh Viên
              </span>
            </h1>

            <p className="mx-auto text-pretty leading-relaxed text-white/70 lg:mx-0">
              Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
            </p>

            <form onSubmit={handleSearch} className="home-search-glass">
              <div className="home-search-glass-row">
                <div className="home-search-glass-field home-search-glass-field--grow">
                  <Search className="h-5 w-5" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <div className="home-search-glass-divider" aria-hidden="true" />

                <div className="home-search-glass-field home-search-glass-field--location">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  <span className="truncate text-sm">{location || 'Tất cả địa điểm'}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    aria-label="Chọn địa điểm"
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    <option value="">Tất cả địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP.HCM">TP.HCM</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <button type="submit" className="home-search-glass-submit">
                  Tìm kiếm
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="home-search-glass-tags">
                <span>Phổ biến:</span>
                {popularTags.map((tag) => (
                  <button key={tag} type="button" onClick={() => handleTagClick(tag)}>
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
