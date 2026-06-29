import React, { useState, useEffect, useRef } from 'react';
import employerService from '../services/employerService';
import { useAuth } from '../context/AuthContext';

function EmployerProfile() {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    website: '',
    description: '',
    logo: null
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await employerService.getEmployerProfile();
      setFormData({
        company_name: data.company_name || '',
        industry: data.industry || '',
        website: data.website || '',
        description: data.description || '',
        logo: null
      });
      if (data.logo_url) {
        setPreviewUrl(data.logo_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin công ty.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File ảnh không được vượt quá 2MB.' });
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    const data = new FormData();
    data.append('company_name', formData.company_name);
    data.append('industry', formData.industry);
    data.append('website', formData.website);
    data.append('description', formData.description);
    
    if (formData.logo) {
      data.append('logo', formData.logo);
    } else if (previewUrl === null) {
        data.append('logo', 'null');
    }

    try {
      const response = await employerService.updateEmployerProfile(data);
      setMessage({ type: 'success', text: response.message || 'Cập nhật thông tin thành công!' });
      // Cập nhật lại logo_url nếu có thay đổi từ server
      if (response.employer) {
          if (response.employer.logo_url !== undefined) {
              setPreviewUrl(response.employer.logo_url);
              updateUser({ avatar: response.employer.logo_url });
          }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        setMessage({ type: 'error', text: 'Vui lòng kiểm tra lại thông tin nhập vào.' });
      } else {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
      }
    } finally {
      setUpdating(false);
    }
  };

  const removeLogo = () => {
      setFormData(prev => ({ ...prev, logo: null }));
      setPreviewUrl(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Đang tải thông tin...</div>;
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <p className="section-title">Thông tin công ty</p>
      
      {message.text && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '6px',
          backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: message.type === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${message.type === 'success' ? '#10B981' : '#F87171'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
          <div className="avatar-preview" style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '8px', 
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            overflow: 'hidden'
          }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '24px', color: '#94A3B8' }}>🏢</span>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Tải logo lên
                </button>
                {previewUrl && (
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#FEE2E2', color: '#EF4444', border: '1px solid #FECACA' }}
                      onClick={removeLogo}
                    >
                      Xóa logo
                    </button>
                )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>Định dạng JPG, PNG. Tối đa 2MB.</p>
            {errors.logo && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.logo[0]}</p>}
          </div>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tên công ty <span style={{ color: '#EF4444' }}>*</span></label>
          <input 
            name="company_name"
            className={`form-input ${errors.company_name ? 'is-invalid' : ''}`}
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder="Nhập tên công ty"
          />
          {errors.company_name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.company_name[0]}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Lĩnh vực hoạt động <span style={{ color: '#EF4444' }}>*</span></label>
          <input 
            name="industry"
            className={`form-input ${errors.industry ? 'is-invalid' : ''}`}
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="Ví dụ: Công nghệ thông tin"
          />
          {errors.industry && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.industry[0]}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Website</label>
          <input 
            name="website"
            className={`form-input ${errors.website ? 'is-invalid' : ''}`}
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
          {errors.website && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.website[0]}</p>}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Giới thiệu về công ty</label>
          <textarea 
            name="description"
            className={`form-input ${errors.description ? 'is-invalid' : ''}`}
            rows="5" 
            style={{ resize: 'none' }}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả ngắn về công ty của bạn..."
          ></textarea>
          {errors.description && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.description[0]}</p>}
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={updating}
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployerProfile;