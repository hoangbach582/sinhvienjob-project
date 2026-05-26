import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { Search, X, Briefcase, Calendar, FileText, User } from 'lucide-react';

// Custom hook cho debounce search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Component hiển thị khung bộ lọc
const ApplicantFilters = ({ jobs, selectedJobId, setSelectedJobId, searchTerm, setSearchTerm, onClearFilters, hasActiveFilters }) => (
  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
    {hasActiveFilters && (
      <button 
        onClick={onClearFilters}
        className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded transition-colors"
      >
        <X size={16} /> Xóa lọc
      </button>
    )}
    
    <select 
      className="form-input text-sm w-full sm:w-[220px]" 
      value={selectedJobId}
      onChange={(e) => setSelectedJobId(e.target.value)}
    >
      <option value="">-- Tất cả tin tuyển dụng --</option>
      {jobs.map(job => (
        <option key={job.id} value={job.id}>{job.title}</option>
      ))}
    </select>
    
    <div className="relative w-full sm:w-[250px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text"
        className="form-input text-sm w-full pl-9" 
        placeholder="Tìm theo tên ứng viên..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>
);

// Component bảng danh sách ứng viên
const ApplicantsTable = ({ 
  applicants, 
  jobs, 
  isLoading, 
  hasActiveFilters, 
  onClearFilters,
  statusUpdates,
  handleStatusChange,
  handleSaveStatus,
  savingId
}) => {
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-100 rounded w-full"></div>
          <div className="h-16 bg-gray-50 rounded w-full"></div>
          <div className="h-16 bg-gray-50 rounded w-full"></div>
          <div className="h-16 bg-gray-50 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <User size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy ứng viên nào</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          {hasActiveFilters 
            ? "Thử thay đổi bộ lọc hoặc xóa lọc để xem các ứng viên khác."
            : "Bạn chưa có ứng viên nào ứng tuyển vào các vị trí của mình."}
        </p>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="mt-4 text-[#00b14f] font-medium hover:underline"
          >
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm">
            <th className="py-3 px-4 font-medium border-b whitespace-nowrap">Ứng viên</th>
            <th className="py-3 px-4 font-medium border-b whitespace-nowrap">Vị trí ứng tuyển</th>
            <th className="py-3 px-4 font-medium border-b whitespace-nowrap">Ngày nộp</th>
            <th className="py-3 px-4 font-medium border-b text-center whitespace-nowrap">CV</th>
            <th className="py-3 px-4 font-medium border-b whitespace-nowrap">Trạng thái</th>
            <th className="py-3 px-4 font-medium border-b text-center whitespace-nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applicants.map(app => {
            const jobTitle = app.job?.title || jobs.find(j => j.id === app.job_id)?.title || 'Vị trí không xác định';
            const isModified = !!statusUpdates[app.id];
            const isSaving = savingId === app.id;
            
            return (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {(app.student_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.student_name || 'Ứng viên'}</p>
                      <p className="text-xs text-gray-500">{app.student_email || 'Email'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    {jobTitle}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    {new Date(app.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <a 
                    href={app.cv_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    <FileText size={14} />
                    Xem CV
                  </a>
                </td>
                <td className="py-4 px-4">
                  <select 
                    className={`form-input text-sm py-1.5 px-3 rounded-md border ${
                      isModified ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                    }`}
                    style={{ height: 'auto', minWidth: '130px' }}
                    value={statusUpdates[app.id] || app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="reviewing">Đang xem xét</option>
                    <option value="interviewed">Mời phỏng vấn</option>
                    <option value="hired">Đã tuyển</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </td>
                <td className="py-4 px-4 text-center">
                  <button 
                    className={`btn text-xs px-4 py-1.5 rounded-md transition-all ${
                      isModified && !isSaving
                        ? 'btn-primary' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isModified || isSaving}
                    onClick={() => handleSaveStatus(app.id)}
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function EmployerApplicants() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  // State cho filters
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term 300ms
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // State cục bộ cho việc cập nhật trạng thái (chưa lưu)
  const [statusUpdates, setStatusUpdates] = useState({});

  // Query: Lấy danh sách jobs để hiện trong dropdown
  const { data: jobs = [] } = useQuery({
    queryKey: ['employerJobs'],
    queryFn: () => jobService.getEmployerJobs()
  });

  // Query: Lấy danh sách ứng viên (có filter)
  const { data: applicants = [], isLoading: isApplicantsLoading } = useQuery({
    queryKey: ['employerApplications', selectedJobId, debouncedSearchTerm],
    queryFn: () => jobService.getAllEmployerApplications({
      job_id: selectedJobId,
      search: debouncedSearchTerm
    })
  });

  // Mutation: Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => jobService.updateApplicationStatus(id, status),
    onSuccess: () => {
      alert('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['employerApplications'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  });

  const handleStatusChange = (applicantId, newStatus) => {
    setStatusUpdates(prev => ({
      ...prev,
      [applicantId]: newStatus
    }));
  };

  const handleSaveStatus = (applicantId) => {
    const newStatus = statusUpdates[applicantId];
    if (!newStatus) return;
    
    updateStatusMutation.mutate({ id: applicantId, status: newStatus }, {
      onSuccess: () => {
        // Xóa khỏi state update sau khi thành công
        setStatusUpdates(prev => {
          const updated = { ...prev };
          delete updated[applicantId];
          return updated;
        });
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedJobId('');
    setSearchTerm('');
    setSearchParams({}); // Xóa param url nếu có
  };

  const hasActiveFilters = selectedJobId !== '' || searchTerm !== '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Quản lý hồ sơ ứng viên</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {applicants.length} ứng viên {hasActiveFilters ? 'phù hợp với bộ lọc' : 'từ tất cả tin tuyển dụng'}
          </p>
        </div>
        
        <ApplicantFilters 
          jobs={jobs}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="table-wrap bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <ApplicantsTable 
          applicants={applicants}
          jobs={jobs}
          isLoading={isApplicantsLoading}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          statusUpdates={statusUpdates}
          handleStatusChange={handleStatusChange}
          handleSaveStatus={handleSaveStatus}
          savingId={updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null}
        />
      </div>
    </div>
  );
}

export default EmployerApplicants;