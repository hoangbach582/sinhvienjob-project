import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import FooterNew from '../components/FooterNew';
import { MapPin, Briefcase, Globe, ExternalLink, Calendar, Info, Search, ShieldCheck } from 'lucide-react';

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Formatter for Salary
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return 'Thỏa thuận';
  };

  // Translator for Job Type
  const translateType = (type) => {
    const types = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'internship': 'Thực tập sinh'
    };
    return types[type] || type;
  };

  useEffect(() => {
    let active = true;
    const loadMockFallback = () => {
      const mockCompany = mockCompaniesDetail.find((c) => c.id === parseInt(id)) || mockCompaniesDetail[0];
      if (active) {
        setCompany(mockCompany);
        setLoading(false);
      }
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/employers/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          if (active) {
            setCompany(data);
            setLoading(false);
          }
        } else {
          loadMockFallback();
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết công ty, đang chuyển sang dữ liệu mẫu...", err);
        loadMockFallback();
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [id]);

  // Loading state styling matching homepage
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-white/20 border-t-brand-light rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm font-medium">Đang tải thông tin công ty...</p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <Info className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-6">Không tìm thấy thông tin công ty này!</p>
            <Link
              to="/companies"
              className="inline-block px-6 py-2.5 rounded-xl text-white font-medium text-sm border-none cursor-pointer transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #823feb, #6366f1)', textDecoration: 'none' }}
            >
              ← Quay lại danh sách công ty
            </Link>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  const colors = ["#1E3A8A", "#4C1D95", "#064E3B", "#7C2D12", "#0F172A", "#B45309", "#4338CA"];
  const avatarBg = colors[company.id % colors.length] || "#1E3A8A";
  const jobs = company.jobs || [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
      <HomeNavbar />

      <main className="company-detail-container" style={{maxWidth: "1152px", margin: "0 auto", width: "100%", paddingLeft: "1rem", paddingRight: "1rem"}}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors no-underline text-white/50">Trang chủ</Link>
          <span>›</span>
          <Link to="/companies" className="hover:text-white transition-colors no-underline text-white/50">Công ty</Link>
          <span>›</span>
          <span className="text-white/80 truncate max-w-[200px]">{company.company_name}</span>
        </nav>

        {/* Hero Section Banner & Header */}
        <section
          className="rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Subtle Ambient Light Effect */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(130,63,235,0.15) 0%, rgba(130,63,235,0) 70%)",
            }}
          />

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
            {/* Avatar / Logo */}
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-bold shrink-0 overflow-hidden shadow-lg border border-white/10"
              style={{ backgroundColor: avatarBg, color: "white" }}
            >
              {company.logo_url || company.logo ? (
                <img
                  src={company.logo_url || company.logo}
                  alt={company.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                company.company_name?.substring(0, 2).toUpperCase() || "CT"
              )}
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-4xl text-white font-extrabold m-0 leading-tight">
                  {company.company_name}
                </h1>
                <ShieldCheck className="w-6 h-6 text-brand-light shrink-0" />
              </div>

              <p className="text-white/80 text-base md:text-lg font-medium mb-4 max-w-3xl leading-relaxed">
                {company.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50 font-medium">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  {company.industry || "Ngành nghề chưa cập nhật"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  {company.address || "Hà Nội, Việt Nam"}
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-brand-light hover:text-brand-light/80 transition-colors no-underline"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website công ty</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="company-detail-grid">
          {/* Left Side: Detail Overview */}
          <div className="company-detail-left flex flex-col gap-6">
            <section
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg md:text-xl text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-brand-light inline-block"></span>
                Giới thiệu về công ty
              </h2>
              <div className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {company.about || `Chào mừng bạn đến với ${company.company_name}. Chúng tôi hoạt động trong lĩnh vực ${company.industry || "nhiều ngành nghề"} với định hướng phát triển bền vững và đặt lợi ích của khách hàng cũng như nhân viên lên hàng đầu.

Với môi trường làm việc năng động, sáng tạo và nhiều cơ hội thăng tiến, chúng tôi luôn chào đón các ứng viên tài năng, năng nổ và có tinh thần trách nhiệm gia nhập đội ngũ.`}
              </div>
            </section>
          </div>

          {/* Right Side: Jobs recruitment list */}
          <div className="company-detail-right">
            <section
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg text-white font-bold mb-5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-brand-light inline-block"></span>
                  Vị trí đang tuyển dụng
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand/20 text-brand-light font-semibold border border-brand/30">
                  {jobs.length} việc làm
                </span>
              </h2>

              {jobs.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-white/5 bg-white/2">
                  <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm m-0">
                    Hiện công ty chưa có tin tuyển dụng nào được duyệt.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(130,63,235,0.3)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <Link
                        to={`/job/${job.id}`}
                        className="text-white font-bold text-base hover:text-brand-light transition-colors no-underline block truncate mb-1"
                      >
                        {job.title}
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand/10 text-brand-light border border-brand/20 font-semibold">
                          {translateType(job.type)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-violet-400" />
                          {job.location || "Đang cập nhật"}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-amber-400">
                          <Briefcase className="w-3.5 h-3.5" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                        {job.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-violet-400" />
                            Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/job/${job.id}`}
                        className="w-full py-2 rounded-lg text-white font-semibold text-xs border-none cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-1.5 no-underline"
                        style={{
                          background: "linear-gradient(135deg, #823feb, #6366f1)",
                        }}
                      >
                        Xem chi tiết & ứng tuyển
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <FooterNew />
    </div>
  );
}

// Full mock data for visual fallback mode
const mockCompaniesDetail = [
  {
    id: 1,
    company_name: "Techcombank",
    address: "Hà Nội",
    description: "Ngân hàng TMCP Kỹ Thương Việt Nam",
    industry: "Tài chính",
    website: "https://techcombank.com.vn",
    jobs_count: 3,
    logo_url: "",
    about: "Techcombank là một trong những ngân hàng thương mại cổ phần lớn nhất Việt Nam và một trong những ngân hàng hàng đầu ở châu Á.\n\nChúng tôi cam kết cung cấp giải pháp tài chính tốt nhất và trải nghiệm khách hàng vượt trội. Tại Techcombank, con người là tài sản quý giá nhất, nơi bạn có thể phát triển sự nghiệp toàn diện.",
    jobs: [
      {
        id: "mock-job-1-1",
        title: "Thực tập sinh Giao dịch viên",
        type: "internship",
        location: "Quận Hoàn Kiếm, Hà Nội",
        salary_min: 0,
        salary_max: 0,
        deadline: "2026-06-30"
      },
      {
        id: "mock-job-1-2",
        title: "Chuyên viên Khách hàng cá nhân",
        type: "full_time",
        location: "Quận Hai Bà Trưng, Hà Nội",
        salary_min: 10000000,
        salary_max: 15000000,
        deadline: "2026-07-15"
      },
      {
        id: "mock-job-1-3",
        title: "Giao dịch viên bán thời gian",
        type: "part_time",
        location: "Quận Cầu Giấy, Hà Nội",
        salary_min: 3000000,
        salary_max: 5000000,
        deadline: "2026-06-20"
      }
    ]
  },
  {
    id: 2,
    company_name: "YouTube",
    address: "Hà Nội",
    description: "Nền tảng chia sẻ video lớn nhất thế giới",
    industry: "Giải trí",
    website: "https://youtube.com",
    jobs_count: 1,
    logo_url: "",
    about: "YouTube là nền tảng chia sẻ và lưu trữ video lớn nhất thế giới do Google sở hữu.\n\nSứ mệnh của chúng tôi là tạo cơ hội cho mọi người được lên tiếng và khám phá thế giới. Chúng tôi mang đến không gian sáng tạo tự do cùng văn hóa chia sẻ đa dạng.",
    jobs: [
      {
        id: "mock-job-2-1",
        title: "Content Moderator (Vietnamese)",
        type: "part_time",
        location: "Hà Nội / Remote",
        salary_min: 6000000,
        salary_max: 9000000,
        deadline: "2026-07-10"
      }
    ]
  },
  {
    id: 3,
    company_name: "Swagbucks",
    address: "Remote",
    description: "Nền tảng khảo sát trực tuyến và hoàn tiền uy tín",
    industry: "Marketing",
    website: "https://swagbucks.com",
    jobs_count: 0,
    logo_url: "",
    about: "Swagbucks là một trong những nền tảng phần thưởng và khảo sát trực tuyến phổ biến nhất thế giới.\n\nChúng tôi giúp người dùng kiếm thẻ quà tặng và tiền mặt cho những việc họ làm hàng ngày trên mạng như mua sắm, tìm kiếm, xem video và tham gia khảo sát.",
    jobs: []
  },
  {
    id: 4,
    company_name: "VNG Corporation",
    address: "Quận 7, TP. Hồ Chí Minh",
    description: "Công ty công nghệ và nội dung số hàng đầu Việt Nam",
    industry: "Công nghệ thông tin",
    website: "https://vng.com.vn",
    jobs_count: 2,
    logo_url: "",
    about: "Thành lập năm 2004, VNG hiện là công ty công nghệ kỳ lân hàng đầu tại Việt Nam và Đông Nam Á.\n\nChúng tôi kiến tạo hệ sinh thái các dịch vụ trực tuyến phục vụ đời sống người dùng bao gồm game, truyền thông, tài chính & thanh toán, giải pháp đám mây.",
    jobs: [
      {
        id: "mock-job-4-1",
        title: "Frontend Developer (ReactJS)",
        type: "full_time",
        location: "VNG Campus, Quận 7, TP. HCM",
        salary_min: 15000000,
        salary_max: 25000000,
        deadline: "2026-07-15"
      },
      {
        id: "mock-job-4-2",
        title: "Backend Developer intern (Go/Java)",
        type: "internship",
        location: "VNG Campus, Quận 7, TP. HCM",
        salary_min: 5000000,
        salary_max: 7000000,
        deadline: "2026-06-30"
      }
    ]
  },
  {
    id: 5,
    company_name: "Tập đoàn Công nghệ FPT",
    address: "Khu CNC Hòa Lạc, Hà Nội",
    description: "Tập đoàn công nghệ và viễn thông hàng đầu khu vực",
    industry: "Công nghệ thông tin",
    website: "https://fpt.com.vn",
    jobs_count: 1,
    logo_url: "",
    about: "FPT là tập đoàn công nghệ hàng đầu Việt Nam cung cấp dịch vụ công nghệ thông tin, viễn thông và giáo dục.\n\nVới mạng lưới phủ rộng toàn cầu, FPT tiên phong dẫn dắt quá trình chuyển đổi số và phát triển nguồn nhân lực chất lượng cao.",
    jobs: [
      {
        id: "mock-job-5-1",
        title: "Trực tổng đài chăm sóc khách hàng",
        type: "part_time",
        location: "Tòa nhà FPT Cầu Giấy, Hà Nội",
        salary_min: 4000000,
        salary_max: 6000000,
        deadline: "2026-07-05"
      }
    ]
  },
  {
    id: 6,
    company_name: "Shopee Việt Nam",
    address: "Tòa nhà Capital Place, Hà Nội",
    description: "Nền tảng thương mại điện tử phổ biến nhất Đông Nam Á",
    industry: "Thương mại điện tử",
    website: "https://shopee.vn",
    jobs_count: 1,
    logo_url: "",
    about: "Shopee là nền tảng thương mại điện tử hàng đầu tại Đông Nam Á và Đài Loan.\n\nShopee kết nối người tiêu dùng, người bán và doanh nghiệp, tạo điều kiện thuận lợi cho việc mua bán diễn ra an toàn, tin cậy và tiện lợi.",
    jobs: [
      {
        id: "mock-job-6-1",
        title: "Nhân viên Điều phối kho bãi",
        type: "full_time",
        location: "Tổng kho Shopee, Gia Lâm, Hà Nội",
        salary_min: 8000000,
        salary_max: 12000000,
        deadline: "2026-06-25"
      }
    ]
  }
];

export default CompanyDetail;
