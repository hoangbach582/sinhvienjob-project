import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Bookmark, ChevronLeft, ChevronRight, Filter, RotateCcw, SlidersHorizontal, List, LayoutGrid, Briefcase } from 'lucide-react';
import HomeNavbar from '../components/home/HomeNavbar';
import FooterNew from '../components/FooterNew';

const ITEMS_PER_PAGE = 5;

function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || '';
  const initialSalary = searchParams.get('salary') || '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [salary, setSalary] = useState(initialSalary);
  
  const [heroSearch, setHeroSearch] = useState(initialKeyword);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');

  const isSearching = searchParams.get('keyword') || searchParams.get('location') || searchParams.get('type') || searchParams.get('salary');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/employers', {
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : (data.data || []));
      } else {
        setCompanies(mockCompanies);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setCompanies(mockCompanies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (salary) params.append('salary', salary);
    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setKeyword('');
    setLocation('');
    setType('');
    setSalary('');
    setHeroSearch('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter companies based on search params (since mock doesn't hit real API with params yet)
  const currentKeyword = searchParams.get('keyword') || '';
  const filteredCompanies = companies.filter(company => 
    (company.company_name || '').toLowerCase().includes(currentKeyword.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
      <HomeNavbar />

      {/* Hero Search Section */}
      <section className="pt-28 pb-10 px-4 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #823feb 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />

        <div className="mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(130, 63, 235, 0.1)', border: '1px solid rgba(130, 63, 235, 0.2)' }}>
              <span className="text-brand-light text-xs font-semibold">✨ Khám phá</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Khám phá các <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)' }}>Công ty</span> nổi bật
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
              Tìm hiểu văn hóa công ty, môi trường làm việc và các cơ hội nghề nghiệp hấp dẫn dành riêng cho sinh viên thực tập và mới ra trường.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Nhập tên công ty bạn muốn tìm..."
              value={heroSearch}
              onChange={(e) => {
                setHeroSearch(e.target.value);
                setKeyword(e.target.value);
                const params = new URLSearchParams();
                if (e.target.value) params.append('keyword', e.target.value);
                setSearchParams(params);
              }}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none transition-all focus:border-brand-light/50 focus:bg-white/10"
              style={{ backdropFilter: 'blur(12px)' }}
            />
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Companies List */}
      <section className="flex-1 px-4 pb-16">
        <div className="mx-auto max-w-6xl flex gap-6 items-start">

          {/* Left Sidebar Filter */}
          <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-6">
            <div className="rounded-2xl p-6 sticky top-24" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-light" />
                  <h3 className="text-white font-semibold text-base m-0">Bộ lọc tìm kiếm</h3>
                </div>
                {isSearching && (
                  <button onClick={clearFilter} className="flex items-center gap-1 text-xs text-white/50 hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors">
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              <form onSubmit={handleFilter} className="flex flex-col gap-5">
                {/* Từ khóa */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Từ khóa</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Tên việc, công ty, kỹ năng..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none border box-border"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Địa điểm</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', WebkitAppearance: 'none' }}>
                      <option value="" style={{ background: '#1a1145' }}>Tất cả địa điểm</option>
                      <option value="Hà Nội" style={{ background: '#1a1145' }}>Hà Nội</option>
                      <option value="TP.HCM" style={{ background: '#1a1145' }}>TP.HCM</option>
                      <option value="Đà Nẵng" style={{ background: '#1a1145' }}>Đà Nẵng</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Hình thức làm việc */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Hình thức làm việc</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', WebkitAppearance: 'none' }}>
                      <option value="" style={{ background: '#1a1145' }}>Tất cả hình thức</option>
                      <option value="full_time" style={{ background: '#1a1145' }}>Toàn thời gian</option>
                      <option value="part_time" style={{ background: '#1a1145' }}>Bán thời gian</option>
                      <option value="internship" style={{ background: '#1a1145' }}>Thực tập sinh</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Mức lương */}
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Mức lương</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                    <select value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', WebkitAppearance: 'none' }}>
                      <option value="" style={{ background: '#1a1145' }}>Tất cả mức lương</option>
                      <option value="under_3" style={{ background: '#1a1145' }}>Dưới 3 triệu</option>
                      <option value="3_to_5" style={{ background: '#1a1145' }}>Từ 3 - 5 triệu</option>
                      <option value="over_10" style={{ background: '#1a1145' }}>Trên 10 triệu</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm border-none cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-1" style={{ background: 'linear-gradient(135deg, #823feb, #6366f1)' }}>
                  ✨ Áp dụng bộ lọc
                </button>
              </form>
            </div>

            {/* Promo Card */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(130,63,235,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(130,63,235,0.2)' }}>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #823feb, #6366f1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h4 className="text-white font-bold text-base mb-2">Tạo hồ sơ ngay</h4>
                <p className="text-white/60 text-sm mb-4">Nhận gợi ý công việc phù hợp với kỹ năng của bạn</p>
                <Link to="/build-cv" className="text-brand-light text-sm font-semibold hover:underline no-underline inline-flex items-center gap-1">
                  Tạo hồ sơ <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: Companies List */}
          <div className="flex-1 min-w-0">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-white font-semibold text-lg m-0 flex items-center gap-2">
                Tất cả công ty <span className="text-white/40 text-sm font-normal px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>{filteredCompanies.length} công ty</span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">Sắp xếp:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm text-white border cursor-pointer appearance-none" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', WebkitAppearance: 'none' }}>
                    <option value="newest" style={{ background: '#1a1145' }}>Mới nhất</option>
                    <option value="popular" style={{ background: '#1a1145' }}>Phổ biến</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/40 -ml-6 pointer-events-none" />
                </div>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => setViewMode('list')} className={`p-2 border-none cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-brand/80 text-white' : 'bg-transparent text-white/40 hover:text-white/70'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={`p-2 border-none cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-brand/80 text-white' : 'bg-transparent text-white/40 hover:text-white/70'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company Cards */}
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="h-3 w-1/3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-base m-0">Không tìm thấy công ty nào khớp với tiêu chí của bạn.</p>
                <button onClick={clearFilter} className="mt-4 px-6 py-2 rounded-xl text-sm text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg, #823feb, #6366f1)' }}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                {paginatedCompanies.map((company) => {
                  // Mock data interpretation based on image
                  let avatarBg = '#1E3A8A'; // default blue
                  let typeBadge = '';
                  let salaryText = '';
                  let postedTime = '';
                  let badgeClass = '';

                  // Dummy logic to match the visual variety in the screenshot
                  if (company.id % 4 === 1) { avatarBg = '#1E3A8A'; typeBadge = 'Bán thời gian'; salaryText = '3 - 4 triệu'; postedTime = '2 giờ trước'; badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'; }
                  else if (company.id % 4 === 2) { avatarBg = '#4C1D95'; typeBadge = 'Thực tập sinh'; salaryText = '4 - 5 triệu'; postedTime = '4 giờ trước'; badgeClass = 'bg-pink-500/15 text-pink-400 border-pink-500/20'; }
                  else if (company.id % 4 === 3) { avatarBg = '#064E3B'; typeBadge = 'Bán thời gian'; salaryText = '1 - 3 triệu'; postedTime = '6 giờ trước'; badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'; }
                  else { avatarBg = '#7C2D12'; typeBadge = 'Toàn thời gian'; salaryText = '10 - 20 triệu'; postedTime = '8 giờ trước'; badgeClass = 'bg-blue-500/15 text-blue-400 border-blue-500/20'; }

                  return (
                    <div
                      key={company.id}
                      className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(130,63,235,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(130,63,235,0.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Company Avatar */}
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 overflow-hidden" style={{ backgroundColor: avatarBg, color: 'white' }}>
                          {company.logo ? (
                            <img src={company.logo} alt={company.company_name} className="w-full h-full object-cover" />
                          ) : (
                            company.company_name?.substring(0, 2).toUpperCase() || 'CT'
                          )}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={`/companies/${company.id}`} className="text-white font-bold text-lg hover:text-brand-light transition-colors no-underline truncate">
                                  {company.company_name}
                                </Link>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#3B82F6"/></svg>
                              </div>
                              <p className="text-white/60 text-sm mt-1 mb-0 truncate">
                                {company.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                {typeBadge}
                              </span>
                              <button className="bg-transparent border-none text-white/40 hover:text-brand-light cursor-pointer transition-colors p-1">
                                <Bookmark className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1.5 text-white/50">
                                <MapPin className="w-4 h-4" /> {company.address || 'Đang cập nhật'}
                              </span>
                              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                <Briefcase className="w-4 h-4" /> {salaryText}
                              </span>
                            </div>
                            <span className="text-white/40 text-xs">
                              {postedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredCompanies.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-white/30 text-sm">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer text-sm font-semibold transition-all"
                      style={{
                        background: currentPage === page ? 'linear-gradient(135deg, #823feb, #6366f1)' : 'rgba(255,255,255,0.06)',
                        color: currentPage === page ? 'white' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
}

const mockCompanies = [
  { id: 1, company_name: "Techcombank", address: "Hà Nội", description: "Ngân hàng TMCP Kỹ Thương Việt Nam" },
  { id: 2, company_name: "YouTube", address: "Hà Nội", description: "Nền tảng video lớn nhất thế giới" },
  { id: 3, company_name: "Swagbucks", address: "Remote", description: "Nền tảng kiếm tiền & khảo sát trực tuyến" },
  { id: 4, company_name: "VNG Corporation", address: "Quận 7, TP. Hồ Chí Minh", description: "Công ty công nghệ & giải trí hàng đầu Việt Nam" },
  { id: 5, company_name: "Tập đoàn Công nghệ FPT", address: "Khu CNC Hòa Lạc, Hà Nội", description: "Tập đoàn công nghệ hàng đầu Việt Nam" },
  { id: 6, company_name: "Shopee Việt Nam", address: "Tòa nhà Capital Place, Hà Nội", description: "Nền tảng thương mại điện tử hàng đầu Đông Nam Á" },
];

export default Companies;