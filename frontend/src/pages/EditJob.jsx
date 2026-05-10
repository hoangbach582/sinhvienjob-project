import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { jobService } from '../services/jobService';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobDetail(id);
        
        // Cần format lại deadline để thẻ input type="date" có thể đọc được (YYYY-MM-DD)
        if (data.deadline) {
           data.deadline = data.deadline.split('T')[0];
        }

        setJob(data);
      } catch (err) {
        setError('Không thể tải thông tin tin tuyển dụng hoặc bạn không có quyền sửa.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await jobService.updateJob(id, data);
      setSuccess('Cập nhật tin tuyển dụng thành công!');
      setTimeout(() => {
        navigate('/employer/posted-jobs');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        setError(errors[firstErrorKey][0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Lỗi: ${err.message || 'Không thể kết nối đến máy chủ.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

  if (error && !job) {
    return (
      <div style={{ maxWidth: '640px' }}>
        <div style={{ padding: '16px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '8px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="section-title">Chỉnh sửa tin tuyển dụng</p>
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#FDECEC', color: '#E24B4A', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '12px', backgroundColor: '#EAF3DE', color: '#3B6D11', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
          {success}
        </div>
      )}

      <JobForm 
        defaultValues={job} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting} 
        submitText="Lưu thay đổi" 
      />
    </div>
  );
}

export default EditJob;
