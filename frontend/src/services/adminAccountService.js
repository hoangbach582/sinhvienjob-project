import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm lấy headers xác thực (Bearer token)
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const adminAccountService = {
  /**
   * Lấy danh sách tài khoản (employer hoặc student)
   * @param {Object} params - { type, status, search, date_from, date_to, page }
   */
  getAccounts: async (params = {}) => {
    const response = await axios.get(`${API_URL}/admin/accounts`, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Lấy chi tiết một tài khoản theo ID
   */
  getAccountDetail: async (id) => {
    const response = await axios.get(`${API_URL}/admin/accounts/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Duyệt tài khoản nhà tuyển dụng
   */
  approveAccount: async (id) => {
    const response = await axios.patch(`${API_URL}/admin/accounts/${id}/approve`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Cập nhật trạng thái tài khoản (active / locked)
   */
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/admin/accounts/${id}/status`, { status }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Xóa tài khoản (soft delete)
   */
  deleteAccount: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/accounts/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Bulk actions: duyệt / khóa nhiều tài khoản cùng lúc
   * @param {string[]} ids - Danh sách ID
   * @param {string} action - 'approve' | 'lock' | 'unlock' | 'delete'
   */
  bulkAction: async (ids, action) => {
    const response = await axios.post(`${API_URL}/admin/accounts/bulk-action`, { ids, action }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Xuất Excel danh sách tài khoản
   */
  exportExcel: async (params = {}) => {
    const response = await axios.get(`${API_URL}/admin/accounts/export`, {
      params: { ...params, format: 'excel' },
      headers: getAuthHeaders(),
      responseType: 'blob',
    });
    return response;
  },
};

export default adminAccountService;
