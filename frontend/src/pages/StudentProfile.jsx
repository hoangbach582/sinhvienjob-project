import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { updateUser } = useAuth(); // Gọi hàm cập nhật từ Context

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    cvUrl: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatarUrl: data.avatar || '',
          cvUrl: data.cv_url || ''
        });
      }
    } catch (error) {
      console.error("Lỗi tải hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const submitData = new FormData();
    submitData.append('full_name', formData.full_name);
    submitData.append('phone', formData.phone);
    submitData.append('bio', formData.bio);
    
    if (avatarFile) submitData.append('avatar', avatarFile);
    if (cvFile) submitData.append('cv', cvFile);

    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        // Gắn thông báo thành công để kích hoạt Popup Box
        setMessage({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
        
        setFormData(prev => ({
          ...prev,
          avatarUrl: data.profile.avatar || prev.avatarUrl,
          cvUrl: data.profile.cv_url || prev.cvUrl
        }));
        setAvatarFile(null); 
        setCvFile(null);

        // GỌI HÀM UPDATE USER ĐỂ TRUYỀN DỮ LIỆU LÊN TOPBAR
        updateUser({
          name: formData.full_name,
          avatar: data.profile.avatar // Đẩy ảnh mới lấy từ Backend lên
        });

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if(storedUser) {
           storedUser.name = formData.full_name;
           localStorage.setItem('user', JSON.stringify(storedUser));
        }
      } else {
        const errorMessages = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setMessage({ text: errorMessages || 'Có lỗi xảy ra!', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;

  return (
    <MainLayout>

      {/* KHU VỰC POPUP THÀNH CÔNG (Nổi giữa màn hình) */}
      {message.text && message.type === 'success' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '50px', marginBottom: '12px', lineHeight: 1 }}>✅</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '20px', fontWeight: 'bold' }}>Hoàn tất!</h3>
            <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '15px' }}>{message.text}</p>
            <button 
              onClick={() => setMessage({ text: '', type: '' })} 
              style={{ width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '24px', color: '#0F172A', marginBottom: '24px' }}>Hồ sơ cá nhân</h1>
        
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          
          {/* Thông báo lỗi vẫn giữ dạng thanh ngang bên trong form */}
          {message.text && message.type === 'error' && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '14px', fontWeight: 500 }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />) : (
                    <span style={{ fontSize: '32px', color: '#94A3B8' }}>👤</span>
                  )}
                </div>
                <label style={{ cursor: 'pointer', fontSize: '13px', color: '#3B82F6', fontWeight: 500, backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '20px' }}>
                  Đổi ảnh
                  <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>Họ và tên</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>Email (Tài khoản đăng nhập)</label>
                  <input type="email" value={formData.email} disabled style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#94A3B8', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>Số điện thoại liên hệ</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>Giới thiệu ngắn gọn (Bio)</label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Viết vài dòng giới thiệu về bản thân, kỹ năng nổi bật..." rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px dashed #94A3B8' }}>
              <label style={{ display: 'block', fontSize: '15px', color: '#0F172A', marginBottom: '8px', fontWeight: 600 }}>Hồ sơ xin việc (CV)</label>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>Tải lên file PDF định dạng chuẩn để nhà tuyển dụng đánh giá. (Tối đa 5MB)</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: 500, color: '#334155' }}>
                  📁 {cvFile ? 'Đã chọn file mới' : 'Chọn file PDF'}
                  <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
                
                {cvFile ? (
                  <span style={{ fontSize: '14px', color: '#10B981', fontWeight: 500 }}>{cvFile.name}</span>
                ) : formData.cvUrl ? (
                  <a href={formData.cvUrl} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
                    👀 Xem CV hiện tại của bạn
                  </a>
                ) : (
                  <span style={{ fontSize: '14px', color: '#94A3B8' }}>Chưa có file nào được tải lên.</span>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '10px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '12px 32px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
                {saving ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default StudentProfile;