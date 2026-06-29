import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { jobService } from '../services/jobService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
      
      {error && (
        <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium text-red-800 leading-relaxed">
              {error}
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium text-emerald-800 leading-relaxed">
              {success}
            </div>
          </div>
        </div>
      )}

      <JobForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

export default PostJob;