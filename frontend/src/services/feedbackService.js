import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await axios.post(`${API_URL}/feedback`, feedbackData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};

export default feedbackService;
