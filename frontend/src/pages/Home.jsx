import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import HeroSectionNew from '../components/home/HeroSectionNew';
import StatsSectionNew from '../components/home/StatsSectionNew';
import LatestJobsSectionNew from '../components/home/LatestJobsSectionNew';
import BenefitsSectionNew from '../components/home/BenefitsSectionNew';
import CompaniesSectionNew from '../components/home/CompaniesSectionNew';
import FooterNew from '../components/FooterNew';
import SEOHead from '../components/SEOHead';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Đăng ký Plugin ScrollTrigger để GSAP có thể bắt sự kiện cuộn chuột
gsap.registerPlugin(ScrollTrigger);

// Dữ liệu giả (Mock data) dùng để dự phòng khi Backend chưa có dữ liệu hoặc bị lỗi
const mockJobs = [
  { id: 1, title: 'Lập trình viên Frontend (ReactJS/VueJS)', type: 'part_time', location: 'Hà Nội', salary_min: 5000000, salary_max: 8000000, employer: { company_name: 'FPT Software' } },
  { id: 2, title: 'Thực tập sinh Truyền thông & Digital Marketing', type: 'internship', location: 'TP.HCM', salary_min: 3000000, salary_max: 5000000, employer: { company_name: 'Tập đoàn MoMo' } },
  { id: 3, title: 'Thiết kế đồ họa (UI/UX Designer Intern)', type: 'internship', location: 'Remote', salary_min: 2000000, salary_max: 4000000, employer: { company_name: 'VNG Corporation' } },
  { id: 4, title: 'Nhân viên Hỗ trợ Khách hàng Bán thời gian', type: 'part_time', location: 'TP.HCM', salary_min: 4000000, salary_max: 6000000, employer: { company_name: 'The Coffee House' } },
  { id: 5, title: 'Thực tập sinh Quản trị Nhân sự (HR Intern)', type: 'internship', location: 'Hà Nội', salary_min: null, salary_max: null, employer: { company_name: 'Techcombank' } },
  { id: 6, title: 'Lập trình viên Backend NodeJS (Junior/Fresh)', type: 'full_time', location: 'Hà Nội', salary_min: 10000000, salary_max: 15000000, employer: { company_name: 'Rikkeisoft' } },
];

function Home() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [jobs, setJobs] = useState([]); // Danh sách việc làm hiển thị trên trang chủ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [keyword, setKeyword] = useState(''); // Từ khóa tìm kiếm ở thanh Search (Hero section)
  const [location, setLocation] = useState(''); // Địa điểm tìm kiếm
  const [activeTab, setActiveTab] = useState('all'); // Tab đang chọn (Tất cả, Part-time, Full-time...)
  
  const navigate = useNavigate();
  const mainRef = useRef(null); // Ref dùng để bind GSAP animations vào thẻ bao ngoài

  /**
   * USE-EFFECT: FETCH DANH SÁCH VIỆC LÀM MỚI NHẤT
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '/jobs/latest');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          setJobs(mockJobs); // Nếu API lỗi thì lấy dữ liệu mẫu hiển thị tạm
        }
      } catch (error) {
        console.error("Lỗi khi tải việc làm:", error);
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /**
   * USE-EFFECT: LÀM MỚI (REFRESH) GSAP SCROLL-TRIGGER KHI LOAD XONG DATA
   * Mục đích: Khi dữ liệu job đổ ra, chiều cao trang sẽ dài thêm. 
   * Nếu không gọi refresh(), các hiệu ứng animation sẽ bị tính sai tọa độ cuộn chuột.
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert(); // Dọn dẹp GSAP khi Component bị hủy (Unmount)
  }, [loading]);

  // Bộ lọc nhanh trên màn hình chính (Dựa vào Tab đang chọn)
  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter(job => job.type === activeTab);

  /**
   * HÀM XỬ LÝ CHUYỂN TRANG TÌM KIẾM
   * Khi ấn "Tìm việc", đóng gói các query (keyword, location) và đẩy sang trang `/jobs`
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  /**
   * HÀM RÚT GỌN HIỂN THỊ LƯƠNG
   * Ví dụ: 5000000 -> 5tr, 15000000 -> 15tr
   */
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (v) => {
      const mil = v / 1000000;
      const rounded = Math.round(mil * 10) / 10;
      return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}tr`;
    if (min) return `Từ ${fmt(min)}tr`;
    if (max) return `Lên tới ${fmt(max)}tr`;
    return 'Thỏa thuận';
  };

  /**
   * HÀM DỊCH LOẠI HÌNH CÔNG VIỆC TỪ TIẾNG ANH SANG TIẾNG VIỆT
   */
  const translateType = (type) => {
    const types = { 'full_time': 'Toàn thời gian', 'part_time': 'Bán thời gian', 'internship': 'Thực tập sinh', 'remote': 'Làm việc từ xa', 'collaborator': 'Cộng tác viên' };
    return types[type] || type;
  };

  return (
    <MainLayout hideTopbar showFooter={false}>
      {/* Thẻ main chứa toàn bộ nội dung và là mỏ neo cho GSAP */}
      <main ref={mainRef} className="home-page relative min-h-screen bg-background">
        <SEOHead 
          title="Trang chủ" 
          description="Tìm kiếm việc làm part-time, internship cho sinh viên dễ dàng, nhanh chóng trên SinhVienJob." 
        />
        <HomeNavbar />

        {/* Section 1: Hero (Banner chính có thanh Search, có nhúng ảnh 3D) */}
        <HeroSectionNew
          keyword={keyword}
          setKeyword={setKeyword}
          location={location}
          setLocation={setLocation}
          handleSearch={handleSearch}
        />

        {/* Section 2: Khối hiển thị các con số thống kê */}
        <StatsSectionNew />

        {/* Khối giao diện chứa đường cong cắt lên trên (Bo tròn 2 góc trên) */}
        <div className="relative z-10 -mt-4 rounded-t-[2.5rem] bg-background pt-10">
          
          {/* Section 3: Danh sách Job mới nhất */}
          <LatestJobsSectionNew
            loading={loading}
            filteredJobs={filteredJobs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
            formatSalary={formatSalary}
            translateType={translateType}
          />

          {/* Section 4: Các lợi ích / Tính năng */}
          <BenefitsSectionNew />
          
          {/* Section 5: Slider Logo các nhà tuyển dụng */}
          <CompaniesSectionNew />
        </div>

        <FooterNew />
      </main>
    </MainLayout>
  );
}

export default Home;
