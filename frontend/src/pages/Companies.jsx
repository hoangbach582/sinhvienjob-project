import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy danh sách công ty từ API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/employers', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Giả sử API trả về mảng trực tiếp hoặc data.data
          setCompanies(Array.isArray(data) ? data : (data.data || []));
        } else {
          // Fallback Mock Data để bạn test giao diện nếu Backend chưa viết xong API
          setCompanies(mockCompanies);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
        setCompanies(mockCompanies); // Dùng data giả nếu chưa bật server
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);


  // Lọc công ty theo ô tìm kiếm
  const filteredCompanies = companies.filter(company => 
    (company.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>

      {/* HEADER BANNER CỦA TRANG CÔNG TY */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', color: '#0F172A', fontWeight: 'bold', marginBottom: '16px' }}>
            Khám phá các Công ty nổi bật
          </h1>
          <p style={{ fontSize: '16px', color: '#475569', marginBottom: '32px', lineHeight: '1.6' }}>
            Tìm hiểu văn hóa công ty, môi trường làm việc và các cơ hội nghề nghiệp hấp dẫn dành riêng cho sinh viên thực tập và mới ra trường.
          </p>
          
          {/* Ô TÌM KIẾM */}
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94A3B8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Nhập tên công ty bạn muốn tìm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 20px 16px 48px', borderRadius: '50px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '15px', boxSizing: 'border-box', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÔNG TY (GRID) */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748B' }}>Đang tải danh sách công ty...</div>
        ) : filteredCompanies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748B' }}>Không tìm thấy công ty nào phù hợp.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredCompanies.map((company, index) => (
              <div 
                key={company.id || index} 
                style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', transition: 'all 0.3s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'; }}
              >
                {/* Logo và Tên */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {company.logo ? (
                      <img src={company.logo} alt={company.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                    ) : (
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#94A3B8' }}>
                        {(company.company_name || 'C T').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0F172A', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {company.company_name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📍 {company.address || 'Đang cập nhật'}
                    </p>
                  </div>
                </div>

                {/* Mô tả ngắn */}
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#475569', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {company.description || 'Chưa có thông tin giới thiệu về công ty này. Cập nhật trong thời gian tới.'}
                </p>

                {/* Nút Xem chi tiết */}
                <Link 
                  to={`/companies/${company.id}`} 
                  style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#DBEAFE'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#EFF6FF'}
                >
                  Xem chi tiết & Tuyển dụng
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Dữ liệu giả lập để thiết kế giao diện trong lúc chờ Backend
const mockCompanies = [
  { id: 1, company_name: "Tập đoàn Công nghệ FPT", address: "Khu CNC Hòa Lạc, Hà Nội", description: "Tập đoàn công nghệ hàng đầu Việt Nam, môi trường làm việc chuyên nghiệp, cơ hội thăng tiến cao cho sinh viên IT mới ra trường." },
  { id: 2, company_name: "Công ty Cổ phần VNG", address: "Quận 7, TP. Hồ Chí Minh", description: "Kỳ lân công nghệ của Việt Nam, chuyên phát triển game, ứng dụng Zalo và các dịch vụ đám mây." },
  { id: 3, company_name: "Shopee Việt Nam", address: "Tòa nhà Capital Place, Hà Nội", description: "Nền tảng thương mại điện tử hàng đầu Đông Nam Á. Môi trường trẻ trung, năng động và lộ trình đào tạo bài bản." },
  { id: 4, company_name: "Techcombank", address: "Quận Hoàn Kiếm, Hà Nội", description: "Ngân hàng TMCP Kỹ Thương Việt Nam, liên tục tuyển dụng thực tập sinh cho các dự án chuyển đổi số." },
  { id: 5, company_name: "Viettel Group", address: "Quận Cầu Giấy, Hà Nội", description: "Tập đoàn Công nghiệp - Viễn thông Quân đội. Đơn vị đi đầu trong nghiên cứu 5G và các giải pháp an toàn thông tin." },
  { id: 6, company_name: "Rikkeisoft", address: "Tòa nhà Sudico, Nam Từ Liêm", description: "Công ty gia công phần mềm hàng đầu, có thị trường rộng lớn tại Nhật Bản, rất hoan nghênh các lập trình viên Fresher." },
];

export default Companies;