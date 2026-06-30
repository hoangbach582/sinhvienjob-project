import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const adminFeedbackService = {
  getFeedbacks: async (status = '', page = 1) => {
    let url = `${API_URL}/admin/feedbacks?page=${page}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  resolveFeedback: async (id) => {
    const response = await axios.post(`${API_URL}/admin/feedbacks/${id}/resolve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};

export default adminFeedbackService;
