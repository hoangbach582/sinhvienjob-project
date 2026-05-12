import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const adminJobService = {
  getPendingJobs: async (page = 1) => {
    const response = await axios.get(`${API_URL}/admin/jobs/pending?page=${page}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  getAllJobs: async (status = '', page = 1) => {
    const response = await axios.get(`${API_URL}/admin/jobs?status=${status}&page=${page}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  approveJob: async (id) => {
    const response = await axios.post(`${API_URL}/admin/jobs/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  rejectJob: async (id, reason) => {
    const response = await axios.post(`${API_URL}/admin/jobs/${id}/reject`, { reason }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};

export default adminJobService;
