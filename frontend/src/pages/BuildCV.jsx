import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';

function BuildCV() {
  const [showSaveModal, setShowSaveModal] = useState(false);

  // 1. ĐỊNH DANH NGƯỜI DÙNG HIỆN TẠI VÀ TẠO CHÌA KHÓA LƯU NHÁP ĐỘC LẬP
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : {};
  const currentName = localStorage.getItem('name') || userObj.name || userObj.full_name || '';
  const currentAvatar = localStorage.getItem('avatar') || userObj.avatar || '';
  const currentEmail = userObj.email || '';
  
  // Chìa khóa riêng biệt: vd "cv_draft_vuonglam123@gmail.com"
  const draftKey = `cv_draft_${currentEmail || currentName || 'guest'}`;

  const [cvData, setCvData] = useState(() => {
    const savedDraft = localStorage.getItem('draftKey');
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
    return {
      name: currentName,
      title: 'Sinh viên Ứng dụng phần mềm',
      email: currentEmail,
      phone: '',
      link: '',
      avatar: currentAvatar, 
      summary: 'Sinh viên năm cuối đam mê lập trình Full-stack, định hướng phát triển các ứng dụng web tối ưu và thân thiện với người dùng. Có khả năng tự học tốt và luôn sẵn sàng làm quen với công nghệ mới.',
      education: 'Cao đẳng Nghề Bách khoa Hà Nội (HACTECH)\nChuyên ngành: Ứng dụng phần mềm\nThời gian: 10/2023 - 07/2026',
      experience: 'Dự án SinhVienJob\nVai trò: Full-stack Developer (03/2026 - Hiện tại)\n- Xây dựng nền tảng tìm việc làm cho sinh viên.\n- Tích hợp API xác thực, thiết kế UI/UX theo hướng tối giản.',
      skills: 'ReactJS, NodeJS, MySQL, SQL Server, UI/UX Design, Git'
    };
  });

  const handleChange = (e) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData({ ...cvData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCV = () => {
    // Lưu nháp theo đúng chìa khóa riêng của user này
    localStorage.setItem(draftKey, JSON.stringify(cvData));
    setShowSaveModal(true);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="build-cv-container" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div className="no-print">
        <Topbar />
      </div>

      {/* POPUP LƯU THÀNH CÔNG */}
      {showSaveModal && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '50px', marginBottom: '12px', lineHeight: 1 }}>✅</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>Lưu nháp thành công!</h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748B', fontSize: '14px' }}>Bản nháp CV của bạn đã được lưu an toàn trên trình duyệt.</p>
            <button 
              onClick={() => setShowSaveModal(false)} 
              style={{ width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
            >
              Tiếp tục chỉnh sửa
            </button>
          </div>
        </div>
      )}

      {/* CSS cho TRÌNH DUYỆT IN ĐÚNG MÀU VÀ GIAO DIỆN INPUT */}
      <style>
        {`
          /* Input hiện đại */
          .modern-input {
            background: #fff;
            border: 1px solid #CBD5E1;
            color: #334155;
            transition: all 0.2s ease;
          }
          .modern-input:focus {
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            outline: none;
          }
          .modern-input::placeholder { color: #94A3B8; }

          /* Tùy chỉnh thanh cuộn thanh lịch */
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #F1F5F9; }
          ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

          @media print {
            body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
            .build-cv-container { background-color: white !important; display: block !important; }
            .print-wrapper { display: block !important; overflow: visible !important; height: auto !important; }
            .preview-col { width: 100% !important; height: auto !important; overflow: visible !important; padding: 0 !important; background: white !important; display: block !important; }
            .print-area { width: 100% !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
            @page { size: A4 portrait; margin: 0; }
          }
        `}
      </style>

      <div className="print-wrapper" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* CỘT TRÁI: FORM NHẬP LIỆU (Nền trắng, sạch sẽ) */}
        <div className="no-print" style={{ width: '40%', backgroundColor: '#fff', borderRight: '1px solid #E2E8F0', overflowY: 'auto', padding: '30px', height: 'calc(100vh - 70px)', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '22px', fontWeight: 'bold' }}>Chỉnh sửa CV</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleSaveCV}
                style={{ backgroundColor: '#F8FAFC', color: '#3B82F6', border: '1px solid #BFDBFE', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#EFF6FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F8FAFC'}
              >
                💾 Lưu CV
              </button>
              <button 
                onClick={handleExportPDF}
                style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
              >
                🖨️ Xuất PDF
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '15px', color: '#3B82F6', marginTop: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>1. Thông tin cá nhân</h3>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #CBD5E1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {cvData.avatar ? (
                    <img src={cvData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px', color: '#94A3B8' }}>👤</span>
                  )}
                </div>
                <div>
                  <label style={{ display: 'inline-block', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, backgroundColor: '#3B82F6', padding: '8px 16px', borderRadius: '6px', marginBottom: '8px', transition: 'background-color 0.2s' }}>
                    Tải ảnh lên
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  {cvData.avatar && (
                    <div onClick={() => setCvData({ ...cvData, avatar: '' })} style={{ fontSize: '12px', color: '#EF4444', cursor: 'pointer', fontWeight: 500, paddingLeft: '4px' }}>
                      Xóa ảnh
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" name="name" value={cvData.name} onChange={handleChange} className="modern-input" placeholder="Họ và tên" style={inputStyle} />
                <input type="text" name="title" value={cvData.title} onChange={handleChange} className="modern-input" placeholder="Vị trí ứng tuyển (VD: Full-stack Developer)" style={inputStyle} />
                <div style={{ display: 'flex', gap: '14px' }}>
                  <input type="text" name="phone" value={cvData.phone} onChange={handleChange} className="modern-input" placeholder="Số điện thoại" style={{...inputStyle, flex: 1}} />
                  <input type="email" name="email" value={cvData.email} onChange={handleChange} className="modern-input" placeholder="Email" style={{...inputStyle, flex: 1}} />
                </div>
                <input type="text" name="link" value={cvData.link} onChange={handleChange} className="modern-input" placeholder="Link Github/Portfolio" style={inputStyle} />
              </div>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '15px', color: '#3B82F6', marginTop: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>2. Tóm tắt & Kỹ năng</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <textarea name="summary" value={cvData.summary} onChange={handleChange} className="modern-input" placeholder="Giới thiệu bản thân..." rows="4" style={textareaStyle} />
                <textarea name="skills" value={cvData.skills} onChange={handleChange} className="modern-input" placeholder="Kỹ năng (Cách nhau bằng dấu phẩy)" rows="2" style={textareaStyle} />
              </div>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '15px', color: '#3B82F6', marginTop: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>3. Học vấn & Kinh nghiệm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Học vấn:</label>
                  <textarea name="education" value={cvData.education} onChange={handleChange} className="modern-input" placeholder="Trường học, ngành..." rows="3" style={textareaStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Kinh nghiệm / Dự án:</label>
                  <textarea name="experience" value={cvData.experience} onChange={handleChange} className="modern-input" placeholder="Chi tiết dự án, công việc..." rows="5" style={textareaStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢN XEM TRƯỚC (Nền xám nhạt để làm nổi tờ giấy A4 trắng) */}
        <div className="preview-col" style={{ width: '60%', backgroundColor: '#E2E8F0', height: 'calc(100vh - 70px)', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          
          <div className="print-area" style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#334155',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* HEADER CV SÁNG SỦA, CHUYÊN NGHIỆP */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '40px 50px', display: 'flex', gap: '30px', alignItems: 'center', borderBottom: '3px solid #3B82F6' }}>
              
              {cvData.avatar && (
                <div style={{ width: '130px', height: '130px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <img src={cvData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '36px', color: '#0F172A', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{cvData.name || 'HỌ VÀ TÊN'}</h1>
                <h2 style={{ fontSize: '18px', color: '#3B82F6', margin: '0 0 16px 0', fontWeight: 600 }}>{cvData.title || 'VỊ TRÍ ỨNG TUYỂN'}</h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#475569' }}>
                  {cvData.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📞 {cvData.phone}</span>}
                  {cvData.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✉️ {cvData.email}</span>}
                  {cvData.link && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔗 {cvData.link}</span>}
                </div>
              </div>
            </div>

            {/* NỘI DUNG CV */}
            <div style={{ padding: '40px 50px', display: 'flex', gap: '40px', flex: 1 }}>
              <div style={{ flex: 6.5 }}>
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={cleanSectionTitleStyle}>TÓM TẮT BẢN THÂN</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line', color: '#334155' }}>{cvData.summary}</p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={cleanSectionTitleStyle}>KINH NGHIỆM & DỰ ÁN</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line', color: '#334155' }}>{cvData.experience}</p>
                </div>
              </div>

              <div style={{ flex: 3.5 }}>
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={cleanSectionTitleStyle}>KỸ NĂNG</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cvData.skills.split(',').map((skill, index) => (
                      skill.trim() && (
                        <span key={index} style={{ backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '13px', padding: '6px 12px', borderRadius: '4px', fontWeight: 500, border: '1px solid #E2E8F0' }}>
                          {skill.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={cleanSectionTitleStyle}>HỌC VẤN</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line', color: '#334155' }}>{cvData.education}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px 16px', borderRadius: '6px', outline: 'none', fontSize: '14px', boxSizing: 'border-box', width: '100%'
};
const textareaStyle = {
  ...inputStyle, resize: 'vertical', fontFamily: 'inherit'
};

const cleanSectionTitleStyle = {
  fontSize: '16px', 
  color: '#0F172A', 
  marginBottom: '16px', 
  fontWeight: 700, 
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  borderBottom: '2px solid #E2E8F0',
  paddingBottom: '8px'
};

export default BuildCV;