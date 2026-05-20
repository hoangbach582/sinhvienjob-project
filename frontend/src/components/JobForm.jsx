import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';
import { jobService } from '../services/jobService';

/**
 * JobForm component - Form dùng chung cho Đăng tuyển (PostJob) và Sửa tin (EditJob)
 * Tích hợp logic kiểm tra thay đổi form (Dirty), cảnh báo trước khi rời trang,
 * và hiển thị ConfirmDialog đẹp mắt khi bấm Hủy.
 */
function JobForm({ defaultValues, onSubmit, isSubmitting }) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);

  // Lấy danh sách ngành nghề
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await jobService.getIndustries();
        setIndustries(data);
      } catch (error) {
        console.error('Error fetching industries:', error);
        toast.error('Không thể tải danh sách ngành nghề');
      } finally {
        setIsLoadingIndustries(false);
      }
    };
    fetchIndustries();
  }, []);

  // Chuẩn hóa defaultValues để tránh sai lệch khi kiểm tra isDirty (ví dụ: các trường null từ database)
  const sanitizedDefaultValues = useMemo(() => {
    if (!defaultValues) {
      return {
        title: '',
        type: 'full_time',
        location: 'Hà Nội',
        industry: 'IT & Phần mềm',
        experience: 'Không yêu cầu',
        salary_min: '',
        salary_max: '',
        deadline: '',
        description: '',
        requirements: '',
        benefits: ''
      };
    }
    return {
      title: defaultValues.title || '',
      type: defaultValues.type || 'full_time',
      location: defaultValues.location || 'Hà Nội',
      industry: defaultValues.industry || 'IT & Phần mềm',
      experience: defaultValues.experience || 'Không yêu cầu',
      salary_min: defaultValues.salary_min !== null && defaultValues.salary_min !== undefined ? defaultValues.salary_min.toString() : '',
      salary_max: defaultValues.salary_max !== null && defaultValues.salary_max !== undefined ? defaultValues.salary_max.toString() : '',
      deadline: defaultValues.deadline || '',
      description: defaultValues.description || '',
      requirements: defaultValues.requirements || '',
      benefits: defaultValues.benefits || ''
    };
  }, [defaultValues]);

  // Khởi tạo useForm với dữ liệu đã chuẩn hóa để isDirty hoạt động chính xác nhất
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: sanitizedDefaultValues
  });

  // Lắng nghe sự kiện trước khi người dùng reload trang hoặc tắt tab khi form đã thay đổi
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = ''; // Hộp thoại mặc định của trình duyệt
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, isSubmitting]);

  /**
   * Hàm xử lý khi bấm nút Hủy
   * Kiểm tra xem form đã bị thay đổi (isDirty) chưa
   */
  const handleCancel = () => {
    // Nếu form chưa thay đổi gì -> quay về danh sách ngay lập tức
    if (!isDirty) {
      navigate('/employer/posted-jobs');
      return;
    }
    // Nếu đã thay đổi -> Mở hộp thoại xác nhận hủy
    setIsConfirmOpen(true);
  };

  /**
   * Xử lý xác nhận hủy từ Dialog
   * Reset form về ban đầu, thông báo thành công và điều hướng về trang danh sách
   */
  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    reset(sanitizedDefaultValues); // Reset form về dữ liệu ban đầu
    toast.success('Hủy thay đổi thành công!'); // Hiển thị toast thành công
    navigate('/employer/posted-jobs'); // Quay lại trang danh sách
  };

  /**
   * Xử lý từ chối hủy (tiếp tục chỉnh sửa)
   * Đóng Dialog và giữ nguyên form
   */
  const handleRejectCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '640px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Tiêu đề vị trí *</label>
          <input 
            className={`form-input ${errors.title ? 'is-invalid' : ''}`}
            placeholder="Vd: Lập trình viên Frontend" 
            {...register('title', { required: 'Tiêu đề là bắt buộc' })}
          />
          {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title.message}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Loại hình *</label>
          <select className="form-input" {...register('type', { required: true })}>
            <option value="part_time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="full_time">Full-time</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Ngành nghề</label>
          <select className="form-input" {...register('industry')} disabled={isLoadingIndustries}>
            {isLoadingIndustries ? (
              <option value="">Đang tải...</option>
            ) : industries.length > 0 ? (
              industries.map(ind => (
                <option key={ind.id} value={ind.name}>{ind.name}</option>
              ))
            ) : (
              <option value="Khác">Khác</option>
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Mức lương tối thiểu (VND)</label>
          <input className="form-input" type="number" placeholder="Vd: 5000000" {...register('salary_min')} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Mức lương tối đa (VND)</label>
          <input className="form-input" type="number" placeholder="Vd: 10000000" {...register('salary_max')} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Địa điểm</label>
          <input className="form-input" placeholder="Vd: Hà Nội" {...register('location')} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Kinh nghiệm</label>
          <select className="form-input" {...register('experience')}>
            <option value="Không yêu cầu">Không yêu cầu</option>
            <option value="Dưới 1 năm">Dưới 1 năm</option>
            <option value="1-2 năm">1-2 năm</option>
            <option value="Trên 2 năm">Trên 2 năm</option>
          </select>
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Hạn nộp hồ sơ</label>
          <input className="form-input" type="date" {...register('deadline')} />
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Mô tả công việc *</label>
          <textarea 
            className={`form-input ${errors.description ? 'is-invalid' : ''}`}
            rows="4" style={{ resize: 'none' }} 
            placeholder="Mô tả chi tiết công việc, trách nhiệm..."
            {...register('description', { required: 'Mô tả công việc là bắt buộc' })}
          ></textarea>
          {errors.description && <span style={{ color: 'red', fontSize: '12px' }}>{errors.description.message}</span>}
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Yêu cầu ứng viên</label>
          <textarea className="form-input" rows="3" style={{ resize: 'none' }} placeholder="Kỹ năng, trình độ, điều kiện cần có..." {...register('requirements')}></textarea>
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Quyền lợi</label>
          <textarea className="form-input" rows="3" style={{ resize: 'none' }} placeholder="Thưởng, bảo hiểm, môi trường làm việc..." {...register('benefits')}></textarea>
        </div>
      </div>
      
      {/* Cột các nút hành động (Hủy & Lưu) */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            background: '#F1F5F9', // Nền xám nhạt
            color: '#475569',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '8px 18px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E2E8F0'; // Hover màu xám đậm hơn rõ ràng
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#475569';
          }}
        >
          Hủy
        </button>
        
        <button
          type="submit"
          className="btn"
          disabled={isSubmitting}
          style={{
            background: '#10B981', // Đồng bộ với tông màu xanh lục của Nhà tuyển dụng
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            padding: '8px 18px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#059669'; // Hover màu xanh lục đậm hơn
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#10B981';
            }
          }}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu công việc'}
        </button>
      </div>

      {/* Confirm Dialog hiển thị khi có sự thay đổi và bấm nút Hủy */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Bạn có chắc muốn hủy?"
        message={`Các thay đổi chưa lưu sẽ bị mất.`}
        onConfirm={handleConfirmCancel}
        onCancel={handleRejectCancel}
      />
    </form>
  );
}

export default JobForm;

