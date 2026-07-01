import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import HomeNavbar from "../components/home/HomeNavbar";
import FooterNew from "../components/FooterNew";
import SEOHead from "../components/SEOHead";
import { AuthContext } from "../context/AuthContext";
import {
  MapPin,
  Briefcase,
  Globe,
  ExternalLink,
  Calendar,
  Info,
  Search,
  ShieldCheck,
  Star,
  Users,
  Trophy,
  Heart,
  Share2,
  Quote,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Gem,
  Shield,
  GraduationCap,
  Clock,
  Sparkles,
  Landmark,
  CreditCard,
  Building2,
} from "lucide-react";

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState({});
  const [similarCompaniesList, setSimilarCompaniesList] = useState([]);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    average_rating: 0,
    total_reviews: 0,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const { user } = useContext(AuthContext);

  const galleryRef = useRef(null);
  const similarRef = useRef(null);

  // Formatter for Salary
  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return "Thỏa thuận";
  };

  // Translator for Job Type
  const translateType = (type) => {
    const types = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      internship: "Thực tập sinh",
    };
    return types[type] || type;
  };

  // Scroll Helpers
  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${${API_BASE}}/employers/${id}`,
          {
            headers: { Accept: "application/json" },
          },
        );
        if (response.ok) {
          const data = await response.json();

          // Fetch reviews
          try {
            const reviewsRes = await fetch(
              `${${API_BASE}}/employers/${id}/reviews`,
              {
                headers: { Accept: "application/json" },
              },
            );
            if (reviewsRes.ok) {
              const reviewsDataRaw = await reviewsRes.json();
              if (active) setReviewsData(reviewsDataRaw);
            }
          } catch (error) {
            console.error("Lỗi tải đánh giá:", error);
          }

          if (active) {
            setCompany(data);

            // Lấy thêm công ty từ database thật để làm gợi ý nếu chưa đủ
            let similar = data.similar_companies || [];
            if (similar.length < 8) {
              try {
                const allRes = await fetch(
                  `${${API_BASE}}/employers`,
                  {
                    headers: { Accept: "application/json" },
                  },
                );
                if (allRes.ok) {
                  const allData = await allRes.json();
                  const employersList = allData.data || allData;
                  if (Array.isArray(employersList)) {
                    const existingIds = new Set([
                      data.id,
                      ...similar.map((s) => s.id),
                    ]);
                    const more = employersList.filter(
                      (e) => !existingIds.has(e.id),
                    );
                    similar = [...similar, ...more].slice(0, 8);
                  }
                }
              } catch (err) {
                console.error("Lỗi khi lấy thêm công ty tương tự:", err);
              }
            }
            setSimilarCompaniesList(similar);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết công ty:", err);
        setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        className="home-page min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-white/20 border-t-brand-light rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm font-medium">
              Đang tải thông tin công ty...
            </p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  if (!company) {
    return (
      <div
        className="home-page min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)",
        }}
      >
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <Info className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-6">
              Không tìm thấy thông tin công ty này!
            </p>
            <Link
              to="/companies"
              className="inline-block px-6 py-2.5 rounded-xl text-white font-medium text-sm border-none cursor-pointer transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #823feb, #6366f1)",
                textDecoration: "none",
              }}
            >
              ← Quay lại danh sách công ty
            </Link>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  const companyLogo = company.logo_url || "";
  const companyDesc = company.description || "Chưa có mô tả ngắn.";
  const companyAbout =
    company.about || "Chưa có thông tin giới thiệu chi tiết.";
  const companyIndustry = company.industry || "Chưa cập nhật";
  const companyAddress = company.address || "Chưa cập nhật";
  const employees = company.employee_count || "Chưa cập nhật";
  const founded = company.founded_year || "Chưa cập nhật";
  const jobsCount = company.jobs_count || 0;
  const rating = "4.8"; // Placeholder if not in DB yet
  const topWorkplace = "Top 1"; // Placeholder

  // Tags are currently not in DB, so we'll just not show them or show generic ones
  const tags = [
    "Môi trường năng động",
    "Cơ hội phát triển",
    "Lương thưởng cạnh tranh",
  ];

  // Benefits
  const dbBenefits = company.benefits || [];
  const icons = [Gem, Shield, GraduationCap, Clock];
  const colors = [
    "text-amber-400 bg-amber-400/10",
    "text-blue-400 bg-blue-400/10",
    "text-purple-400 bg-purple-400/10",
    "text-emerald-400 bg-emerald-400/10",
  ];

  const benefits = dbBenefits.map((b, idx) => {
    // If format is "Title: Description"
    const parts = b.split(":");
    const title = parts[0]?.trim();
    const desc =
      parts.length > 1
        ? parts.slice(1).join(":").trim()
        : "Môi trường làm việc tuyệt vời";
    return {
      title,
      desc,
      icon: icons[idx % icons.length],
      color: colors[idx % colors.length],
    };
  });

  // Gallery office images
  const defaultGalleryImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  ];
  let galleryImages = company.gallery_images || [];
  if (galleryImages.length < 5) {
    const needed = 5 - galleryImages.length;
    galleryImages = [
      ...galleryImages,
      ...defaultGalleryImages.slice(0, needed),
    ];
  }

  // Reviews Data
  const ratingAverage = parseFloat(rating);

  // Jobs data
  const displayJobs = company.jobs || [];

  // Similar Companies List
  const similarCompanies = similarCompaniesList;

  // Review submission
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "student") return;

    setSubmittingReview(true);
    setReviewError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${${API_BASE}}/employers/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewForm),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setShowReviewForm(false);
        setReviewForm({ rating: 5, review: "" });
        // Refresh reviews
        const reviewsRes = await fetch(
          `${${API_BASE}}/employers/${id}/reviews`,
          {
            headers: { Accept: "application/json" },
          },
        );
        if (reviewsRes.ok) {
          const reviewsDataRaw = await reviewsRes.json();
          setReviewsData(reviewsDataRaw);
        }
      } else {
        setReviewError(data.message || "Có lỗi xảy ra khi gửi đánh giá.");
      }
    } catch (err) {
      setReviewError("Lỗi kết nối máy chủ.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <div className="home-page min-h-screen flex flex-col pt-[72px]"
      style={{
        background: "linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)"
      }}
    >
      <SEOHead 
        title={company?.company_name || "Chi tiết công ty"} 
        description={company ? `Khám phá môi trường làm việc và các vị trí đang tuyển tại ${company.company_name}` : "Thông tin chi tiết công ty trên SinhVienJob"} 
        image={company?.logo_url ? (company.logo_url.startsWith('http') ? company.logo_url : `http://127.0.0.1:8000${company.logo_url}`) : null}
      />
      <HomeNavbar />

      <main
        className="company-detail-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "100px",
          paddingBottom: "60px",
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{ marginBottom: "1.6rem" }}
          className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap"
        >
          <Link
            to="/"
            className="hover:text-white transition-colors no-underline text-white/50"
          >
            Trang chủ
          </Link>
          <span>›</span>
          <Link
            to="/companies"
            className="hover:text-white transition-colors no-underline text-white/50"
          >
            Công ty
          </Link>
          <span>›</span>
          <span className="text-white/80 truncate max-w-[200px]">
            {company.company_name}
          </span>
        </nav>

        {/* Hero Section Banner */}
        <section className="company-hero-card p-6 md:p-8 mb-8 relative">
          <div className="company-hero-ambient" />

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
            {/* Left side info */}
            <div
              style={{ paddingLeft: "2rem" }}
              className="flex-1 w-full text-left"
            >
              <div
                style={{ paddingBottom: "1rem" }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Logo wrapper */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white p-3 flex items-center justify-center shrink-0 shadow-xl border border-white/10 overflow-hidden">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={company.company_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-navy text-2xl font-bold">
                      {company.company_name?.substring(0, 2).toUpperCase() ||
                        "CT"}
                    </span>
                  )}
                </div>

                {/* Company basic headers */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h1 className="text-2xl md:text-3.5xl text-white font-extrabold m-0 leading-tight">
                      {company.company_name}
                    </h1>
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <p
                    style={{ margin: "0.6rem 0" }}
                    className="text-white/75 text-sm md:text-base font-medium mb-4"
                  >
                    {companyDesc}
                  </p>

                  {/* Pills row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="company-pill">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      {companyAddress}
                    </span>
                    <span className="company-pill">
                      <Users className="w-4 h-4 text-violet-400" />
                      {employees}
                    </span>
                    <span className="company-pill">
                      <Briefcase className="w-4 h-4 text-violet-400" />
                      {companyIndustry}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="flex flex-wrap items-center gap-4 mt-6 border-t border-white/5 pt-6">
                <a
                  style={{ padding: "1rem" }}
                  href="#tuyen-dung"
                  className="company-btn-primary px-6 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer no-underline text-center"
                >
                  Các vị trí tuyển dụng ({jobsCount})
                </a>
              </div>
            </div>

            {/* Right side illustration (composite HTML) */}
            <div className="w-full lg:w-[500px] xl:w-[550px] shrink-0 flex items-center justify-center lg:justify-end lg:-mr-8 lg:-mb-8 mt-6 lg:mt-0 relative z-10">
              <div className="relative w-[320px] h-[260px] md:w-[400px] md:h-[320px] xl:w-[480px] xl:h-[380px] select-none pointer-events-none">
                {/* Main central card - representing the Bank */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-60 md:h-60 rounded-3xl float-element"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(130,63,235,0.15))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      boxShadow: "0 10px 25px rgba(59,130,246,0.5)",
                    }}
                  >
                    <Landmark className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="text-white font-bold text-base md:text-lg tracking-wider">
                    TÀI CHÍNH
                  </div>
                  <div className="text-white/60 text-xs mt-1 uppercase text-center px-4 leading-tight">
                    {companyIndustry !== "Chưa cập nhật"
                      ? companyIndustry
                      : "NGÂN HÀNG SỐ"}
                  </div>
                </div>

                {/* Floating Credit Card (Left) */}
                <div
                  className="absolute top-12 md:top-20 left-4 md:left-8 w-16 h-12 md:w-20 md:h-16 rounded-xl float-element flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    animationDelay: "1s",
                    transform: "rotate(-15deg)",
                    boxShadow: "0 15px 30px rgba(99,102,241,0.4)",
                  }}
                >
                  <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-white/90" />
                </div>

                {/* Floating Shield (Right) */}
                <div
                  className="absolute bottom-12 md:bottom-16 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl float-element flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    animationDelay: "2s",
                    transform: "rotate(10deg)",
                    boxShadow: "0 15px 30px rgba(16,185,129,0.4)",
                  }}
                >
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white/90" />
                </div>

                {/* Floating Star/Badge (Top Right) */}
                <div
                  className="absolute top-8 md:top-10 right-12 md:right-16 w-10 h-10 md:w-12 md:h-12 rounded-full float-element flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    animationDelay: "0.5s",
                    boxShadow: "0 10px 20px rgba(245,158,11,0.4)",
                  }}
                >
                  <Star
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                    fill="currentColor"
                  />
                </div>

                {/* Glowing orbs and dots */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400/50 animate-pulse" />
                <div
                  className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-400/50 animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div className="absolute top-1/2 left-10 w-24 h-24 md:w-32 md:h-32 bg-blue-500/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-1/4 right-10 w-24 h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section
          style={{ marginTop: "1rem" }}
          className="company-stats-grid mb-10"
        >
          <div className="company-stat-card">
            <Users className="w-6 h-6 text-violet-400 mb-2" />
            <span className="text-xl md:text-2xl text-white font-extrabold">
              {employees ? employees.split(" ")[0] : "1000+"}
            </span>
            <span className="text-xs text-white/55 font-medium mt-1">
              Nhân viên
            </span>
          </div>

          <div className="company-stat-card">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-xl md:text-2xl text-white font-extrabold">
                {reviewsData.average_rating > 0
                  ? reviewsData.average_rating
                  : rating}
              </span>
            </div>
            <span className="text-xs text-white/55 font-medium mt-2">
              Đánh giá ({reviewsData.total_reviews})
            </span>
          </div>

          <div className="company-stat-card">
            <Briefcase className="w-6 h-6 text-violet-400 mb-2" />
            <span className="text-xl md:text-2xl text-white font-extrabold">
              {jobsCount}
            </span>
            <span className="text-xs text-white/55 font-medium mt-1">
              Vị trí đang tuyển
            </span>
          </div>

          <div className="company-stat-card">
            <Calendar className="w-6 h-6 text-violet-400 mb-2" />
            <span className="text-xl md:text-2xl text-white font-extrabold">
              {founded}
            </span>
            <span className="text-xs text-white/55 font-medium mt-1">
              Thành lập
            </span>
          </div>

          <div className="company-stat-card">
            <Trophy className="w-6 h-6 text-violet-400 mb-2" />
            <span className="text-xl md:text-2xl text-white font-extrabold">
              {topWorkplace}
            </span>
            <span className="text-xs text-white/55 font-medium mt-1">
              Nơi làm việc tốt nhất
            </span>
          </div>
        </section>

        {/* Content Layout Grid */}
        <div style={{ marginTop: "1rem" }} className="company-detail-grid">
          {/* Left Side Section: Overview, Benefits, Images, Reviews */}
          <div className="company-detail-left flex flex-col gap-8">
            {/* Overview & Tags */}
            <section
              className="rounded-2xl p-6 md:p-8"
              style={{
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2
                style={{ marginBottom: "1rem" }}
                className="text-lg md:text-xl text-white font-bold mb-4 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-violet-400" />
                Giới thiệu về công ty
              </h2>

              <div className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                {companyAbout}
              </div>

              {/* Tags block */}
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3.5 py-1.5 rounded-lg text-white/80 font-medium"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Benefits section */}
            {benefits.length > 0 && (
              <section
                className="rounded-2xl p-6 md:p-8"
                style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <h2
                  style={{ marginBottom: "0.8rem" }}
                  className="text-lg md:text-xl text-white font-bold mb-5 flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-violet-400" />
                  Phúc lợi dành cho bạn
                </h2>

                <div className="benefits-grid">
                  {benefits.map((b, idx) => {
                    const IconComp = b.icon;
                    return (
                      <div key={idx} className="benefit-card">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm mb-1">
                            {b.title}
                          </h4>
                          <p className="text-white/60 text-xs leading-relaxed">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Office Images Gallery */}
            {galleryImages.length > 0 && (
              <section
                className="rounded-2xl p-6 md:p-8"
                style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{ marginBottom: "0.6rem" }}
                  className="flex items-center justify-between mb-5"
                >
                  <h2 className="text-lg md:text-xl text-white font-bold flex items-center gap-2 m-0">
                    <Globe className="w-5 h-5 text-violet-400" />
                    Hình ảnh công ty
                  </h2>

                  {/* Scroll buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollContainer(galleryRef, "left")}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => scrollContainer(galleryRef, "right")}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10"
                    >
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Gallery wrapper scroll */}
                <div
                  ref={galleryRef}
                  className="gallery-scroll-container hide-scrollbar"
                >
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="gallery-image-wrapper">
                      <img src={imgUrl} alt={`Office ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section
              className="rounded-2xl p-6 md:p-8"
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl text-white font-bold flex items-center gap-2 m-0">
                  <Star className="w-5 h-5 text-violet-400" />
                  Đánh giá công ty
                </h2>
                {user && user.role === "student" && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #823feb, #6366f1)",
                    }}
                  >
                    {showReviewForm ? "Hủy" : "Viết đánh giá"}
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form
                  onSubmit={submitReview}
                  className="mb-8 p-5 rounded-xl border border-white/10 bg-white/5"
                >
                  <h3 className="text-white font-medium mb-3 text-sm">
                    Bạn đánh giá thế nào về {company.company_name}?
                  </h3>
                  {reviewError && (
                    <div className="text-red-400 text-sm mb-3">
                      {reviewError}
                    </div>
                  )}
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: s })
                        }
                        className="bg-transparent border-none p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${s <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, review: e.target.value })
                    }
                    placeholder="Chia sẻ trải nghiệm làm việc hoặc phỏng vấn của bạn..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm outline-none mb-4 min-h-[100px] resize-none focus:border-brand/50 transition-colors box-border"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #823feb, #6366f1)",
                    }}
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Left side average block */}
                <div className="w-full lg:w-[240px] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                  <div className="text-center lg:text-left">
                    <div className="text-5xl md:text-6xl text-white font-black leading-none mb-2">
                      {reviewsData.average_rating > 0
                        ? reviewsData.average_rating
                        : ratingAverage}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= Math.round(reviewsData.average_rating || ratingAverage) ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/50 font-medium">
                      ({reviewsData.total_reviews} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Right side reviews list */}
                <div className="flex-1 flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviewsData.reviews.length > 0 ? (
                    reviewsData.reviews.map((r, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between p-5 rounded-2xl bg-white/3 border border-white/5 relative mb-2"
                      >
                        <Quote className="w-6 h-6 text-violet-500/10 absolute top-4 right-4" />
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                            />
                          ))}
                        </div>
                        <p className="text-white/80 text-sm italic leading-relaxed mb-4 font-medium relative z-10">
                          "{r.review || "Đánh giá tốt."}"
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                          <img
                            src={
                              r.student?.user?.avatar ||
                              "https://ui-avatars.com/api/?name=" +
                                (r.student?.full_name || "SV") +
                                "&background=823feb&color=fff"
                            }
                            alt={r.student?.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <h4 className="text-white font-bold text-xs m-0">
                              {r.student?.full_name || "Sinh viên"}
                            </h4>
                            <p className="text-white/40 text-[10px] m-0">
                              {new Date(r.created_at).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-5 rounded-2xl bg-white/3 border border-white/5 text-white/40 text-sm italic">
                      Chưa có đánh giá nào cho công ty này.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Side Sidebar Section: Open Positions list */}
          <div id="tuyen-dung" className="company-detail-right">
            <section
              className="rounded-2xl p-5 md:p-6 sticky top-24"
              style={{
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2
                style={{ marginBottom: "0.8rem" }}
                className="text-base md:text-lg text-white font-bold mb-5 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                  Vị trí đang tuyển dụng
                </span>
                <span
                  style={{
                    fontSize: "1.1rem",
                    marginRight: "5.4rem",
                    padding: "0 0.6rem",
                  }}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-brand/20 text-brand-light font-bold border border-brand/30"
                >
                  {jobsCount}
                </span>
              </h2>

              {displayJobs.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-white/5 bg-white/2">
                  <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm m-0">
                    Hiện công ty chưa có tin tuyển dụng nào được duyệt.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {displayJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-xl p-4 transition-all duration-300 border flex flex-col relative"
                      style={{
                        padding: "1rem",
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(130,63,235,0.3)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.06)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                      }}
                    >
                      {/* Job Header: Title + Bookmark */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                          to={`/job/${job.id}`}
                          className="text-white font-bold text-sm hover:text-brand-light transition-colors no-underline block truncate max-w-[85%]"
                        >
                          {job.title}
                        </Link>

                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className="p-1.5 rounded-lg bg-white/5 border-none text-white/40 hover:text-brand-light cursor-pointer transition-colors shrink-0"
                        >
                          <Bookmark
                            style={{ width: "1.2rem", height: "1.2rem" }}
                            className={`w-3.5 h-3.5 ${savedJobs[job.id] ? "fill-brand-light text-brand-light" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Job Type badge */}
                      <div style={{ marginBottom: "0.6rem" }} className="mb-3">
                        <span
                          style={{ fontSize: "0.6rem" }}
                          className="text-3xs px-2.5 py-0.5 rounded bg-brand-light/10 text-brand-light border border-brand-light/20 font-bold tracking-wide uppercase"
                        >
                          {translateType(job.type)}
                        </span>
                      </div>

                      {/* Job metadata */}
                      <div className="flex items-center gap-2.5 text-xs text-white/50 mb-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          <span className="truncate max-w-[120px]">
                            {job.location || "Đang cập nhật"}
                          </span>
                        </span>

                        <span className="w-px h-3 bg-white/10 shrink-0"></span>

                        <span className="flex items-center gap-1.5 font-bold text-amber-400">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {formatSalary(job.salary_min, job.salary_max)}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* See all button */}
                  <Link
                    to={`/jobs?keyword=${encodeURIComponent(company.company_name)}`}
                    style={{ padding: "0.6rem" }}
                    className="w-full mt-2 py-3 rounded-xl border border-white/10 hover:border-brand-light bg-white/3 hover:bg-white/5 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    Xem tất cả vị trí
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Similar Companies Section */}
        <section
          className="rounded-2xl p-6 md:p-8 mt-12"
          style={{
            padding: "1rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{ marginBottom: "1rem" }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-lg md:text-xl text-white font-bold flex items-center gap-2 m-0">
              <Users className="w-5 h-5 text-violet-400" />
              Các công ty tương tự
            </h2>

            {/* Scroll navigation arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollContainer(similarRef, "left")}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => scrollContainer(similarRef, "right")}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Cards slider wrapper */}
          <div
            ref={similarRef}
            className="gallery-scroll-container hide-scrollbar"
            style={{ gap: "16px" }}
          >
            {similarCompanies.map((c) => (
              <div
                key={c.id}
                className="similar-company-card flex flex-col justify-between"
              >
                {/* Logo and Name card */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg border border-white/5 overflow-hidden">
                    {c.logo_url || c.logo ? (
                      <img
                        src={c.logo_url || c.logo}
                        alt={c.company_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-navy text-sm font-bold">
                        {c.company_name?.substring(0, 2).toUpperCase() || "CT"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-xs truncate m-0">
                      {c.company_name}
                    </h4>
                    <span className="text-3xs text-white/50 font-medium truncate block mt-0.5">
                      {c.employee_count || "1000+ nhân viên"}
                    </span>
                  </div>
                </div>

                {/* Open jobs count badge */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-3xs text-violet-400 font-bold bg-violet-400/10 px-2 py-1 rounded">
                    {c.jobs_count || 0} vị trí tuyển dụng
                  </span>

                  <Link
                    to={`/companies/${c.id}`}
                    className="text-3xs text-white/70 hover:text-brand-light font-bold no-underline flex items-center gap-0.5"
                  >
                    Xem
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
}

// We no longer need mock data

export default CompanyDetail;
