import axios from 'axios';

/**
 * CẤU HÌNH AXIOS CƠ BẢN
 * Mục đích: Tạo một instance (thực thể) Axios với cấu hình mặc định (Base URL và Headers)
 * giúp không phải gõ lại URL đầy đủ cho mỗi lần gọi API.
 */
const api = axios.create({
  // Sử dụng biến môi trường VITE_API_URL, nếu không có thì fallback về URL Production
  baseURL: (import.meta.env.VITE_API_URL || 'https://sinhvienjob-project.onrender.com/api') + '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * AXIOS INTERCEPTOR (BỘ CAN THIỆP REQUEST)
 * Mục đích: Tự động đính kèm Token xác thực vào Header của MỌI Request gửi lên Server.
 * Cơ chế: Trước khi request được gửi đi, nó sẽ chạy qua hàm này.
 */
api.interceptors.request.use(config => {
  // Lấy token đang lưu trong bộ nhớ trình duyệt
  const token = localStorage.getItem('token');
  if (token) {
    // Nếu có token, gắn nó vào header Authorization theo chuẩn Bearer Token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Trả lại config đã được gắn token để tiếp tục gửi đi
});

/**
 * OBJECT SERVICE (Tập hợp các hàm gọi API liên quan đến Công việc và Nhà tuyển dụng)
 * Mục đích: Chứa toàn bộ các hàm gọi API, giúp các Component gọi hàm này thay vì viết thẳng Axios vào Component,
 * giúp code sạch sẽ và dễ bảo trì hơn.
 */
export const jobService = {
  // =====================================
  // DÀNH CHO DASHBOARD NHÀ TUYỂN DỤNG
  // =====================================

  // Lấy thống kê tổng quan (Tổng số job, tổng số ứng viên...)
  getDashboardStats: async () => {
    const response = await api.get('/employer/dashboard/stats');
    return response.data; // Trả về dữ liệu gốc để Component tự xử lý
  },

  // Lấy 5 tin tuyển dụng vừa đăng gần đây nhất
  getRecentJobs: async () => {
    const response = await api.get('/employer/jobs/recent');
    return response.data;
  },

  // Lấy 5 hoạt động nộp đơn ứng tuyển gần đây nhất
  getRecentApplications: async () => {
    const response = await api.get('/employer/applications/recent');
    return response.data;
  },

  // =====================================
  // DÀNH CHO QUẢN LÝ CÔNG VIỆC (CRUD)
  // =====================================

  // Xem danh sách toàn bộ bài đăng của công ty đang đăng nhập
  getEmployerJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  },

  // Xem thống kê chi tiết của từng bài đăng (Số lượt xem, lượt ứng tuyển)
  getEmployerStats: async () => {
    const response = await api.get('/employer/jobs/stats');
    return response.data;
  },

  // Tạo một bài tuyển dụng mới (Gửi data lên Backend lưu)
  createJob: async (jobData) => {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  },

  // Cập nhật thông tin bài tuyển dụng (PUT request)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/employer/jobs/${id}`, jobData);
    return response.data;
  },

  // Xóa bài tuyển dụng
  deleteJob: async (id) => {
    const response = await api.delete(`/employer/jobs/${id}`);
    return response.data;
  },

  // Xem thông tin chi tiết của 1 bài tuyển dụng (dựa vào ID)
  getJobDetail: async (id) => {
    const response = await api.get(`/employer/jobs/${id}`);
    return response.data;
  },

  // =====================================
  // QUẢN LÝ ỨNG VIÊN VÀ DANH MỤC
  // =====================================

  // Lấy danh sách những người đã nộp đơn vào 1 bài đăng cụ thể
  getJobApplicants: async (id) => {
    const response = await api.get(`/employer/jobs/${id}/applications`);
    return response.data;
  },

  // Lấy toàn bộ danh sách CV ứng viên của công ty (có hỗ trợ filter qua params)
  getAllEmployerApplications: async (params = {}) => {
    const response = await api.get('/employer/applications', { params });
    return response.data;
  },

  // Cập nhật trạng thái duyệt CV của ứng viên (Đã duyệt / Từ chối) hoặc thêm ghi chú
  updateApplicationStatus: async (applicationId, status, extraData = {}) => {
    // Nếu có truyền status thì gộp vào payload, nếu không thì chỉ gộp extraData (như notes)
    const payload = status !== undefined ? { status, ...extraData } : { ...extraData };
    const response = await api.patch(`/employer/applications/${applicationId}`, payload);
    return response.data;
  },

  // Lấy danh mục Hình thức làm việc (Full-time, Part-time...) từ Backend
  getJobTypes: async () => {
    const response = await api.get('/categories/job-types');
    return response.data;
  },

  // Lấy danh sách Ngành nghề đang hoạt động
  getIndustries: async () => {
    const response = await api.get('/categories/industries');
    return response.data;
  },

  // =====================================
  // DÀNH CHO SINH VIÊN
  // =====================================

  // Bật/Tắt tính năng Lưu công việc (Lưu vào danh sách yêu thích)
  toggleSaveJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Lấy danh sách các công việc mà Sinh viên đã lưu (có phân trang)
  getSavedJobs: async (page = 1) => {
    const response = await api.get(`/saved-jobs?page=${page}`);
    return response.data;
  }
};
