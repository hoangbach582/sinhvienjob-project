import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { Search, X, Briefcase, Calendar, FileText, User, MessageSquare, ChevronDown, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// -------------------------------------------------------------
// Hooks
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Constants
// -------------------------------------------------------------
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xét duyệt', color: 'text-yellow-700 bg-yellow-50 border-yellow-200 focus:ring-yellow-500' },
  { value: 'reviewing', label: 'Đang xem xét', color: 'text-blue-700 bg-blue-50 border-blue-200 focus:ring-blue-500' },
  { value: 'interview', label: 'Mời phỏng vấn', color: 'text-purple-700 bg-purple-50 border-purple-200 focus:ring-purple-500' },
  { value: 'rejected', label: 'Từ chối', color: 'text-red-700 bg-red-50 border-red-200 focus:ring-red-500' },
  { value: 'accepted', label: 'Được nhận', color: 'text-green-700 bg-green-50 border-green-200 focus:ring-green-500' },
];

const STATUS_FILTERS = [
  { value: '', label: 'Tất cả trạng thái' },
  ...STATUS_OPTIONS
];

// -------------------------------------------------------------
// Components
// -------------------------------------------------------------

// Component chọn trạng thái
const StatusSelect = ({ currentStatus, onChange, isLoading }) => {
  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div className="relative inline-block w-[150px]">
      <select
        value={currentStatus}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className={`w-full appearance-none cursor-pointer border rounded-lg py-2 pl-3 pr-8 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-wait ${currentOption.color}`}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value} className="text-gray-900 bg-white font-normal">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <ChevronDown size={14} className="opacity-70" />
        )}
      </div>
    </div>
  );
};

// Modal từ chối ứng viên
const RejectModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg text-gray-900">Lý do từ chối</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">Vui lòng nhập lý do từ chối ứng viên (nếu có). Lý do này có thể được gửi cho ứng viên.</p>
          <textarea
            className="w-full form-input border-gray-300 rounded-lg p-3 text-sm focus:ring-[#00b14f] focus:border-[#00b14f]"
            rows="4"
            placeholder="Ví dụ: Chưa phù hợp với định hướng công ty..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(reason)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              'Xác nhận từ chối'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal ghi chú
const NoteModal = ({ isOpen, onClose, initialNote, onSubmit, isSubmitting }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg text-gray-900">Ghi chú nội bộ</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">Ghi chú này chỉ hiển thị với nhà tuyển dụng, ứng viên sẽ không thấy.</p>
          <textarea
            className="w-full form-input border-gray-300 rounded-lg p-3 text-sm focus:ring-[#00b14f] focus:border-[#00b14f]"
            rows="4"
            placeholder="Nhập ghi chú về ứng viên này..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(note)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#00b14f] rounded-lg hover:bg-[#009944] transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              'Lưu ghi chú'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hàng ứng viên trong bảng
const ApplicantRow = ({ app, jobs, onStatusChange, isUpdatingStatus, onOpenRejectModal, onOpenNoteModal }) => {
  const jobTitle = app.job?.title || jobs.find(j => j.id === app.job_id)?.title || 'Vị trí không xác định';
  
  const handleStatusSelect = (newStatus) => {
    if (newStatus === 'rejected') {
      onOpenRejectModal(app);
    } else {
      onStatusChange(app.id, newStatus);
    }
  };

  return (
    <tr className="hover:bg-gray-50/70 transition-colors group">
      <td className="py-4 px-4 min-w-[240px]">
        <div className="flex items-center gap-3">
          {app.student_avatar ? (
            <img 
              src={app.student_avatar} 
              alt={app.student_name}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 shrink-0"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-sm border border-blue-200 ${app.student_avatar ? 'hidden' : ''}`}>
            {(app.student_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{app.student_name || 'Ứng viên'}</p>
            <p className="text-xs text-gray-500">{app.student_email || 'Chưa có email'}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-700 min-w-[200px]">
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-gray-400 shrink-0" />
          <span className="font-medium line-clamp-2">{jobTitle}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          {new Date(app.created_at || app.applied_at).toLocaleDateString('vi-VN')}
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <a 
          href={app.cv_url} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 hover:shadow-sm transition-all border border-blue-100"
        >
          <FileText size={14} />
          Xem CV
        </a>
      </td>
      <td className="py-4 px-4">
        <StatusSelect 
          currentStatus={app.status || 'pending'} 
          onChange={handleStatusSelect} 
          isLoading={isUpdatingStatus}
        />
      </td>
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => onOpenNoteModal(app)}
            className={`p-2 rounded-lg transition-colors ${
              app.employer_notes 
                ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Ghi chú nội bộ"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Component khung bộ lọc
const ApplicantFilters = ({ jobs, selectedJobId, setSelectedJobId, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onClearFilters, hasActiveFilters }) => (
  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
    <div className="relative w-full sm:w-[240px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text"
        className="form-input text-sm w-full pl-9 rounded-lg border-gray-300 focus:ring-[#00b14f] focus:border-[#00b14f]" 
        placeholder="Tìm theo tên hoặc email..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <select 
      className="form-input text-sm w-full sm:w-[220px] rounded-lg border-gray-300 focus:ring-[#00b14f] focus:border-[#00b14f]" 
      value={selectedJobId}
      onChange={(e) => setSelectedJobId(e.target.value)}
    >
      <option value="">-- Tất cả tin tuyển dụng --</option>
      {jobs.map(job => (
        <option key={job.id} value={job.id}>{job.title}</option>
      ))}
    </select>
    
    <select 
      className="form-input text-sm w-full sm:w-[180px] rounded-lg border-gray-300 focus:ring-[#00b14f] focus:border-[#00b14f]" 
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      {STATUS_FILTERS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    
    {hasActiveFilters && (
      <button 
        onClick={onClearFilters}
        className="text-sm text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors border border-red-100"
      >
        <XCircle size={16} /> Bỏ lọc
      </button>
    )}
  </div>
);

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------
export default function EmployerApplicants() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  // State filters
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Modal states
  const [rejectModalData, setRejectModalData] = useState(null); // { applicant: null }
  const [noteModalData, setNoteModalData] = useState(null); // { applicant: null }

  // Queries
  const { data: jobs = [] } = useQuery({
    queryKey: ['employerJobs'],
    queryFn: () => jobService.getEmployerJobs()
  });

  const { data: applicants = [], isLoading: isApplicantsLoading } = useQuery({
    queryKey: ['employerApplications', selectedJobId, debouncedSearchTerm, statusFilter],
    queryFn: async () => {
      let data = await jobService.getAllEmployerApplications({
        job_id: selectedJobId,
        search: debouncedSearchTerm
      });
      // Filter by status if needed on frontend (if backend doesn't support status filter yet)
      if (statusFilter) {
        data = data.filter(app => app.status === statusFilter);
      }
      return data;
    }
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reject_reason }) => {
      // Pass reject_reason as well. If backend doesn't handle it, it will just ignore.
      return jobService.updateApplicationStatus(id, status, { reject_reason });
    },
    onSuccess: (data, variables) => {
      toast.success('Đã cập nhật trạng thái hồ sơ');
      queryClient.invalidateQueries({ queryKey: ['employerApplications'] });
      if (rejectModalData?.applicant?.id === variables.id) {
        setRejectModalData(null);
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      console.error(error);
    }
  });

  // Mutation for notes (we reuse update status endpoint if it accepts notes, or assume custom endpoint)
  // If backend doesn't support notes, this is a placeholder. 
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, employer_notes }) => {
      // Try to patch with notes.
      // return jobService.updateApplicationNote(id, employer_notes);
      // Fallback: we just use the status patch if it accepts random fields, otherwise this may fail.
      return jobService.updateApplicationStatus(id, undefined, { employer_notes });
    },
    onSuccess: () => {
      toast.success('Đã lưu ghi chú');
      queryClient.invalidateQueries({ queryKey: ['employerApplications'] });
      setNoteModalData(null);
    },
    onError: () => {
      // Ignore error for now if backend doesn't support it, just close
      toast.error('Có lỗi xảy ra khi lưu ghi chú');
    }
  });

  // Handlers
  const handleStatusChange = (applicantId, newStatus) => {
    updateStatusMutation.mutate({ id: applicantId, status: newStatus });
  };

  const handleRejectSubmit = (reason) => {
    if (!rejectModalData?.applicant) return;
    updateStatusMutation.mutate({ 
      id: rejectModalData.applicant.id, 
      status: 'rejected',
      reject_reason: reason 
    });
  };

  const handleNoteSubmit = (note) => {
    if (!noteModalData?.applicant) return;
    updateNoteMutation.mutate({
      id: noteModalData.applicant.id,
      employer_notes: note
    });
  };

  const handleClearFilters = () => {
    setSelectedJobId('');
    setSearchTerm('');
    setStatusFilter('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedJobId !== '' || searchTerm !== '' || statusFilter !== '';

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hồ sơ ứng viên</h1>
          <p className="text-sm text-gray-500">
            Hiển thị <span className="font-semibold text-gray-900">{applicants.length}</span> ứng viên 
            {hasActiveFilters ? ' phù hợp với bộ lọc' : ' từ tất cả tin tuyển dụng'}
          </p>
        </div>
        
        <ApplicantFilters 
          jobs={jobs}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isApplicantsLoading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-50 rounded-lg w-full"></div>
              ))}
            </div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <User size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có ứng viên nào</h3>
            <p className="text-gray-500 text-sm max-w-md">
              {hasActiveFilters 
                ? "Không tìm thấy ứng viên nào phù hợp với bộ lọc hiện tại. Vui lòng thử thay đổi các tiêu chí lọc."
                : "Bạn chưa nhận được hồ sơ ứng tuyển nào cho các vị trí đang tuyển dụng."}
            </p>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 bg-[#00b14f] text-white font-medium rounded-lg hover:bg-[#009944] transition-colors shadow-sm"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap">Thông tin ứng viên</th>
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap">Vị trí ứng tuyển</th>
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap">Ngày nộp</th>
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm text-center whitespace-nowrap">CV</th>
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap">Trạng thái</th>
                  <th className="py-4 px-4 font-semibold text-gray-700 text-sm text-center whitespace-nowrap">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applicants.map(app => (
                  <ApplicantRow
                    key={app.id}
                    app={app}
                    jobs={jobs}
                    onStatusChange={handleStatusChange}
                    isUpdatingStatus={updateStatusMutation.isPending && updateStatusMutation.variables?.id === app.id}
                    onOpenRejectModal={(applicant) => setRejectModalData({ applicant })}
                    onOpenNoteModal={(applicant) => setNoteModalData({ applicant })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <RejectModal
        isOpen={!!rejectModalData}
        onClose={() => setRejectModalData(null)}
        onSubmit={handleRejectSubmit}
        isSubmitting={updateStatusMutation.isPending}
      />

      <NoteModal
        isOpen={!!noteModalData}
        onClose={() => setNoteModalData(null)}
        initialNote={noteModalData?.applicant?.employer_notes}
        onSubmit={handleNoteSubmit}
        isSubmitting={updateNoteMutation.isPending}
      />
    </div>
  );
}