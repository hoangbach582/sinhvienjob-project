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

gsap.registerPlugin(ScrollTrigger);

const mockJobs = [
  { id: 1, title: 'Lập trình viên Frontend (ReactJS/VueJS)', type: 'part_time', location: 'Hà Nội', salary_min: 5000000, salary_max: 8000000, employer: { company_name: 'FPT Software' } },
  { id: 2, title: 'Thực tập sinh Truyền thông & Digital Marketing', type: 'internship', location: 'TP.HCM', salary_min: 3000000, salary_max: 5000000, employer: { company_name: 'Tập đoàn MoMo' } },
  { id: 3, title: 'Thiết kế đồ họa (UI/UX Designer Intern)', type: 'internship', location: 'Remote', salary_min: 2000000, salary_max: 4000000, employer: { company_name: 'VNG Corporation' } },
  { id: 4, title: 'Nhân viên Hỗ trợ Khách hàng Bán thời gian', type: 'part_time', location: 'TP.HCM', salary_min: 4000000, salary_max: 6000000, employer: { company_name: 'The Coffee House' } },
  { id: 5, title: 'Thực tập sinh Quản trị Nhân sự (HR Intern)', type: 'internship', location: 'Hà Nội', salary_min: null, salary_max: null, employer: { company_name: 'Techcombank' } },
  { id: 6, title: 'Lập trình viên Backend NodeJS (Junior/Fresh)', type: 'full_time', location: 'Hà Nội', salary_min: 10000000, salary_max: 15000000, employer: { company_name: 'Rikkeisoft' } },
];

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '/jobs/latest');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          setJobs(mockJobs);
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

  // GSAP ScrollTrigger for smooth section parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  const filteredJobs = activeTab === 'all' ? jobs : jobs.filter(job => job.type === activeTab);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

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

  const translateType = (type) => {
    const types = { 'full_time': 'Toàn thời gian', 'part_time': 'Bán thời gian', 'internship': 'Thực tập sinh' };
    return types[type] || type;
  };

  return (
    <MainLayout hideTopbar showFooter={false}>
      <main ref={mainRef} className="home-page relative min-h-screen bg-background">
        <SEOHead 
          title="Trang chủ" 
          description="Tìm kiếm việc làm part-time, internship cho sinh viên dễ dàng, nhanh chóng trên SinhVienJob." 
        />
        <HomeNavbar />

        <HeroSectionNew
          keyword={keyword}
          setKeyword={setKeyword}
          location={location}
          setLocation={setLocation}
          handleSearch={handleSearch}
        />

        <StatsSectionNew />

        <div className="relative z-10 -mt-4 rounded-t-[2.5rem] bg-background pt-10">
          <LatestJobsSectionNew
            loading={loading}
            filteredJobs={filteredJobs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
            formatSalary={formatSalary}
            translateType={translateType}
          />

          <BenefitsSectionNew />
          <CompaniesSectionNew />
        </div>

        <FooterNew />
      </main>
    </MainLayout>
  );
}

export default Home;
