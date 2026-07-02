import React from "react";
import { useNavigate } from "react-router-dom";
// Import các biểu tượng (icons) từ thư viện lucide-react để làm giao diện đẹp hơn
import { ArrowRight, ChevronDown, MapPin, Search, Star } from "lucide-react";

// Danh sách các từ khóa phổ biến để sinh viên bấm nhanh
const popularTags = ["ReactJS", "Marketing", "Part-time", "Thực tập"];

/**
 * HÀM TẠO HIỆU ỨNG CÁC NGÔI SAO NHẤP NHÁY
 * Mục đích: Render ra 20 đốm sáng nhỏ li ti trên bầu trời (Hero background),
 * tính toán tọa độ (top, left) và thời gian nhấp nháy (duration, delay) ngẫu nhiên nhưng có quy luật.
 */
const generateStars = () =>
  [...Array(20)].map((_, i) => ({
    top: `${(i * 17 + 7) % 100}%`,
    left: `${(i * 23 + 11) % 100}%`,
    width: `${(i % 3) + 2}px`,
    height: `${(i % 3) + 2}px`,
    "--duration": `${2.5 + (i % 5) * 0.6}s`, // Biến CSS tùy chỉnh điều khiển tốc độ chớp
    "--delay": `${(i % 8) * 0.4}s`,
  }));

// Khởi tạo danh sách các ngôi sao (chạy 1 lần bên ngoài component để không bị tính toán lại khi render)
const initialStars = generateStars();

function HeroSectionNew({
  keyword,
  setKeyword,
  location,
  setLocation,
  handleSearch,
}) {
  const navigate = useNavigate();

  /**
   * HÀM XỬ LÝ KHI BẤM VÀO TỪ KHÓA PHỔ BIẾN
   * Mục đích: Tự động điền từ khóa vào URL và chuyển trang sang danh sách Việc làm
   */
  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    params.append("keyword", tag);
    if (location) params.append("location", location);
    navigate(`/jobs?${params.toString()}`); // Chuyển hướng VD: /jobs?keyword=ReactJS
  };

  return (
    <section className="home-hero relative overflow-hidden bg-navy-deep" style={{ paddingBottom: '24px' }}>
      {/* --- CÁC KHỐI LAYER TẠO BACKGROUND CHUYỂN MÀU (GRADIENT) --- */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-navy-deep via-navy to-navy-deep"
        aria-hidden="true"
      />
      {/* Vệt sáng màu tím mờ (blur) ở góc phải */}
      <div
        className="pointer-events-none absolute -right-20 top-10 h-112 w-md rounded-full bg-brand/30 blur-[120px]"
        aria-hidden="true"
      />
      {/* Vệt sáng màu xanh nhạt (blur) ở góc trái */}
      <div
        className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-brand-light/20 blur-[120px]"
        aria-hidden="true"
      />
      
      {/* Lưới các dấu chấm nền (Grid overlay) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      
      {/* Render danh sách các ngôi sao nhấp nháy */}
      <div className="hero-stars" aria-hidden="true">
        {initialStars.map((style, i) => (
          <div key={i} className="hero-star" style={style} />
        ))}
      </div>

      <div className="home-hero-shell relative mx-auto">
        {/* Nhãn "Nền Tảng Tìm Việc Làm..." ở góc trên */}
        <div className="home-hero-badge inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 text-xs font-medium text-white/90">
          <Star
            className="h-3.5 w-3.5 fill-warning text-warning"
            aria-hidden="true"
          />
          Nền Tảng Tìm Việc Làm Cho Sinh Viên
        </div>

        {/* Khối Grid chia màn hình làm 2 nửa (Trái: Chữ + Thanh Search, Phải: Hình ảnh) */}
        <div className="home-hero-grid grid grid-cols-1 items-center lg:grid-cols-2">
          
          {/* NỬA TRÁI: TIÊU ĐỀ VÀ FORM TÌM KIẾM */}
          <div className="home-hero-copy text-center lg:text-left">
            <h1 className="text-pretty font-extrabold leading-tight text-white">
              Tìm kiếm việc làm <br className="hidden lg:block" />
              phù hợp cho{" "}
              {/* Chữ "Sinh Viên" được tô màu gradient bắt mắt */}
              <span className="bg-linear-to-r from-brand-light to-brand bg-clip-text text-transparent">
                Sinh Viên
              </span>
            </h1>

            <p className="mx-auto text-pretty leading-relaxed text-white/70 lg:mx-0">
              Khám phá hàng ngàn công việc Part-time, Internship và cơ hội việc
              làm mới ra trường đã được kiểm duyệt nghiêm ngặt.
            </p>

            {/* FORM TÌM KIẾM (Style kính mờ Glassmorphism) */}
            <form onSubmit={handleSearch} className="home-search-glass">
              <div className="home-search-glass-row">
                
                {/* Ô nhập từ khóa */}
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

                {/* Ô chọn địa điểm (Sử dụng thẻ select đè lên nhưng làm trong suốt opacity-0) */}
                <div className="home-search-glass-field home-search-glass-field--location">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  <span className="truncate text-sm">
                    {location || "Địa điểm"}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
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

                {/* Nút submit */}
                <button type="submit" className="home-search-glass-submit">
                  Tìm kiếm
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Danh sách từ khóa phổ biến */}
              <div className="home-search-glass-tags">
                <span>Phổ biến:</span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* NỬA PHẢI: HÌNH ẢNH MINH HỌA (Ẩn trên điện thoại, chỉ hiện trên PC) */}
          <div className="home-hero-art relative hidden lg:block">
            <img
              src="/images/home/hero-briefcase.png"
              alt="Minh họa tìm kiếm việc làm cho sinh viên"
              width="640"
              height="640"
              decoding="async" // Tối ưu tải ảnh nền, không block render
              className="mx-auto h-auto w-full max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionNew;
