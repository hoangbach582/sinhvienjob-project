import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth(); 
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // --- STATE DÀNH RIÊNG CHO MODAL ỨNG TUYỂN ---
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  
  // Các state mới cho tính năng Upload nâng cao
  const [cvOption, setCvOption] = useState('profile'); // 'profile' hoặc 'upload'
  const [customCvFile, setCustomCvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [applyMessage, setApplyMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data);
        if (token) setHasApplied(data.has_applied);
        else setHasApplied(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 

    if (!token || !isLoggedIn) {
      const confirmLogin = window.confirm("Bạn cần đăng nhập tài khoản Sinh viên để ứng tuyển. Đi đến trang Đăng nhập ngay?");
      if (confirmLogin) navigate('/login');
      return; 
    }

    if (userRole !== 'student') {
      alert("Chỉ tài khoản Sinh viên mới có quyền nộp CV ứng tuyển!");
      return;
    }

    setShowApplyModal(true);
    setApplyMessage({ text: '', type: '' });
    setCvOption('profile');
    setCustomCvFile(null);
  };

  // --- HÀM XỬ LÝ KÉO THẢ VÀ KIỂM TRA FILE ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Kiểm tra dung lượng (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setApplyMessage({ text: 'Kích thước file vượt quá 5MB!', type: 'error' });
      return;
    }

    // Kiểm tra định dạng đuôi file
    const validExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setApplyMessage({ text: 'Chỉ hỗ trợ định dạng .pdf, .doc, .docx!', type: 'error' });
      return;
    }

    setCustomCvFile(file);
    setApplyMessage({ text: '', type: '' }); // Xóa lỗi nếu chọn file đúng
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    
    // Nếu chọn Upload mà chưa có file thì chặn lại
    if (cvOption === 'upload' && !customCvFile) {
      setApplyMessage({ text: 'Vui lòng chọn hoặc kéo thả file CV của bạn!', type: 'error' });
      return;
    }

    setIsApplying(true);
    setApplyMessage({ text: '', type: '' });

    const formData = new FormData();
    if (coverLetter) formData.append('cover_letter', coverLetter);
    
    // Chỉ đính kèm file nếu người dùng chọn tab Upload
    if (cvOption === 'upload' && customCvFile) {
      formData.append('cv_file', customCvFile);
    }

    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        setApplyMessage({ text: data.message || "Ứng tuyển thành công!", type: 'success' });
        setHasApplied(true); 
        setTimeout(() => setShowApplyModal(false), 2000);
      } else {
        setApplyMessage({ text: data.message || "Có lỗi xảy ra!", type: 'error' });
      }
    } catch (error) {
      setApplyMessage({ text: "Lỗi kết nối! Vui lòng thử lại.", type: 'error' });
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const minMil = min ? min / 1000000 : 0;
    const maxMil = max ? max / 1000000 : 0;
    if (minMil && maxMil) return `${minMil} - ${maxMil} triệu`;
    if (minMil) return `Từ ${minMil} triệu`;
    if (maxMil) return `Lên đến ${maxMil} triệu`;
    return 'Thỏa thuận';
  };

  const translateType = (type) => {
    const types = { 'full_time': 'Toàn thời gian', 'part_time': 'Bán thời gian', 'internship': 'Thực tập sinh' };
    return types[type] || type;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin...</div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy công việc này!</div>;

  return (
    <MainLayout>

      {/* --- KHỐI MODAL ỨNG TUYỂN CẢI TIẾN --- */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '550px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #E2E8F0', margin: '20px' }}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: 'bold' }}>Nộp CV Ứng Tuyển</h3>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}>✖</button>
            </div>

            <div style={{ padding: '24px' }}>
              {applyMessage.text && (
                <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', backgroundColor: applyMessage.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: applyMessage.type === 'success' ? '#16A34A' : '#DC2626', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
                  {applyMessage.type === 'success' ? `✅ ${applyMessage.text}` : `❌ ${applyMessage.text}`}
                </div>
              )}

              <form onSubmit={submitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#0F172A', marginBottom: '12px', fontWeight: 600 }}>
                    Tệp CV đính kèm <span style={{color: '#EF4444'}}>*</span>
                  </label>

                  {/* 2 LỰA CHỌN (TABS) */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <label style={{ flex: 1, cursor: 'pointer' }}>
                      <input type="radio" name="cvOption" value="profile" checked={cvOption === 'profile'} onChange={() => setCvOption('profile')} style={{ display: 'none' }} />
                      <div style={{ padding: '12px', textAlign: 'center', borderRadius: '8px', border: cvOption === 'profile' ? '2px solid #3B82F6' : '1px solid #CBD5E1', backgroundColor: cvOption === 'profile' ? '#EFF6FF' : '#F8FAFC', color: cvOption === 'profile' ? '#1D4ED8' : '#475569', fontWeight: cvOption === 'profile' ? 600 : 500, transition: 'all 0.2s' }}>
                        📂 Dùng CV trong Hồ sơ
                      </div>
                    </label>
                    <label style={{ flex: 1, cursor: 'pointer' }}>
                      <input type="radio" name="cvOption" value="upload" checked={cvOption === 'upload'} onChange={() => setCvOption('upload')} style={{ display: 'none' }} />
                      <div style={{ padding: '12px', textAlign: 'center', borderRadius: '8px', border: cvOption === 'upload' ? '2px solid #3B82F6' : '1px solid #CBD5E1', backgroundColor: cvOption === 'upload' ? '#EFF6FF' : '#F8FAFC', color: cvOption === 'upload' ? '#1D4ED8' : '#475569', fontWeight: cvOption === 'upload' ? 600 : 500, transition: 'all 0.2s' }}>
                        💻 Tải lên CV mới
                      </div>
                    </label>
                  </div>

                  {/* KHU VỰC HIỂN THỊ THEO LỰA CHỌN */}
                  {cvOption === 'profile' ? (
                    <div style={{ padding: '16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>💡</span>
                      <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                        Hệ thống sẽ tự động trích xuất <b>CV hiện tại trong Hồ sơ cá nhân</b> của bạn để gửi cho nhà tuyển dụng.
                      </p>
                    </div>
                  ) : (
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{ 
                        padding: '30px 20px', 
                        border: isDragging ? '2px dashed #3B82F6' : '2px dashed #CBD5E1', 
                        borderRadius: '8px', 
                        backgroundColor: isDragging ? '#EFF6FF' : '#F8FAFC',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      {customCvFile ? (
                        <div>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                          <p style={{ margin: '0 0 8px 0', color: '#0F172A', fontWeight: 600, fontSize: '14px' }}>{customCvFile.name}</p>
                          <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '12px' }}>{(customCvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <span onClick={() => setCustomCvFile(null)} style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '6px 12px', border: '1px solid #FECACA', borderRadius: '6px', backgroundColor: '#FEF2F2' }}>
                            Xóa file này
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '32px', marginBottom: '12px', color: '#94A3B8' }}>☁️</div>
                          <p style={{ margin: '0 0 8px 0', color: '#334155', fontWeight: 500, fontSize: '14px' }}>
                            Kéo thả file CV của bạn vào đây
                          </p>
                          <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '12px' }}>
                            Hỗ trợ định dạng .pdf, .doc, .docx (Dưới 5MB)
                          </p>
                          <label style={{ cursor: 'pointer', display: 'inline-block', backgroundColor: '#fff', color: '#3B82F6', border: '1px solid #BFDBFE', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Hoặc chọn file từ máy
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#0F172A', marginBottom: '8px', fontWeight: 600 }}>Thư ngỏ (Cover Letter)</label>
                  <textarea 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)} 
                    placeholder="Viết một vài dòng giới thiệu bản thân và lý do bạn ứng tuyển..." 
                    rows="4" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isApplying || applyMessage.type === 'success'}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: (isApplying || applyMessage.type === 'success') ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
                >
                  {isApplying ? 'Đang gửi hồ sơ...' : '🚀 Gửi CV Ngay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* --- KẾT THÚC KHỐI MODAL --- */}

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
          ← Quay lại trang chủ
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '16px' }}>{job.title}</h1>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Mức lương</span>
                  <span style={{ color: '#10B981', fontWeight: 600, fontSize: '16px' }}>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Địa điểm</span>
                  <span style={{ color: '#334155', fontWeight: 500, fontSize: '15px' }}>📍 {job.location}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Hình thức</span>
                  <span style={{ color: '#334155', fontWeight: 500, fontSize: '15px' }}>⏱️ {translateType(job.type)}</span>
                </div>
              </div>

              <button 
                onClick={handleOpenApply} 
                disabled={isApplying || hasApplied}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: (isApplying || hasApplied) ? '#94A3B8' : '#3B82F6', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  cursor: (isApplying || hasApplied) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {hasApplied ? '✅ Đã ứng tuyển' : (isApplying ? 'Đang gửi hồ sơ...' : 'Ứng tuyển ngay')}
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', color: '#0F172A', marginBottom: '16px', borderLeft: '4px solid #3B82F6', paddingLeft: '12px' }}>Mô tả công việc</h3>
              <p style={{ color: '#334155', lineHeight: '1.6', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>{job.description}</p>

              <h3 style={{ fontSize: '18px', color: '#0F172A', marginBottom: '16px', borderLeft: '4px solid #3B82F6', paddingLeft: '12px' }}>Yêu cầu ứng viên</h3>
              <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
            </div>
          </div>

          <div style={{ flex: 1, backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#94A3B8' }}>
                {job.employer?.company_name?.substring(0, 2).toUpperCase() || 'CT'}
              </div>
              <h3 style={{ fontSize: '16px', color: '#0F172A', margin: 0 }}>{job.employer?.company_name || 'Đang cập nhật'}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hạn nộp hồ sơ:</span>
                <span style={{ fontWeight: 600, color: '#E11D48' }}>{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không thời hạn'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default JobDetail;