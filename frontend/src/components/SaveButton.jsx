import React, { useState } from 'react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const SaveButton = ({ jobId, size = 20, showText = false }) => {
  const { isSaved, toggleSave } = useSavedJobs();
  const { isLoggedIn, userRole } = useAuth(); // Fix: use correct context values
  const [isToggling, setIsToggling] = useState(false);

  const saved = isSaved(jobId);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để lưu việc làm');
      return;
    }

    if (userRole !== 'student') {
      toast.error('Chỉ sinh viên mới có thể lưu việc làm');
      return;
    }

    setIsToggling(true);
    try {
      const newState = await toggleSave(jobId);
      toast.success(newState ? 'Đã lưu việc làm' : 'Đã bỏ lưu việc làm');
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.2s',
        color: saved ? '#EF4444' : '#94A3B8',
        backgroundColor: saved ? '#FEF2F2' : 'transparent',
      }}
      title={saved ? 'Bỏ lưu' : 'Lưu việc làm'}
      onMouseEnter={(e) => {
        if (!saved) e.currentTarget.style.backgroundColor = '#F1F5F9';
        else e.currentTarget.style.backgroundColor = '#FEE2E2';
      }}
      onMouseLeave={(e) => {
        if (!saved) e.currentTarget.style.backgroundColor = 'transparent';
        else e.currentTarget.style.backgroundColor = '#FEF2F2';
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {showText && (
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          {saved ? 'Đã lưu' : 'Lưu tin'}
        </span>
      )}
    </button>
  );
};

export default SaveButton;
