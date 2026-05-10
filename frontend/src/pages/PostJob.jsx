import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { jobService } from '../services/jobService';

function PostJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await jobService.createJob(data);
      setSuccess('Đăng tin tuyển dụng thành công!');
      // Navigate to posted jobs after a short delay
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

  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="section-title">Đăng tin tuyển dụng mới</p>
      
      {error && <div style={{ color: 'red', marginBottom: '12px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '12px', padding: '10px', backgroundColor: '#dcfce3', borderRadius: '4px' }}>{success}</div>}

      <JobForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

export default PostJob;