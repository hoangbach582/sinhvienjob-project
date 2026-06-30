import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import JobHoverPreview from "../components/job/JobHoverPreview";
import RecommendationPanel from "../components/job/RecommendationPanel";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  MapPin,
  ChevronDown,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  List,
  LayoutGrid,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";
import HomeNavbar from "../components/home/HomeNavbar";
import FooterNew from "../components/FooterNew";
import SEOHead from "../components/SEOHead";
import SaveButton from "../components/SaveButton";



const popularTags = [
  "ReactJS",
  "Marketing",
  "Part-time",
  "Thực tập",
  "Designer",
];

function Jobs() {
  const { isLoggedIn, userRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialType = searchParams.get("type") || "";
  const initialSalary = searchParams.get("salary") || "";
  const initialIndustry = searchParams.get("industry") || "";
  const initialExperience = searchParams.get("experience") || "";
  const initialRecommended = searchParams.get("recommended") === "true";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [salary, setSalary] = useState(initialSalary);
  const [industry, setIndustry] = useState(initialIndustry);
  const [experience, setExperience] = useState(initialExperience);
  const [isRecommended, setIsRecommended] = useState(initialRecommended);

  // Panel gợi ý việc làm cá nhân hóa
  const [showRecommendations, setShowRecommendations] = useState(false);
  const isStudent = isLoggedIn && userRole === "student";

  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [searchLocation, setSearchLocation] = useState(initialLocation);

  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("jobSearchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  // Hover preview state
  const [hoveredJob, setHoveredJob] = useState(null);
  const hoveredCardRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const isSearching =
    searchParams.get("keyword") ||
    searchParams.get("location") ||
    searchParams.get("type") ||
    searchParams.get("salary") ||
    searchParams.get("industry") ||
    searchParams.get("experience") ||
    searchParams.get("recommended") === "true";

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/categories/industries",
        );
        if (response.ok) {
          const data = await response.json();
          setIndustries(data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách ngành nghề:", error);
      }
    };
    fetchIndustries();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.get("keyword")) params.append("keyword", searchParams.get("keyword"));
      if (searchParams.get("location")) params.append("location", searchParams.get("location"));
      if (searchParams.get("type")) params.append("type", searchParams.get("type"));
      if (searchParams.get("salary")) params.append("salary", searchParams.get("salary"));
      if (searchParams.get("industry")) params.append("industry", searchParams.get("industry"));
      if (searchParams.get("experience")) params.append("experience", searchParams.get("experience"));
      if (searchParams.get("recommended") === "true") params.append("recommended", "true");
      params.append("page", currentPage);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`http://127.0.0.1:8000/api/jobs?${params.toString()}`, { headers });
      if (response.ok) {
        const result = await response.json();
        setJobs(result.data);
        setTotalJobs(result.total);
        setTotalPages(result.last_page);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (salary) params.append("salary", salary);
    if (industry) params.append("industry", industry);
    if (experience) params.append("experience", experience);
    if (isRecommended) params.append("recommended", "true");
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (searchLocation) params.append("location", searchLocation);
    if (industry) params.append("industry", industry);
    setSearchParams(params);
    setKeyword(searchKeyword);
    setLocation(searchLocation);
    setCurrentPage(1);

    if (searchKeyword.trim()) {
      const newHistory = [
        searchKeyword.trim(),
        ...searchHistory.filter((k) => k !== searchKeyword.trim()),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("jobSearchHistory", JSON.stringify(newHistory));
    }
    setIsSearchFocused(false);
  };

  const handleTagClick = (tag) => {
    setSearchKeyword(tag);
    setKeyword(tag);
    const params = new URLSearchParams();
    params.append("keyword", tag);
    if (searchLocation) params.append("location", searchLocation);
    if (industry) params.append("industry", industry);
    setSearchParams(params);
    setCurrentPage(1);

    const newHistory = [tag, ...searchHistory.filter((k) => k !== tag)].slice(
      0,
      5,
    );
    setSearchHistory(newHistory);
    localStorage.setItem("jobSearchHistory", JSON.stringify(newHistory));
    setIsSearchFocused(false);
  };

  const clearFilter = () => {
    setKeyword("");
    setLocation("");
    setType("");
    setSalary("");
    setIndustry("");
    setExperience("");
    setIsRecommended(false);
    setSearchKeyword("");
    setSearchLocation("");
    setSearchParams({});
    setCurrentPage(1);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return "Thỏa thuận";
  };

  const translateType = (jobType) => {
    const types = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      internship: "Thực tập sinh",
    };
    return types[jobType] || jobType;
  };

  const getTypeBadgeColor = (jobType) => {
    const colors = {
      full_time: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      part_time: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      internship: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    };
    return colors[jobType] || "bg-brand/15 text-brand-light border-brand/20";
  };

  const getTimeLabel = (createdAt) => {
    if (!createdAt) return "Mới";
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffTime = Math.abs(now - createdDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return "Mới";
    }
    return `${diffDays} ngày trước`;
  };

  // Pagination is handled by infinite scroll now

  return (
    <div
      className="home-page min-h-screen flex flex-col overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
      }}
    >
      <SEOHead 
        title="Việc làm Sinh Viên" 
        description="Hàng ngàn cơ hội việc làm part-time, thực tập và freelancer đang chờ đón bạn." 
      />
      <HomeNavbar />

      {/* Hero Search Section */}
      <section
        className="relative px-4"
        style={{
          minHeight: "auto",
          paddingTop: "8rem",
          paddingBottom: "0.9rem",
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #823feb 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-8"
            style={{
              background:
                "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            }}
          />
        </div>

        <div
          className="max-w-6xl relative z-10"
          style={{ margin: "0 auto", width: "100%" }}
        >
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap"
            style={{ marginLeft: "0.5rem" }}
          >
            <Link
              to="/"
              className="hover:text-white transition-colors no-underline text-white/50"
            >
              Trang chủ
            </Link>
            <span>›</span>
            <span className="text-white/80">Tìm việc</span>
          </nav>

          {/* Search Bar Wrapper */}
          <div className="relative z-50">
            <form
              onSubmit={handleHeroSearch}
              style={{
                marginTop: "1.2rem",
                background: "rgba(255,255,255,0.06)",
                padding: "1.6rem",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                borderRadius: "1.5rem",
              }}
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3 rounded-2xl p-0">
                <div
                  className="flex items-center gap-3 flex-1 rounded-xl px-4 py-3 transition-all focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-brand/50"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    paddingLeft: "1rem",
                  }}
                >
                  <Search className="w-5 h-5 text-brand-light/70 shrink-0" />
                  <input
                    type="text"
                    placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm"
                  />
                </div>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 sm:w-56 transition-all focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-brand/50"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    padding: "0 1rem",
                  }}
                >
                  <MapPin className="w-5 h-5 text-brand-light/70 shrink-0" />
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white text-sm cursor-pointer appearance-none"
                    style={{ WebkitAppearance: "none" }}
                  >
                    <option
                      value=""
                      style={{ background: "#1a1145", color: "white" }}
                    >
                      Tất cả địa điểm
                    </option>
                    <option
                      value="Hà Nội"
                      style={{ background: "#1a1145", color: "white" }}
                    >
                      Hà Nội
                    </option>
                    <option
                      value="TP.HCM"
                      style={{ background: "#1a1145", color: "white" }}
                    >
                      TP.HCM
                    </option>
                    <option
                      value="Đà Nẵng"
                      style={{ background: "#1a1145", color: "white" }}
                    >
                      Đà Nẵng
                    </option>
                    <option
                      value="Remote"
                      style={{ background: "#1a1145", color: "white" }}
                    >
                      Remote
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-white font-semibold text-sm border-none cursor-pointer transition-all hover:-translate-y-0.5 hover-lift ripple-button"
                  style={{
                    background: "linear-gradient(135deg, #823feb, #6366f1)",
                    marginTop: "0",
                    marginBottom: "0",
                  }}
                >
                  Tìm kiếm <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* Search Dropdown / History */}
            {isSearchFocused && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#16103a] rounded-2xl border border-white/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm font-medium flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Lịch sử tìm kiếm
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchHistory.length > 0 ? (
                    searchHistory.map((historyItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleTagClick(historyItem)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 text-sm cursor-pointer transition-colors"
                      >
                        {historyItem}
                      </button>
                    ))
                  ) : (
                    <span className="text-white/30 text-sm italic">
                      Chưa có lịch sử tìm kiếm
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm font-medium flex items-center gap-2">
                    <Search className="w-4 h-4" /> Từ khóa phổ biến
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => handleTagClick(tag)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 text-brand-light text-sm cursor-pointer transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Jobs */}
      <section
        className="flex-1 px-4 pb-16"
        style={{
          marginBottom: "1rem",
          marginLeft: "3.6rem",
          marginTop: "1.6rem",
        }}
      >
        <div className="mx-auto max-w-6xl flex gap-6 items-start">
          {/* Left Sidebar Filter */}
          <aside
            className="w-72 shrink-0 rounded-2xl p-6 sticky top-24 hidden lg:block"
            style={{
              minHeight: 0,
              background: "rgba(255,255,255,0.05)",
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="hidden flex-items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-light" />
                <h3 className="text-white font-semibold text-base m-0">
                  Lọc công việc
                </h3>
              </div>
              {isSearching && (
                <button
                  onClick={clearFilter}
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
              )}
            </div>

            <form
              onSubmit={handleFilter}
              className="flex flex-col gap-5"
              style={{ marginTop: "1rem" }}
            >
              {/* Ngành nghề */}
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium">
                  Ngành nghề
                </label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.1)",
                      WebkitAppearance: "none",
                    }}
                  >
                    <option value="" style={{ background: "#1a1145" }}>
                      Tất cả ngành nghề
                    </option>
                    {industries.map((ind) => (
                      <option
                        key={ind.id}
                        value={ind.name}
                        style={{ background: "#1a1145" }}
                      >
                        {ind.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium">
                  Địa điểm
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.1)",
                      WebkitAppearance: "none",
                    }}
                  >
                    <option value="" style={{ background: "#1a1145" }}>
                      Tất cả địa điểm
                    </option>
                    <option value="Hà Nội" style={{ background: "#1a1145" }}>
                      Hà Nội
                    </option>
                    <option value="TP.HCM" style={{ background: "#1a1145" }}>
                      TP.HCM
                    </option>
                    <option value="Đà Nẵng" style={{ background: "#1a1145" }}>
                      Đà Nẵng
                    </option>
                    <option value="Remote" style={{ background: "#1a1145" }}>
                      Remote
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Hình thức */}
              <div>
                <label className="block text-sm text-white/60 mb-3 font-medium">
                  Hình thức làm việc
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "", label: "Tất cả" },
                    { value: "full_time", label: "Toàn thời gian" },
                    { value: "part_time", label: "Bán thời gian" },
                    { value: "internship", label: "Thực tập sinh" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setType(item.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        type === item.value
                          ? "bg-brand/20 text-brand-light border-brand/50 shadow-[0_0_10px_rgba(130,63,235,0.2)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/90"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức lương */}
              <div>
                <label className="block text-sm text-white/60 mb-3 font-medium">
                  Mức lương
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "", label: "Tất cả" },
                    { value: "under_3", label: "Dưới 3 triệu" },
                    { value: "3_to_5", label: "3 - 5 triệu" },
                    { value: "5_to_10", label: "5 - 10 triệu" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSalary(item.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        salary === item.value
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/90"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold text-sm border-none cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-1"
                style={{
                  background: "linear-gradient(135deg, #823feb, #6366f1)",
                }}
              >
                <Filter className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
            </form>
          </aside>

          {/* Right: Job List */}
          <div
            className="flex-1 min-w-0"
            style={{
              borderRadius: "1rem",
              backgroundColor: "#1d225e",
              padding: "1rem",
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between mb-5 flex-wrap gap-3"
              style={{ marginBottom: "0.8rem" }}
            >
              <p className="text-white/70 text-sm m-0">
                {isSearching ? (
                  <>
                    <span className="text-white font-bold text-lg">
                      {totalJobs.toLocaleString()}
                    </span>{" "}
                    việc làm phù hợp
                  </>
                ) : (
                  <>
                    Tất cả{" "}
                    <span className="text-white font-bold text-lg">
                      {totalJobs.toLocaleString()}
                    </span>{" "}
                    việc làm
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                {/* Nút Gợi ý – chỉ hiện khi sinh viên đã đăng nhập */}
                {isStudent && (
                  <button
                    onClick={() => setShowRecommendations(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-all bg-transparent text-white/60 border-white/10 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                    title="Xem việc làm được gợi ý riêng cho bạn"
                  >
                    <Sparkles className="w-4 h-4" />
                    Gợi ý cho bạn
                  </button>
                )}
                <div
                  className="hidden items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    padding: "0.45rem",
                    borderRadius: "0.6rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span className="text-white/50 text-sm">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white border cursor-pointer appearance-none"
                    style={{
                      width: "6.4rem",
                      padding: "0.2rem 0.8rem",
                      borderColor: "rgba(255,255,255,0.1)",
                      WebkitAppearance: "none",
                    }}
                  >
                    <option value="newest" style={{ background: "#1a1145" }}>
                      Mới nhất
                    </option>
                    <option value="salary" style={{ background: "#1a1145" }}>
                      Lương cao
                    </option>
                  </select>
                  <svg
                    style={{ marginLeft: "-1.6rem", cursor: "pointer" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#fff"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="flex rounded-lg overflow-hidden gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 border-none cursor-pointer transition-colors flex items-center justify-center ${viewMode === "list" ? "text-white" : "bg-transparent text-white/40 hover:text-white/70"}`}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "0.4rem",
                      marginBottom: "0.2rem",
                      backgroundColor:
                        viewMode === "list" ? "#6530f1" : "transparent",
                      border:
                        viewMode === "list"
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 border-none cursor-pointer transition-colors flex items-center justify-center ${viewMode === "grid" ? "text-white" : "bg-transparent text-white/40 hover:text-white/70"}`}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "0.4rem",
                      marginBottom: "0.2rem",
                      backgroundColor:
                        viewMode === "grid" ? "#6530f1" : "transparent",
                      border:
                        viewMode === "grid"
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 animate-pulse"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-14 h-14 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      />
                      <div className="flex-1 space-y-3">
                        <div
                          className="h-4 w-2/3 rounded"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        />
                        <div
                          className="h-3 w-1/3 rounded"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                        <div
                          className="h-3 w-1/2 rounded"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                }}
              >
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-base m-0">
                  Rất tiếc, không tìm thấy công việc nào khớp với tiêu chí của
                  bạn.
                </p>
                <button
                  onClick={clearFilter}
                  className="mt-4 px-6 py-2 rounded-xl text-sm text-white border-none cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #823feb, #6366f1)",
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {jobs.map((job) => {
                  return (
                  <motion.div
                    key={job.id}
                    ref={(el) => { if (hoveredJob?.id === job.id) hoveredCardRef.current = el; }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full hover:border-brand/40 hover:shadow-[0_8px_32px_rgba(130,63,235,0.15)] bg-white/5 border border-white/10 backdrop-blur-md hover-card"
                    onMouseEnter={(e) => {
                      hoveredCardRef.current = e.currentTarget;
                      clearTimeout(hoverTimerRef.current);
                      hoverTimerRef.current = setTimeout(() => setHoveredJob(job), 200);
                    }}
                    onMouseLeave={() => {
                      clearTimeout(hoverTimerRef.current);
                      hoverTimerRef.current = setTimeout(() => setHoveredJob(null), 100);
                    }}
                  >
                    <div
                      className={`flex ${viewMode === "grid" ? "flex-col" : "items-start gap-4"} flex-1`}
                    >
                      {/* Company Avatar & Badges */}
                      <div
                        className={`flex justify-between items-start ${viewMode === "grid" ? "w-full mb-4" : "shrink-0"}`}
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #823feb, #6366f1)",
                            color: "white",
                          }}
                        >
                          {job.employer?.company_name
                            ?.substring(0, 2)
                            .toUpperCase() || "CT"}
                        </div>
                        {viewMode === "grid" && (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(job.type)}`}
                            >
                              {translateType(job.type)}
                            </span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <SaveButton
                                jobId={job.id}
                                variant="minimal"
                                size={18}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div
                          className={`flex ${viewMode === "grid" ? "flex-col" : "items-start justify-between gap-3 mb-1"}`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                to={`/job/${job.id}`}
                                className="text-white font-bold text-base hover:text-brand-light transition-colors no-underline truncate block"
                                style={
                                  viewMode === "grid"
                                    ? { maxWidth: "100%" }
                                    : {}
                                }
                              >
                                {job.title}
                              </Link>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                  getTimeLabel(job.reviewed_at || job.created_at) === "Mới"
                                    ? "text-emerald-300"
                                    : "text-white/60"
                                }`}
                                style={{
                                  background:
                                    getTimeLabel(job.reviewed_at || job.created_at) === "Mới"
                                      ? "rgba(16,185,129,0.15)"
                                      : "rgba(255,255,255,0.1)",
                                  border:
                                    getTimeLabel(job.reviewed_at || job.created_at) === "Mới"
                                      ? "1px solid rgba(16,185,129,0.25)"
                                      : "1px solid rgba(255,255,255,0.15)",
                                }}
                              >
                                {getTimeLabel(job.reviewed_at || job.created_at)}
                              </span>
                              {job.is_recommended && (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-bold text-indigo-300 shrink-0 flex items-center gap-1"
                                  style={{
                                    background: "rgba(99,102,241,0.15)",
                                    border: "1px solid rgba(99,102,241,0.25)",
                                  }}
                                >
                                  ✨ Phù hợp
                                </span>
                              )}
                            </div>
                            <Link
                              to={`/job/${job.id}`}
                              className="text-brand-light text-sm mt-1 block no-underline hover:underline"
                            >
                              {job.employer?.company_name || "Đang cập nhật"}
                            </Link>
                          </div>

                          {viewMode === "list" && (
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(job.type)}`}
                              >
                                {translateType(job.type)}
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <SaveButton
                                  jobId={job.id}
                                  variant="minimal"
                                  size={18}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex items-center justify-between ${viewMode === "grid" ? "mt-4" : "mt-3"}`}
                        >
                          <div
                            className={`flex items-center gap-4 text-sm flex-wrap`}
                          >
                            <span className="flex items-center gap-1.5 text-white/50">
                              <MapPin className="w-3.5 h-3.5" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 text-white/50">
                              <Users className="w-3.5 h-3.5" />{" "}
                              {job.vacancies
                                ? `${job.vacancies} người`
                                : "Không giới hạn"}
                            </span>
                            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                              💰 {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                          </div>
                          {viewMode === "list" && (
                            <Link
                              to={`/job/${job.id}`}
                              className="flex items-center gap-1 text-sm text-white/50 hover:text-brand-light transition-colors no-underline font-medium"
                            >
                              Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {viewMode === "grid" && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                        <Link
                          to={`/job/${job.id}`}
                          className="flex items-center gap-1 text-sm text-white/50 group-hover:text-brand-light transition-colors no-underline font-medium"
                        >
                          Chi tiết <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                  );
                })}
              </motion.div>

              {/* Hover Preview Portal */}
              <JobHoverPreview
                job={hoveredJob}
                anchorRef={hoveredCardRef}
                visible={!!hoveredJob}
                formatSalary={formatSalary}
                translateType={translateType}
                onMouseEnter={() => clearTimeout(hoverTimerRef.current)}
                onMouseLeave={() => {
                  clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = setTimeout(() => setHoveredJob(null), 100);
                }}
              />
              </>
            )}
            {/* Numeric Pagination */}
            {totalPages > 1 && (
              <div 
                className="flex justify-center items-center gap-2 border-t border-white/10"
                style={{ paddingTop: "1rem", marginTop: "1rem", paddingBottom: "1.5rem" }}
              >
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer transition-all bg-transparent text-white border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      totalPages > 5 &&
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      Math.abs(currentPage - pageNumber) > 1
                    ) {
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="text-white/50 px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => {
                          setCurrentPage(pageNumber);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all cursor-pointer border ${
                          currentPage === pageNumber
                            ? "bg-violet-600 text-white border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                            : "bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer transition-all bg-transparent text-white border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Removed Local Pagination UI */}
          </div>
        </div>
      </section>

      <FooterNew />

      {/* Panel gợi ý việc làm cá nhân hóa */}
      {isStudent && (
        <RecommendationPanel
          isOpen={showRecommendations}
          onClose={() => setShowRecommendations(false)}
          searchHistory={searchHistory}
        />
      )}
    </div>
  );
}

export default Jobs;
