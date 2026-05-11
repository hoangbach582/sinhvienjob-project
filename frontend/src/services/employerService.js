import axios from 'axios';

// Sử dụng đúng baseURL của Laravel Backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
  }
});

// Thêm token vào header cho mọi request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const employerService = {
    // Lấy thông tin profile
    getEmployerProfile: async () => {
        const response = await api.get('/employer/profile');
        return response.data;
    },

    // Cập nhật thông tin profile (sử dụng FormData cho file upload)
    updateEmployerProfile: async (formData) => {
        const response = await api.post('/employer/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }
};

export default employerService;
