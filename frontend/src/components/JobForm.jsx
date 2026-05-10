import React from 'react';
import { useForm } from 'react-hook-form';

function JobForm({ defaultValues, onSubmit, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      type: 'full_time',
      location: 'Hà Nội',
      industry: 'IT & Phần mềm',
      experience: 'Không yêu cầu'
    }
  });

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
          <select className="form-input" {...register('industry')}>
            <option value="IT & Phần mềm">IT & Phần mềm</option>
            <option value="Marketing">Marketing</option>
            <option value="Thiết kế">Thiết kế</option>
            <option value="Kinh doanh">Kinh doanh</option>
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
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button type="button" className="btn">Hủy</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu công việc'}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
