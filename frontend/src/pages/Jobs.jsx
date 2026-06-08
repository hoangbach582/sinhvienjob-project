import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import HomeNavbar from "../components/home/HomeNavbar";
import FooterNew from "../components/FooterNew";
import SaveButton from "../components/SaveButton";

const ITEMS_PER_PAGE = 5;

const popularTags = [
  "ReactJS",
  "Marketing",
  "Part-time",
  "Thực tập",
  "Designer",
];

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialType = searchParams.get("type") || "";
  const initialSalary = searchParams.get("salary") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [salary, setSalary] = useState(initialSalary);
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [searchLocation, setSearchLocation] = useState(initialLocation);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  const isSearching =
    searchParams.get("keyword") ||
    searchParams.get("location") ||
    searchParams.get("type") ||
    searchParams.get("salary");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.get("keyword"))
        params.append("keyword", searchParams.get("keyword"));
      if (searchParams.get("location"))
        params.append("location", searchParams.get("location"));
      if (searchParams.get("type"))
        params.append("type", searchParams.get("type"));
      if (searchParams.get("salary"))
        params.append("salary", searchParams.get("salary"));

      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs?${params.toString()}`,
      );
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (salary) params.append("salary", salary);
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (searchLocation) params.append("location", searchLocation);
    setSearchParams(params);
    setKeyword(searchKeyword);
    setLocation(searchLocation);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSearchKeyword(tag);
    setKeyword(tag);
    const params = new URLSearchParams();
    params.append("keyword", tag);
    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setKeyword("");
    setLocation("");
    setType("");
    setSalary("");
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

  // Pagination
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className="home-page min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
      }}
    >
      <HomeNavbar />

      {/* Hero Search Section */}
      <section className="pt-28 pb-10 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #823feb 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-6xl relative z-10">
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

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              marginTop: "1.2rem",
              background: "rgba(255,255,255,0.06)",
              padding: "1.6rem 1.6rem 0.4rem",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-3 rounded-2xl p-3">
              <div
                className="flex items-center gap-3 flex-1 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  paddingLeft: "1rem",
                }}
              >
                <Search className="w-5 h-5 text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm"
                />
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 sm:w-56"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  padding: "0 1rem",
                }}
              >
                <MapPin className="w-5 h-5 text-white/40 shrink-0" />
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
                className="flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-white font-semibold text-sm border-none cursor-pointer transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #823feb, #6366f1)",
                  marginTop: "0",
                  marginBottom: "0",
                }}
              >
                Tìm kiếm <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span className="text-white/50 text-sm">Phổ biến:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-1.5 rounded-full text-sm text-white/80 border cursor-pointer transition-all hover:bg-white/15 hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
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
              minHeight: "49.563rem",
              background: "rgba(255,255,255,0.05)",
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
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
              {/* Từ khóa */}
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium">
                  Từ khóa
                </label>
                <input
                  type="text"
                  placeholder="Tên việc, công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none border box-border"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
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
                <label className="block text-sm text-white/60 mb-2 font-medium">
                  Hình thức làm việc
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.1)",
                      WebkitAppearance: "none",
                    }}
                  >
                    <option value="" style={{ background: "#1a1145" }}>
                      Tất cả hình thức
                    </option>
                    <option value="full_time" style={{ background: "#1a1145" }}>
                      Toàn thời gian
                    </option>
                    <option value="part_time" style={{ background: "#1a1145" }}>
                      Bán thời gian
                    </option>
                    <option
                      value="internship"
                      style={{ background: "#1a1145" }}
                    >
                      Thực tập sinh
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Mức lương */}
              <div>
                <label className="block text-sm text-white/60 mb-2 font-medium">
                  Mức lương
                </label>
                <div className="relative">
                  <select
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none border cursor-pointer appearance-none box-border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.1)",
                      WebkitAppearance: "none",
                    }}
                  >
                    <option value="" style={{ background: "#1a1145" }}>
                      Tất cả mức lương
                    </option>
                    <option value="under_3" style={{ background: "#1a1145" }}>
                      Dưới 3 triệu
                    </option>
                    <option value="3_to_5" style={{ background: "#1a1145" }}>
                      Từ 3 - 5 triệu
                    </option>
                    <option value="5_to_10" style={{ background: "#1a1145" }}>
                      Từ 5 - 10 triệu
                    </option>
                    <option value="over_10" style={{ background: "#1a1145" }}>
                      Trên 10 triệu
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                <span className="text-white font-bold text-lg">
                  {jobs.length.toLocaleString()}
                </span>{" "}
                việc làm phù hợp
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2"
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
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                      backgroundColor: viewMode === "list" ? "#6530f1" : "transparent",
                      border: viewMode === "list" ? "none" : "1px solid rgba(255,255,255,0.1)",
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
                      backgroundColor: viewMode === "grid" ? "#6530f1" : "transparent",
                      border: viewMode === "grid" ? "none" : "1px solid rgba(255,255,255,0.1)",
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
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                {paginatedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(130,63,235,0.4)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(130,63,235,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className={`flex ${viewMode === "grid" ? "flex-col" : "items-start gap-4"} flex-1`}>
                      {/* Company Avatar & Badges */}
                      <div className={`flex justify-between items-start ${viewMode === "grid" ? "w-full mb-4" : "shrink-0"}`}>
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
                        <div className={`flex ${viewMode === "grid" ? "flex-col" : "items-start justify-between gap-3 mb-1"}`}>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                to={`/job/${job.id}`}
                                className="text-white font-bold text-base hover:text-brand-light transition-colors no-underline truncate block"
                                style={viewMode === "grid" ? { maxWidth: "100%" } : {}}
                              >
                                {job.title}
                              </Link>
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 shrink-0"
                                style={{
                                  background: "rgba(16,185,129,0.15)",
                                  border: "1px solid rgba(16,185,129,0.25)",
                                }}
                              >
                                Mới
                              </span>
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

                        <div className={`flex items-center justify-between ${viewMode === "grid" ? "mt-4" : "mt-3"}`}>
                          <div className={`flex items-center gap-4 text-sm flex-wrap`}>
                            <span className="flex items-center gap-1.5 text-white/50">
                              <MapPin className="w-3.5 h-3.5" /> {job.location}
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
                          className="flex items-center gap-1 text-sm text-white/50 hover:text-brand-light transition-colors no-underline font-medium"
                        >
                          Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && jobs.length > ITEMS_PER_PAGE && (
              <div
                style={{ marginTop: "1rem" }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`dots-${idx}`}
                      className="w-9 h-9 flex items-center justify-center text-white/30 text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer text-sm font-semibold transition-all"
                      style={{
                        background:
                          currentPage === page
                            ? "linear-gradient(135deg, #823feb, #6366f1)"
                            : "rgba(255,255,255,0.06)",
                        color:
                          currentPage === page
                            ? "white"
                            : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.06)" }}
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

export default Jobs;
