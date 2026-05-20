import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const adminIndustryService = {
  getIndustries: async (params) => {
    return axios.get(`${API_URL}/admin/industries`, { params, headers: getAuthHeaders() });
  },
  
  createIndustry: async (data) => {
    return axios.post(`${API_URL}/admin/industries`, data, { headers: getAuthHeaders() });
  },
  
  updateIndustry: async (id, data) => {
    return axios.put(`${API_URL}/admin/industries/${id}`, data, { headers: getAuthHeaders() });
  },
  
  toggleStatus: async (id) => {
    return axios.patch(`${API_URL}/admin/industries/${id}/toggle`, {}, { headers: getAuthHeaders() });
  },
  
  deleteIndustry: async (id) => {
    return axios.delete(`${API_URL}/admin/industries/${id}`, { headers: getAuthHeaders() });
  }
};

export default adminIndustryService;
