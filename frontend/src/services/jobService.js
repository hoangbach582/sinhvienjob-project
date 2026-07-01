import axios from 'axios';

// Cấu hình axios (thường đã có file riêng như src/utils/axios.js, nếu chưa thì tạo ở đây tạm)
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Thêm token vào header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobService = {
  // ============ DASHBOARD ============

  // Lấy thống kê tổng quan dashboard
  getDashboardStats: async () => {
    const response = await api.get('/employer/dashboard/stats');
    return response.data;
  },

  // Lấy 5 tin tuyển dụng gần đây nhất
  getRecentJobs: async () => {
    const response = await api.get('/employer/jobs/recent');
    return response.data;
  },

  // Lấy 5 hoạt động ứng tuyển gần đây nhất
  getRecentApplications: async () => {
    const response = await api.get('/employer/applications/recent');
    return response.data;
  },

  // ============ JOBS ============

  // Lấy danh sách công việc của employer đang đăng nhập
  getEmployerJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  },

  // Thống kê
  getEmployerStats: async () => {
    const response = await api.get('/employer/jobs/stats');
    return response.data;
  },

  // Tạo công việc mới
  createJob: async (jobData) => {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  },

  // Cập nhật công việc
  updateJob: async (id, jobData) => {
    const response = await api.put(`/employer/jobs/${id}`, jobData);
    return response.data;
  },

  // Xóa công việc
  deleteJob: async (id) => {
    const response = await api.delete(`/employer/jobs/${id}`);
    return response.data;
  },

  // Lấy chi tiết một công việc
  getJobDetail: async (id) => {
    const response = await api.get(`/employer/jobs/${id}`);
    return response.data;
  },

  // Lấy danh sách ứng viên cho 1 job
  getJobApplicants: async (id) => {
    const response = await api.get(`/employer/jobs/${id}/applications`);
    return response.data;
  },

  // Lấy toàn bộ ứng viên của nhà tuyển dụng (có filter)
  getAllEmployerApplications: async (params = {}) => {
    const response = await api.get('/employer/applications', { params });
    return response.data;
  },

  // Cập nhật trạng thái ứng viên (hoặc thêm ghi chú)
  updateApplicationStatus: async (applicationId, status, extraData = {}) => {
    const payload = status !== undefined ? { status, ...extraData } : { ...extraData };
    const response = await api.patch(`/employer/applications/${applicationId}`, payload);
    return response.data;
  },

  // Lấy danh mục ngành nghề/loại hình
  getJobTypes: async () => {
    const response = await api.get('/categories/job-types');
    return response.data;
  },

  // Lấy danh mục ngành nghề đang hoạt động
  getIndustries: async () => {
    const response = await api.get('/categories/industries');
    return response.data;
  },

  // Lưu/Bỏ lưu công việc
  toggleSaveJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Lấy danh sách việc làm đã lưu
  getSavedJobs: async (page = 1) => {
    const response = await api.get(`/saved-jobs?page=${page}`);
    return response.data;
  }
};
