import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Plus, RefreshCw } from 'lucide-react';

export default function IndustryModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      is_active: true
    }
  });

  const nameValue = watch('name');

  // Auto generate slug if user hasn't typed in slug manually
  useEffect(() => {
    if (!initialData && nameValue) {
      const generateSlug = (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      };
      setValue('slug', generateSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, initialData, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          slug: initialData.slug || '',
          description: initialData.description || '',
          is_active: initialData.is_active !== undefined ? initialData.is_active : true
        });
      } else {
        reset({
          name: '',
          slug: '',
          description: '',
          is_active: true
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.18)', animation: 'slideUp 0.2s ease-out',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 24px', borderBottom: '1px solid #e8ecf0', background: '#fafbfc',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {isEditMode ? 'Chỉnh sửa ngành nghề' : 'Thêm ngành nghề mới'}
                </h2>
                <button 
                    onClick={onClose}
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                        Tên ngành nghề <span style={{ color: '#B91C1C' }}>*</span>
                    </label>
                    <input
                        className="form-input"
                        placeholder="VD: IT & Phần mềm"
                        {...register('name', { required: 'Vui lòng nhập tên ngành nghề' })}
                        style={{ borderColor: errors.name ? '#fca5a5' : '#cbd5e1' }}
                    />
                    {errors.name && <p style={{ fontSize: '12px', color: '#B91C1C', marginTop: '4px' }}>{errors.name.message}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                        Slug (Đường dẫn) <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>(Tự động tạo hoặc nhập tay)</span>
                    </label>
                    <input
                        className="form-input"
                        placeholder="VD: it-phan-mem"
                        {...register('slug')}
                        style={{ borderColor: errors.slug ? '#fca5a5' : '#cbd5e1' }}
                    />
                    {errors.slug && <p style={{ fontSize: '12px', color: '#B91C1C', marginTop: '4px' }}>{errors.slug.message}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                        Mô tả (tùy chọn)
                    </label>
                    <textarea
                        className="form-input"
                        placeholder="Mô tả ngắn gọn về ngành nghề..."
                        rows={3}
                        {...register('description')}
                        style={{ resize: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                        type="checkbox" 
                        id="is_active"
                        {...register('is_active')}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="is_active" style={{ fontSize: '13px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
                        Trạng thái Hoạt động
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e8ecf0' }}>
                    <button type="button" className="btn" onClick={onClose} disabled={isSubmitting}>
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                        style={{ gap: '6px' }}
                    >
                        {isSubmitting ? (
                            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : isEditMode ? (
                            <Save size={14} />
                        ) : (
                            <Plus size={14} />
                        )}
                        {isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
