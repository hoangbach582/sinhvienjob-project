import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomeNavbar from '../components/home/HomeNavbar';
import FooterNew from '../components/FooterNew';
import JobDetailHero from '../components/job/JobDetailHero';
import JobDetailContent from '../components/job/JobDetailContent';
import { JobDetailSimilar } from '../components/job/JobDetailSections';

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
      } catch (err) {
        console.error("Lỗi khi tải chi tiết việc làm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);


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
    } catch {
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

  // Loading state
  if (loading) {
    return (
      <div className="home-page min-h-screen flex flex-col " style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-white/20 border-t-brand-light rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="home-page min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 text-lg mb-4">Không tìm thấy công việc này!</p>
            <Link to="/jobs" className="text-brand-light hover:underline no-underline text-sm">← Quay lại danh sách việc làm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #09144B 0%, #0B1656 45%, #1a0a3e 100%)' }}>
      <HomeNavbar />

      {/* --- APPLY MODAL (Dark themed) --- */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl overflow-hidden w-full max-w-[550px] mx-5" style={{ background: 'rgba(18,14,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>

            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-white font-bold text-lg m-0">Nộp CV Ứng Tuyển</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-white/40 hover:text-white bg-transparent border-none text-xl cursor-pointer transition-colors">✖</button>
            </div>

            <div className="p-6">
              {applyMessage.text && (
                <div className={`p-3 mb-5 rounded-xl text-sm font-medium text-center ${applyMessage.type === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {applyMessage.type === 'success' ? `✅ ${applyMessage.text}` : `❌ ${applyMessage.text}`}
                </div>
              )}

              <form onSubmit={submitApplication} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-3 font-semibold">
                    Tệp CV đính kèm <span className="text-red-400">*</span>
                  </label>

                  {/* 2 LỰA CHỌN (TABS) */}
                  <div className="flex gap-3 mb-4">
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="cvOption" value="profile" checked={cvOption === 'profile'} onChange={() => setCvOption('profile')} className="hidden" />
                      <div className={`p-3 text-center rounded-xl text-sm font-medium transition-all ${cvOption === 'profile' ? 'text-brand-light' : 'text-white/50'}`} style={{ background: cvOption === 'profile' ? 'rgba(130,63,235,0.15)' : 'rgba(255,255,255,0.05)', border: cvOption === 'profile' ? '1px solid rgba(130,63,235,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                        📂 Dùng CV trong Hồ sơ
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="cvOption" value="upload" checked={cvOption === 'upload'} onChange={() => setCvOption('upload')} className="hidden" />
                      <div className={`p-3 text-center rounded-xl text-sm font-medium transition-all ${cvOption === 'upload' ? 'text-brand-light' : 'text-white/50'}`} style={{ background: cvOption === 'upload' ? 'rgba(130,63,235,0.15)' : 'rgba(255,255,255,0.05)', border: cvOption === 'upload' ? '1px solid rgba(130,63,235,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                        💻 Tải lên CV mới
                      </div>
                    </label>
                  </div>

                  {/* KHU VỰC HIỂN THỊ THEO LỰA CHỌN */}
                  {cvOption === 'profile' ? (
                    <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <span className="text-xl">💡</span>
                      <p className="m-0 text-sm text-emerald-400/90 leading-relaxed">
                        Hệ thống sẽ tự động trích xuất <b>CV hiện tại trong Hồ sơ cá nhân</b> của bạn để gửi cho nhà tuyển dụng.
                      </p>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="p-8 rounded-xl text-center transition-all"
                      style={{
                        border: isDragging ? '2px dashed rgba(130,63,235,0.6)' : '2px dashed rgba(255,255,255,0.15)',
                        background: isDragging ? 'rgba(130,63,235,0.1)' : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {customCvFile ? (
                        <div>
                          <div className="text-3xl mb-2">📄</div>
                          <p className="m-0 mb-1 text-white font-semibold text-sm">{customCvFile.name}</p>
                          <p className="m-0 mb-4 text-white/40 text-xs">{(customCvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <span onClick={() => setCustomCvFile(null)} className="text-red-400 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-lg" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)' }}>
                            Xóa file này
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl mb-3 text-white/30">☁️</div>
                          <p className="m-0 mb-2 text-white/70 font-medium text-sm">Kéo thả file CV của bạn vào đây</p>
                          <p className="m-0 mb-4 text-white/40 text-xs">Hỗ trợ định dạng .pdf, .doc, .docx (Dưới 5MB)</p>
                          <label className="cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-semibold text-brand-light" style={{ background: 'rgba(130,63,235,0.15)', border: '1px solid rgba(130,63,235,0.3)' }}>
                            Hoặc chọn file từ máy
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2 font-semibold">Thư ngỏ (Cover Letter)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Viết một vài dòng giới thiệu bản thân và lý do bạn ứng tuyển..."
                    rows="4"
                    className="w-full p-3 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-vertical box-border"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isApplying || applyMessage.type === 'success'}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-base border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #823feb, #6366f1)' }}
                >
                  {isApplying ? 'Đang gửi hồ sơ...' : '🚀 Gửi CV Ngay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* --- KẾT THÚC KHỐI MODAL --- */}

      <JobDetailHero
        job={job}
        formatSalary={formatSalary}
        translateType={translateType}
        hasApplied={hasApplied}
        isApplying={isApplying}
        onApply={handleOpenApply}
      />

      <JobDetailContent job={job} />

      <JobDetailSimilar
        currentJobId={id}
        formatSalary={formatSalary}
        translateType={translateType}
      />

      <FooterNew />
    </div>
  );
}

export default JobDetail;